from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import subprocess
import tempfile
import os
from processor.utils import *

STAGES = ["IF", "ID", "EX", "MEM", "WB"]
BRANCH_INSTRUCTION = ["beq", "bne", "blt", "bge", "bltu", "bgeu"]

def is_branch(instruction):
    l = ["beq", "bne", "blt", "bge", "bltu", "bgeu", "jal", "jalr"]
    return any(branch in instruction for branch in l)

def merge_output(output1, output2):
    branch_taken = []
    for i in range(len(output2["pipeline_state"])):
        stage = output2["pipeline_state"][i]
        if is_branch(stage.get("MEM", "")) and stage.get("EX", STALL) == STALL \
            and stage.get("ID", STALL) == STALL:
            branch_taken.append(i)
    pipeline_stages = output1["pipeline_state"]
    for j in branch_taken:
        pipeline_stages[j]["ID"] = FLUSH
        pipeline_stages[j]["EX"] = FLUSH
        pipeline_stages[j+1]["EX"] = FLUSH
        pipeline_stages[j+1]["MEM"] = FLUSH
        pipeline_stages[j-1]["ex_branch_condition"] = True
        pipeline_stages[j]["mem_branch_condition"] = True
        try:
            pipeline_stages[j+2]["MEM"] = FLUSH
            pipeline_stages[j+2]["WB"] = FLUSH
            pipeline_stages[j+3]["WB"] = FLUSH
        except:
            pass
    return output1

def change_branch_offset(code: str) -> str:
    lines = code.strip().splitlines()
    new_lines = []

    for line in lines:
        parts = line.strip().split()
        if not parts:
            new_lines.append(line)
            continue

        opcode = parts[0]
        if opcode in BRANCH_INSTRUCTION:
            # Extract operands (assuming comma-separated)
            operands = [x.strip() for x in " ".join(parts[1:]).split(",")]
            if len(operands) == 3:
                try:
                    offset = int(operands[2])
                    operands[2] = str(offset * 2)
                    line = f"{opcode} {operands[0]}, {operands[1]}, {operands[2]}"
                except ValueError:
                    pass  # leave unchanged if offset isn't an integer
        new_lines.append(line)

    return "\n".join(new_lines)

def restore_branch_offset(info):
    for entry in info["pipeline_state"]:
        for stage, instr in entry.items():
            if stage == "cycle" or not isinstance(instr, str):
                continue

            parts = instr.strip().split()
            opcode = parts[0]
            if opcode in BRANCH_INSTRUCTION:
                entry[stage] = f"{opcode} {parts[1]} {parts[2]} {int(parts[3])//2}"

@csrf_exempt
def run_processor(request):
    os.environ["QT_QPA_PLATFORM"] = "offscreen"
    proc_options = ["RV32_5S_NO_FW_HZ", "RV32_5S_NO_HZ", "RV32_5S_NO_FW", "RV32_5S"]

    if request.method != "POST":
        return JsonResponse({"error": "Only POST requests are allowed"}, status=405)

    # try:
    data = json.loads(request.body.decode("utf-8"))
    asm_code = data.get("asm_code", "")
    asm_code = change_branch_offset(asm_code)
    proc = data.get("proc", "RV32_5S")
    register_init = data.get("register_init", "")

    if proc not in proc_options:
        raise Exception("Invalid processor option.")

    # ✅ Parse register initialization input
    reginit_arg = ""
    if register_init.strip():
        reg_pairs = []
        seen_regs = []
        try:
            for pair in register_init.split(","):
                pair = pair.strip()
                if not pair:
                    continue
                if "=" not in pair:
                    raise ValueError("missing '=' in register assignment")

                reg, val = pair.split("=", 1)
                reg = reg.strip().lower()
                val = val.strip()

                # must have a nonempty value
                if not val:
                    raise ValueError(f"empty value for {reg}")

                # remove 'x' prefix if present
                if reg.startswith("x"):
                    reg = reg[1:]

                # must be numeric 0–31
                if not reg.isdigit() or not (0 <= int(reg) <= 31):
                    raise ValueError(f"invalid register index '{reg}'")

                # check duplicate
                if reg in seen_regs:
                    raise ValueError(f"duplicate register 'x{reg}'")
                seen_regs.append(reg)

                reg_pairs.append(f"{reg}={val}")

            if not reg_pairs:
                raise ValueError("no valid register assignments")

            reginit_arg = ",".join(reg_pairs)

        except ValueError as e:
            return JsonResponse({
                "status": "error",
                "info": {"error":f"ERROR: bad register initialization: {str(e)}"}
            }, status=400)
    # ✅ Create two temp assembly files
    with tempfile.NamedTemporaryFile(delete=False, suffix=".s", mode="w") as tmp1, \
            tempfile.NamedTemporaryFile(delete=False, suffix=".s", mode="w") as tmp2:

        for line in asm_code.splitlines():
            cleaned = line.strip()
            if cleaned:
                tmp1.write(cleaned + "\n")
                tmp2.write(cleaned + "\n")
        tmp2.write("nop")
        src_path_1 = tmp1.name
        src_path_2 = tmp2.name

    # ✅ Build base CLI args
    base_args = [
        "./processor/Ripes",
        "--mode", "cli",
        "-t", "asm",
        "--proc", proc,
        "--all",
    ]

    # ✅ Append register initialization if available
    if reginit_arg:
        base_args.extend(["--reginit", reginit_arg])

    # ✅ Run Ripes CLI on both files
    result1 = subprocess.run(
        base_args + ["--src", src_path_1],
        capture_output=True,
        text=True,
    )
    result2 = subprocess.run(
        base_args + ["--src", src_path_2],
        capture_output=True,
        text=True,
    )

    if result1.stdout.startswith("ERROR"):
        return JsonResponse({
            "status": "error",
            "info": {"error": result1.stdout}
        }, status=400)

    # ✅ Parse both outputs
    output1 = parse_ripes_output(result1.stdout)
    output2 = parse_ripes_output(result2.stdout)
    output = merge_output(output1, output2)
    restore_branch_offset(output)

    # ✅ Cleanup
    for path in [src_path_1, src_path_2]:
        if os.path.exists(path):
            os.remove(path)

    return JsonResponse({
        "status": "success",
        "info": output,
    })

    # except Exception as e:
    #     # Attempt cleanup if files exist and an error occurred
    #     try:
    #         for path in [locals().get("src_path_1"), locals().get("src_path_2")]:
    #             if path and os.path.exists(path):
    #                 os.remove(path)
    #     except Exception:
    #         pass

    #     return JsonResponse({
    #         "status": "error",
    #         "message": str(e)
    #     }, status=500)
