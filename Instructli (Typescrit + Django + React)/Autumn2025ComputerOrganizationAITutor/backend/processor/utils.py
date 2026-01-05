import re
import json
import logging
log = logging.getLogger(__name__)

STAGES = ["IF", "ID", "EX", "MEM", "WB"]
STALL = "bubble (stall)"
FLUSH = "bubble (flush)"
def maybe_convert(stage_instance):
    left = 5
    activation = False
    right = 0
    for i in range(len(STAGES)):
        if STAGES[i] in stage_instance:
            activation = True
        elif activation and STAGES[i] not in stage_instance:
            left = i
            break
    activation = False
    for i in range(len(STAGES)-1, -1, -1):
        if STAGES[i] in stage_instance:
            activation = True
        elif activation and STAGES[i] not in stage_instance:
            right = i
            break
    for x in range(left, right+1):
        stage_instance[STAGES[x]] = STALL
    return stage_instance

    

def parse_pipeline_section(pipeline_text: str, cycles):
    lines = [l.split("\t") for l in pipeline_text.splitlines()][2:]
    instructions = []
    bubble_pad = []
    stall_index = []
    for l in lines:
        l.extend([""]*(cycles+1-len(l)))
        instance = {"instruction": l[0]}
        for i in range(1, cycles+1):
            if l[i] == "-":
                instance[i] = instance[i-1]
                stall_index.append(i-1)
                stall_index.append(i+1)
            else:
                instance[i] = l[i]
        instructions.append(instance)
    stages = []
    for i in range(1, cycles+1):
        instance = {"cycle": i}
        for instruction in instructions:
            if instruction[i] != "":
                instance[instruction[i]] = instruction["instruction"]
        stages.append(maybe_convert(instance))
    for i in range(0, len(stages)-1):
        if 2 == sum(v == "bubble (stall)" for v in stages[i].values()) and \
            2 != sum(v == "bubble (stall)" for v in stages[i+1].values()):
            bubble_pad.append(i+1)
    for x in bubble_pad:
        try:
            stages[x]["MEM"] = "bubble (stall)"
            stages[x]["WB"] = "bubble (stall)"
            stages[x+1]["WB"] = "bubble (stall)"
        except:
            continue
    # for x in stall_index:
    #     for o in stages[x]:
    #         if stages[x][o] == "bubble":
    #             stages[x][o] = "bubble (stall)"
    return stages


def parse_registers_section(section_text: str):
    regs = {}
    for line in [l for l in section_text.splitlines() if l.strip()]:
        parts = re.split(r"\s+", line.strip())
        if len(parts) >= 3 and parts[0].endswith(":"):
            name = parts[0][:-1]
            regs[name] = int(parts[1])
    return regs


def parse_sim_info_section(section_text: str):
    info = {}
    for line in [l.strip() for l in section_text.splitlines() if l.strip()]:
        if ":" in line:
            k, v = line.split(":", 1)
            info[k.strip()] = v.strip()
    return info


def parse_ripes_output(output: str):
    sections = re.split(r"===== ", output.strip())
    parsed = {}

    for section in sections:
        section = section.strip()
        if not section:
            continue

        title, *body_lines = section.splitlines()
        title_lower = title.strip().lower()
        body = "\n".join(body_lines).strip()

        # Basic metrics
        if title_lower == "cycles":
            parsed["cycles"] = int(body.strip())
        elif title_lower == "instructions retired":
            parsed["instructions_retired"] = int(body.strip())
        elif title_lower.startswith("cycles per instruction"):
            parsed["cpi"] = float(body.strip())
        elif title_lower.startswith("instructions per cycle"):
            parsed["ipc"] = float(body.strip())

        # Complex sections
        elif title_lower == "pipeline state":
            parsed["pipeline_state"] = parse_pipeline_section(section, parsed["cycles"])
        elif title_lower == "register values":
            parsed["register_values"] = parse_registers_section(body)
        # elif title_lower.startswith("simulation information"):
        #     parsed["simulation_info"] = parse_sim_info_section(body)

    return parsed if parsed else output


