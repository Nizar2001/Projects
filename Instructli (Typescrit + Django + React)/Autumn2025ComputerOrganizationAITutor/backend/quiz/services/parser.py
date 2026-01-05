import random
import re
from typing import Dict, Any, List, Tuple


VariableMap = Dict[str, Any]


def _strip_prefix(value: str, prefixes: Tuple[str, ...]) -> str: # sip
    """Strip the prefix from the value.

    value: value to strip the prefix from
    prefixes: tuple of prefixes to strip

    example:
    >>> _strip_prefix('0x10', ('0x', '0X'))
    '10'
    >>> _strip_prefix('0b1010', ('0b',))
    '1010'
    """
    for p in prefixes:
        if value.startswith(p):
            return value[len(p):]
    return value


def _to_hex_no_prefix(value: int, width_bits: int | None = None) -> str:
    if width_bits is not None and width_bits > 0:
        width_nibbles = (width_bits + 3) // 4
        return format(value & ((1 << width_bits) - 1), f"0{width_nibbles}x")
    return format(value, "x")


def _int_from_hex(s: str) -> int:
    return int(_strip_prefix(s.upper(), ("0X",)), 16)


def _int_from_bin(s: str) -> int: # sip
    """Convert a binary string to an unsigned integer.
    
    s: binary string

    example:
    >>> _int_from_bin('0b1010')
    10
    >>> _int_from_bin('0b10100')
    20
    """
    return int(_strip_prefix(s.lower(), ("0b",)), 2)


def _bin_str(value: int, width: int) -> str: # sip
    """Convert an integer to a binary string (signed or unsigned).
    This function works as long as no overflow occurs.
    
    value: integer
    width: width of the binary number

    example:
    >>> _bin_str(10, 4)
    '1010'
    >>> _bin_str(20, 8)
    '00010100'
    >>> _bin_str(236, 8)
    '11101100'
    >>> _bin_str(-10, 6)
    '110110'

    """
    return format(value & ((1 << width) - 1), f"0{width}b")


def _signed_from_twos_complement(value: int, bits: int) -> int: # sip
    """Convert an unsigned integer in two's complement format to a signed integer.
    
    value: two's complement number in binary string
    bits: width of the two's complement number

    example:
    >>> _signed_from_twos_complement(10, 4)
    -6
    >>> _signed_from_twos_complement(int('11111100', 2), 8)
    -4
    >>> _signed_from_twos_complement(1, 6)
    1
    """
    mask = (1 << bits) - 1
    value &= mask
    sign_bit = 1 << (bits - 1)
    return value - (1 << bits) if (value & sign_bit) else value


def _encode_riscv_r(opcode: int, funct3: int, funct7: int, rd: int, rs1: int, rs2: int) -> int:
    """Encode a RISC-V R-type instruction.
    
    R-type format: funct7[31:25] | rs2[24:20] | rs1[19:15] | funct3[14:12] | rd[11:7] | opcode[6:0]
    
    opcode: 7-bit instruction opcode 
    funct3: 3-bit function code 
    funct7: 7-bit function code 
    rd: 5-bit destination register number (0-31)
    rs1: 5-bit first source register number (0-31)
    rs2: 5-bit second source register number (0-31)

    >>> format(_encode_riscv_r(0x33, 0x0, 0x00, 1, 2, 3), '032b') # add x1, x2, x3
    '00000000001100010000000010110011'
    >>> format(_encode_riscv_r(0x33, 0x0, 0x20, 1, 2, 3), '032b') # sub x1, x2, x3
    '01000000001100010000000010110011'
    """
    return ((funct7 & 0x7F) << 25) | ((rs2 & 0x1F) << 20) | ((rs1 & 0x1F) << 15) | ((funct3 & 0x7) << 12) | ((rd & 0x1F) << 7) | (opcode & 0x7F)


def _encode_riscv_i(opcode: int, funct3: int, rd: int, rs1: int, imm: int) -> int:
    """Encode a RISC-V I-type instruction.
    
    I-type format: imm[31:20] | rs1[19:15] | funct3[14:12] | rd[11:7] | opcode[6:0]

    opcode: 7-bit instruction opcode (e.g., 0x13 for ADDI, 0x03 for LB, 0x67 for JALR)
    funct3: 3-bit function code (e.g., 0x0 for ADDI/LB, 0x1 for SLLI, 0x5 for SRLI)
    rd: 5-bit destination register number (0-31)
    rs1: 5-bit source register number (0-31)
    imm: 12-bit signed immediate value (-2048 to 2047)
    
    >>> format(_encode_riscv_i(0x13, 0x0, 1, 2, 10), '032b')  # addi x1, x2, 10
    '00000000101000010000000010010011'
    >>> format(_encode_riscv_i(0x03, 0x0, 1, 2, 10), '032b') # lb x1, 10(x2)
    '00000000101000010000000010000011'
    """
    imm &= 0xFFF
    return ((imm & 0xFFF) << 20) | ((rs1 & 0x1F) << 15) | ((funct3 & 0x7) << 12) | ((rd & 0x1F) << 7) | (opcode & 0x7F)


def _encode_riscv_s(opcode: int, funct3: int, rs1: int, rs2: int, imm: int) -> int:
    """Encode a RISC-V S-type instruction.
    
    S-type format: imm[11:5][31:25] | rs2[24:20] | rs1[19:15] | funct3[14:12] | imm[4:0][11:7] | opcode[6:0]
    
    The 12-bit immediate is split: upper 7 bits (imm[11:5]) go to bits [31:25],
    and lower 5 bits (imm[4:0]) go to bits [11:7].
    
    opcode: 7-bit instruction opcode (e.g., 0x23 for SB, SH, SW)
    funct3: 3-bit function code (e.g., 0x0 for SB, 0x1 for SH, 0x2 for SW)
    rs1: 5-bit base address register number (0-31)
    rs2: 5-bit source register to store (0-31)
    imm: 12-bit signed immediate offset (-2048 to 2047)
    
    
    >>> format(_encode_riscv_s(0x23, 0x0, 1, 2, 10), '032b') # sb x2, 10(x1)
    '00000000001000001000010100100011'
    >>> format(_encode_riscv_s(0x23, 0x0, 1, 2, -10), '032b')  # Negative offset
    '11111110001000001000101100100011'
    """
    imm &= 0xFFF
    imm_11_5 = (imm >> 5) & 0x7F
    imm_4_0 = imm & 0x1F
    return (imm_11_5 << 25) | ((rs2 & 0x1F) << 20) | ((rs1 & 0x1F) << 15) | ((funct3 & 0x7) << 12) | ((imm_4_0 & 0x1F) << 7) | (opcode & 0x7F)


def _encode_riscv_b(opcode: int, funct3: int, rs1: int, rs2: int, imm: int) -> int:
    """Encode a RISC-V B-type instruction.
    
    B-type format: imm[12|10:5][31:25] | rs2[24:20] | rs1[19:15] | funct3[14:12] | imm[4:1|11][11:7] | opcode[6:0]
    
    The 13-bit signed immediate is rearranged: imm[12] goes to bit 31,
    imm[10:5] goes to bits [30:25], imm[4:1] goes to bits [11:8],
    imm[11] goes to bit 7, and bit 0 is implicitly 0.
    
    opcode: 7-bit instruction opcode (0x63 for branch instructions)
    funct3: 3-bit function code (0x0 for BEQ, 0x1 for BNE, 0x4 for BLT, etc.)
    rs1: 5-bit first source register number (0-31)
    rs2: 5-bit second source register number (0-31)
    imm: 13-bit signed immediate offset (-4096 to 4094, must be even)
    
    >>> format(_encode_riscv_b(0x63, 0x0, 1, 2, 10), '032b') # beq x1, x2, 10
    '00000000001000001000010101100011'
    >>> format(_encode_riscv_b(0x63, 0x1, 1, 2, 10), '032b') # bne x1, x2, 10
    '00000000001000001001010101100011'
    """
    imm = imm << 1
    imm &= 0x1FFF
    bit12 = (imm >> 12) & 0x1
    bits10_5 = (imm >> 5) & 0x3F
    bits4_1 = (imm >> 1) & 0xF
    bit11 = (imm >> 11) & 0x1
    return (bit12 << 31) | (bits10_5 << 25) | ((rs2 & 0x1F) << 20) | ((rs1 & 0x1F) << 15) | ((funct3 & 0x7) << 12) | (bits4_1 << 8) | (bit11 << 7) | (opcode & 0x7F)


def _encode_riscv_u(opcode: int, rd: int, imm: int) -> int:
    """Encode a RISC-V U-type instruction.
    
    U-type format: imm[31:12] | rd[11:7] | opcode[6:0]
    
    The immediate value's upper 20 bits are placed directly in bits [31:12],
    effectively shifting the immediate left by 12 positions.
    
    opcode: 7-bit instruction opcode (e.g., 0x37 for LUI, 0x17 for AUIPC)
    rd: 5-bit destination register number (0-31)
    imm: 20-bit immediate value (upper bits of 32-bit value)
    
    >>> format(_encode_riscv_u(0x37, 1, 0x12345), '032b') # lui x1, 0x12345
    '00010010001101000101000010110111'
    >>> format(_encode_riscv_u(0x37, 1, 0xFFFFF), '032b') # lui x1, 0xFFFFF
    '11111111111111111111000010110111'
    """
    imm &= 0xFFFFF  # Keep only 20 bits
    imm_31_12 = imm & 0xFFFFF
    return ((imm_31_12 & 0xFFFFF) << 12) | ((rd & 0x1F) << 7) | (opcode & 0x7F)


def _encode_riscv_j(opcode: int, rd: int, imm: int) -> int:
    """Encode a RISC-V J-type instruction.
    
    J-type format: imm[20|10:1|11|19:12] | rd[11:7] | opcode[6:0]

    
    opcode: 7-bit instruction opcode (0x6F for JAL)
    rd: 5-bit destination register number (0-31)
    imm: 21-bit signed immediate offset (bit 0 is implicit 0, must be even)

    >>> format(_encode_riscv_j(0x6F, 1, 100), '032b') # jal x1, 100
    '00000110010000000000000011101111'
    >>> format(_encode_riscv_j(0x6F, 1, -100), '032b')  # jal x1, -100
    '11111001110111111111000011101111'
    """
    # Handle sign extension for 21-bit immediate
    if imm < 0:
        # Sign extend: set upper bits
        imm = imm | 0xFFE00000  # Set bits 31:21 for negative values
    imm &= 0x1FFFFF  # Keep only 21 bits
    
    # Extract and rearrange bits according to J-type format: imm[20|10:1|11|19:12]
    bit20 = (imm >> 20) & 0x1           # bit 31
    bits10_1 = (imm >> 1) & 0x3FF       # bits 30:21 (10 bits)
    bit11 = (imm >> 11) & 0x1           # bit 20
    bits19_12 = (imm >> 12) & 0xFF      # bits 19:12 (8 bits)
    
    return (bit20 << 31) | (bits10_1 << 21) | (bit11 << 20) | (bits19_12 << 12) | ((rd & 0x1F) << 7) | (opcode & 0x7F)


# Generators
def gen_random_hex_len(n: int) -> str:
    """Generate a random hexadecimal number of length n.
    """
    return ''.join(random.choice('0123456789ABCDEF') for _ in range(n))


def gen_random_binary_len(n: int) -> str:
    """Generate a random binary number of length n.
    """
    return ''.join(random.choice('01') for _ in range(n))


def gen_random_decimal_len(n: int) -> int:
    """Generate a random decimal number of length n.
    """
    low = 10 ** (n - 1)
    high = (10 ** n) - 1
    return random.randint(low, high)


def gen_random_between(a: int, b: int, div=1) -> int:
    """Generate a random integer between a and b.
    """
    return random.randint(a, b)*div


def gen_random_negative_binary_len(n: int) -> str:
    """Generate a random negative binary number of length n.
    """
    # choose a negative value in range [-2^{n-1}, -1]
    magnitude = random.randint(1, (1 << (n - 1)) - 1)
    value = ((1 << n) - magnitude) & ((1 << n) - 1)
    return _bin_str(value, n)


# Converters and operations
def fn_hex_to_binary(x: str) -> str:
    """Convert hexadecimal to unsigned binary.

    x: hexadecimal string

    example: 
    >>> fn_hex_to_binary('0x10')
    '00010000'
    >>> fn_hex_to_binary('0xFC87')
    '1111110010000111'
    """
    x = _strip_prefix(x, ("0x", "0X"))
    width = len(x) * 4
    return _bin_str(int(x, 16), width)


def fn_hex_to_decimal(x: str) -> str:
    """Convert unsigned hexadecimal to decimal. 
    
    x: hexadecimal string

    example:
    >>> fn_hex_to_decimal('0x10')
    '16'
    >>> fn_hex_to_decimal('0xFC87')
    '64647'
    """
    return str(int(_strip_prefix(x, ("0x", "0X")), 16))


def fn_hex_to_octal(x: str) -> str:
    """Convert unsigned hexadecimal to unsigned octal.
    
    x: hexadecimal string

    example:
    >>> fn_hex_to_octal('0x10')
    '20'
    >>> fn_hex_to_octal('0xFC87')
    '176207'
    """
    return format(int(_strip_prefix(x, ("0x", "0X")), 16), 'o') 


def fn_binary_to_decimal(x: str) -> str:
    """Convert unsigned binary to decimal.
    
    x: binary string

    example:
    >>> fn_binary_to_decimal('0b1010')
    '10'
    >>> fn_binary_to_decimal('1111110010000111')
    '64647'
    """
    return str(int(_strip_prefix(x, ("0b",)), 2))


def fn_decimal_to_binary(x: int) -> str:
    """Convert decimal to unsigned binary.
    
    x: decimal integer

    example:
    >>> fn_decimal_to_binary(10)
    '1010'
    >>> fn_decimal_to_binary(20)
    '10100'
    """
    return format(int(x), 'b')


def fn_decimal_to_two_complement(value: int, bits: int) -> str:
    """Convert decimal to two's complement binary.
    
    value: decimal integer
    bits: width of the two's complement number

    example:
    >>> fn_decimal_to_two_complement(10, 6)
    '001010'
    >>> fn_decimal_to_two_complement(20, 8)
    '00010100'
    >>> fn_decimal_to_two_complement(-10, 6)
    '110110'
    >>> fn_decimal_to_two_complement(-20, 8)
    '11101100'
    """
    value = int(value)
    bits = int(bits)
    mask = (1 << bits) - 1
    if value < 0:
        value = (value + (1 << bits)) & mask
    return _bin_str(value, bits)


def fn_two_complement_to_decimal(binary: str) -> str:
    """Convert two's complement (signed binary) to decimal.
    
    binary: binary string

    example:
    >>> fn_two_complement_to_decimal('1010')
    '-6'
    >>> fn_two_complement_to_decimal('11111100')
    '-4'
    >>> fn_two_complement_to_decimal('1')
    '-1'
    >>> fn_two_complement_to_decimal('00000001')
    '1'
    """
    bits = len(binary)
    value = _int_from_bin(binary)
    return str(_signed_from_twos_complement(value, bits))


def fn_hex_to_two_complement(x: str, bits: int) -> str:
    """
    Convert hexadecimal to two's complement.
    
    x: hexadecimal string
    bits: width of the two's complement number

    example:
    >>> fn_hex_to_two_complement('0x10', 4)
    '0000'
    >>> fn_hex_to_two_complement('0xA', 4)
    '1010'
    """
    value = int(_strip_prefix(x, ("0x", "0X")), 16)
    return _bin_str(value, int(bits))


def fn_two_complement_subtraction(a_bin: str, b_bin: str) -> str:
    """Subtract two two's complement numbers (signed binary) 
    with bit length of max(len(a_bin), len(b_bin)) bits.
    The result is a_bin - b_bin in two's complement binary format.
    
    a_bin: binary string of the first number
    b_bin: binary string of the second number

    example:
    >>> fn_two_complement_subtraction('1010', '10100')
    '22'
    >>> fn_two_complement_subtraction('11111100', '1010')
    '-14'
    """
    bits = max(len(a_bin), len(b_bin))
    a_val = _signed_from_twos_complement(_int_from_bin(a_bin), bits)
    b_val = _signed_from_twos_complement(_int_from_bin(b_bin), bits)
    return str(a_val - b_val)


def fn_hex_subtraction(a_hex: str, b_hex: str) -> str: # sip
    """Subtract two unsigned hexadecimal numbers.
    
    a_hex: hexadecimal string of the first number
    b_hex: hexadecimal string of the second number

    note : this function assumes the two numbers are unsigned 16-bit integers.
    The result is a_hex - b_hex in unsigned hexadecimal format.
    
    example:
    >>> fn_hex_subtraction('0x10', '0x100') # 16 - 256 = -240
    'FF10'
    """
    a = int(_strip_prefix(a_hex, ("0x", "0X")), 16)
    b = int(_strip_prefix(b_hex, ("0x", "0X")), 16)
    res = (a - b) & 0xFFFF
    return format(res, '04X')


def fn_sign_magnitude_addition_decimal(a_byte: int, b_byte: int) -> str:
    """Add two sign-magnitude numbers. 
    The result is a_byte + b_byte in decimal format.
    
    a_byte: byte of the first number between 0-255 inclusive.
    b_byte: byte of the second number between 0-255 inclusive.

    a_byte and b_byte can be passed in decimal, hexadecimal, or binary format.

    example:
    >>> fn_sign_magnitude_addition_decimal(0x10, 0x100) # 16 + 0 = 16 
    '16'
    >>> fn_sign_magnitude_addition_decimal(255, 1) # 255 + 1 = -126 (sign-magnitude)
    '-126'
    >>>
    """
    def decode(n: int) -> int:
        n &= 0xFF
        sign = (n >> 7) & 1
        mag = n & 0x7F
        return -mag if sign else mag
    a = decode(int(a_byte))
    b = decode(int(b_byte))
    return str(a + b)


def fn_sign_magnitude_subtraction_decimal(a_byte: int, b_byte: int) -> str:
    def decode(n: int) -> int:
        n &= 0xFF
        sign = (n >> 7) & 1
        mag = n & 0x7F
        return -mag if sign else mag
    a = decode(int(a_byte))
    b = decode(int(b_byte))
    return str(a - b)
 

def fn_two_complement_addition_decimal(a_byte: int, b_val: int) -> str:
    """Add two two's complement numbers.
    
    a_byte: byte of the first number between -128-127 inclusive.
    b_val: byte of the second number between -128-127 inclusive.

    a_byte and b_val can be passed in decimal, hexadecimal, or binary format.

    example:
    >>> fn_two_complement_addition_decimal(0x10, 0x100) # 16 + 0 = 16 
    '16'
    >>> fn_two_complement_addition_decimal(255, 1) 
    '0'
    >>> fn_two_complement_addition_decimal(-128, -1) # -128 + -1 = -129
    '-129'
    """
    def decode_twos(n: int) -> int:
        n &= 0xFF # ensure the number is within 8 bits
        return n - 256 if n >= 128 else n
    a = decode_twos(int(a_byte))
    # b_val may be already negative via negate(), or a raw byte
    if -255 <= int(b_val) <= 255 and int(b_val) < 0:
        b = int(b_val)
    else:
        b = decode_twos(int(b_val))
    return str(a + b)


def fn_two_complement_subtraction_decimal(a_byte: int, b_val: int) -> str:
    def decode_twos(n: int) -> int:
        n &= 0xFF # ensure the number is within 8 bits
        return n - 256 if n >= 128 else n
    a = decode_twos(int(a_byte))
    # b_val may be already negative via negate(), or a raw byte
    if -255 <= int(b_val) <= 255 and int(b_val) < 0:
        b = int(b_val)
    else:
        b = decode_twos(int(b_val))
    return str(a - b)


def fn_negate(x: int) -> int:
    """Negate a number.
    
    x: number

    example:
    >>> fn_negate(10)
    -10
    """
    return -int(x)


def fn_instruction_represent(op: str, xrd: str, xrs1_or_xrs2: str, xrs2_or_imm: str) -> str:
    """Represent a RISC-V instruction as a 32-bit binary string.
    Returns the 32-bit instruction encoding as a binary string.
    
    Parameters:
        op: Instruction opcode. Supported instructions:
            - R-type: 'add', 'sub'
            - I-type: 'addi', 'lb', 'slli', 'srli', 'jalr'
            - S-type: 'sb'
            - B-type: 'beq', 'bne'
            - J-type: 'jal'
            - U-type: 'lui'
        xrd: Destination register (e.g., 'x1', 'x2', etc.) or source register for store/branch
        xrs1_or_xrs2: Source register 1 (for R/I/B/S types) or immediate (for J/U types)
        xrs2_or_imm: Source register 2 (for R/B/S types) or immediate value (for I/J types)
    
    R-type instructions:
    >>> fn_instruction_represent('add', 'x1', 'x2', 'x3')
    '00000000001100010000000010110011'
    >>> fn_instruction_represent('sub', 'x1', 'x2', 'x3')
    '01000000001100010000000010110011'
    
    I-type instructions:
    >>> fn_instruction_represent('addi', 'x1', 'x2', '10')
    '00000000101000010000000010010011'
    >>> fn_instruction_represent('addi', 'x1', 'x2', '-10')  # Negative immediate
    '11111111011000010000000010010011'
    >>> fn_instruction_represent('lb', 'x1', 'x2', '10')
    '00000000101000010000000010000011'
    >>> fn_instruction_represent('slli', 'x1', 'x2', '5')
    '00000000010100010001000010010011'
    >>> fn_instruction_represent('srli', 'x1', 'x2', '3')
    '00000000001100010101000010010011'
    >>> fn_instruction_represent('jalr', 'x1', 'x2', '10')
    '00000000101000010000000011100111'
    
    S-type instructions:
    >>> fn_instruction_represent('sb', 'x2', 'x1', '10')  # sb rs2, imm(rs1)
    '00000000001000001000010100100011'
    
    B-type instructions:
    >>> fn_instruction_represent('beq', 'x1', 'x2', '10')
    '00000000001000001000010101100011'
    >>> fn_instruction_represent('bne', 'x1', 'x2', '10')
    '00000000001000001001010101100011'
    
    J-type instructions:
    >>> fn_instruction_represent('jal', 'x1', '100', '0')  # jal rd, offset
    '00000110010000000000000011101111'
    
    U-type instructions:
    >>> fn_instruction_represent('lui', 'x1', '0x12345', '0')  # Hex immediate
    '00010010001101000101000010110111'
    >>> fn_instruction_represent('lui', 'x1', '74565', '0')  # Decimal immediate
    '00010010001101000101000010110111'
    """
    op = str(op).lower()
    
    # Helper function to extract register number
    def get_reg(reg_str: str) -> int:
        # Handle unresolved variables or None values
        if reg_str is None:
            raise ValueError("Register string is None. Variable may not be resolved.")
        if isinstance(reg_str, str) and reg_str.startswith('$'):
            raise ValueError(f"Unresolved variable {reg_str} in instruction_represent. Variables must be resolved before calling this function.")
        reg_str = str(reg_str)
        return int(_strip_prefix(reg_str.lower(), ('x',)))
    
    # Helper function to parse immediate value (hex or decimal)
    def get_imm(imm_str: str) -> int:
        if isinstance(imm_str, str) and imm_str.lower().startswith('0x'):
            return int(imm_str, 16)
        return int(imm_str)
    
    # R-type instructions: add, sub
    if op == 'add':
        rd = get_reg(xrd)
        rs1 = get_reg(xrs1_or_xrs2)
        rs2 = get_reg(xrs2_or_imm)
        word = _encode_riscv_r(0x33, 0x0, 0x00, rd, rs1, rs2)
        return format(word & 0xFFFFFFFF, '08x')
    
    if op == 'sub':
        rd = get_reg(xrd)
        rs1 = get_reg(xrs1_or_xrs2)
        rs2 = get_reg(xrs2_or_imm)
        word = _encode_riscv_r(0x33, 0x0, 0x20, rd, rs1, rs2)  # funct7 = 0x20 for sub
        return format(word & 0xFFFFFFFF, '08x')
    
    # I-type instructions: addi, lb, slli, srli, jalr
    if op == 'addi':
        rd = get_reg(xrd)
        rs1 = get_reg(xrs1_or_xrs2)
        imm = get_imm(xrs2_or_imm)
        word = _encode_riscv_i(0x13, 0x0, rd, rs1, imm)  # opcode 0x13 = 0010011
        return format(word & 0xFFFFFFFF, '08x')
    
    if op == 'lb':
        rd = get_reg(xrd)
        rs1 = get_reg(xrs1_or_xrs2)
        imm = get_imm(xrs2_or_imm)
        word = _encode_riscv_i(0x03, 0x0, rd, rs1, imm)  # opcode 0x03 = 0000011
        return format(word & 0xFFFFFFFF, '08x')
    
    if op == 'slli':
        rd = get_reg(xrd)
        rs1 = get_reg(xrs1_or_xrs2)
        shamt = get_imm(xrs2_or_imm) & 0x1F  # shift amount (only lower 5 bits)
        # slli uses I-type format: imm[11:5] must be 0 (acts as funct7), imm[4:0] = shamt
        # Build instruction manually to ensure imm[11:5] = 0
        word = (shamt << 20) | ((rs1 & 0x1F) << 15) | ((0x1 & 0x7) << 12) | ((rd & 0x1F) << 7) | (0x13 & 0x7F)
        return format(word & 0xFFFFFFFF, '08x')
    
    if op == 'srli':
        rd = get_reg(xrd)
        rs1 = get_reg(xrs1_or_xrs2)
        shamt = get_imm(xrs2_or_imm) & 0x1F  # shift amount (only lower 5 bits)
        # srli uses I-type format: imm[11:5] must be 0, imm[4:0] = shamt
        word = (shamt << 20) | ((rs1 & 0x1F) << 15) | ((0x5 & 0x7) << 12) | ((rd & 0x1F) << 7) | (0x13 & 0x7F)
        return format(word & 0xFFFFFFFF, '08x')
    
    if op == 'jalr':
        rd = get_reg(xrd)
        rs1 = get_reg(xrs1_or_xrs2)
        imm = get_imm(xrs2_or_imm)
        word = _encode_riscv_i(0x67, 0x0, rd, rs1, imm)  # opcode 0x67 = 1100111
        return format(word & 0xFFFFFFFF, '08x')
    
    # S-type instruction: sb
    if op == 'sb':
        rs2 = get_reg(xrd)  # first param is rs2 for store: sb rs2, imm(rs1)
        rs1 = get_reg(xrs1_or_xrs2)
        imm = get_imm(xrs2_or_imm)
        word = _encode_riscv_s(0x23, 0x0, rs1, rs2, imm)  # opcode 0x23 = 0100011
        return format(word & 0xFFFFFFFF, '08x')
    
    # B-type instructions: beq, bne
    if op == 'beq':
        rs1 = get_reg(xrd)
        rs2 = get_reg(xrs1_or_xrs2)
        imm = get_imm(xrs2_or_imm)
        word = _encode_riscv_b(0x63, 0x0, rs1, rs2, imm)  # opcode 0x63 = 1100011, funct3=0x0
        return format(word & 0xFFFFFFFF, '08x')
    
    if op == 'bne':
        rs1 = get_reg(xrd)
        rs2 = get_reg(xrs1_or_xrs2)
        imm = get_imm(xrs2_or_imm)
        word = _encode_riscv_b(0x63, 0x1, rs1, rs2, imm)  # opcode 0x63, funct3=0x1
        return format(word & 0xFFFFFFFF, '08x')
    
    # J-type instruction: jal
    if op == 'jal':
        rd = get_reg(xrd)
        imm = get_imm(xrs1_or_xrs2)  # jal rd, offset
        # xrs2_or_imm is unused for jal
        word = _encode_riscv_j(0x6F, rd, imm)  # opcode 0x6F = 1101111
        return format(word & 0xFFFFFFFF, '08x')
    
    # U-type instruction: lui
    if op == 'lui':
        rd = get_reg(xrd)
        imm = get_imm(xrs1_or_xrs2)  # lui rd, imm[31:12]
        word = _encode_riscv_u(0x37, rd, imm)  # opcode 0x37 = 0110111
        return format(word & 0xFFFFFFFF, '08x')
    
    raise ValueError(f"Unsupported instruction: {op}")


# Mapping of function names used in templates to implementations
FUNCTIONS = {
    'hex_to_binary': fn_hex_to_binary, # sip
    'hex_to_decimal': fn_hex_to_decimal, # sip
    'hex_to_octal': fn_hex_to_octal, # sip
    'binary_to_decimal': fn_binary_to_decimal, # sip
    'decimal_to_binary': fn_decimal_to_binary, # sip
    'decimal_to_two_complement': fn_decimal_to_two_complement, # sip
    'two_complement_to_decimal': fn_two_complement_to_decimal, # sip
    'two_complement_subtraction': fn_two_complement_subtraction, # sip
    'hex_subtraction': fn_hex_subtraction, # sip
    'sign_magnitude_addition_decimal': fn_sign_magnitude_addition_decimal, # sip
    'two_complement_addition_decimal': fn_two_complement_addition_decimal, # sip
    'two_complement_subtraction_decimal': fn_two_complement_subtraction_decimal,
    'sign_magnitude_subtraction_decimal': fn_sign_magnitude_subtraction_decimal,
    'negate': fn_negate, # sip
    'instruction_represent': fn_instruction_represent, # sip
    'hex_to_two_complement': fn_hex_to_two_complement, # sip
}


GENERATORS = {
    'random_hex_len': gen_random_hex_len, # sip
    'random_binary_len': gen_random_binary_len, # sip
    'random_decimal_len': gen_random_decimal_len, # sip
    'random_between': gen_random_between, # sip
    'random_negative_binary_len': gen_random_negative_binary_len, # sip
}


GEN_PLACEHOLDER_RE = re.compile(r"\$([0-9]+)(?:#([^#]+)#)?")
FUNC_CALL_RE = re.compile(r"#([a-zA-Z_][a-zA-Z0-9_]*)\(")


def _parse_generator_call(expr: str) -> Tuple[str, List[str]]:
    """
    Parse the generator call.
    
    expr: generator call expression
    name: generator name
    args: generator arguments

    example:
    >>> _parse_generator_call('random_hex_len(4)')
    ('random_hex_len', ['4'])
    >>> _parse_generator_call('random_hex_len(4, 8)')
    ('random_hex_len', ['4', '8'])
    """
    # expr like: random_hex_len(4)
    name, args_str = expr.split('(', 1)
    args_str = args_str.rstrip(')')
    args = [a.strip() for a in args_str.split(',')] if args_str.strip() else []
    return name.strip(), args


def _eval_arg(token: str, variables: VariableMap) -> Any:
    """Evaluate the argument.
    
    token: argument token
    variables: variables used in the question
    
    example:
    >>> _eval_arg('$1', {'1': 10})
    10
    >>> _eval_arg('10', {})
    10
    >>> _eval_arg('0x10', {})
    16
    >>> _eval_arg('0b10', {})
    2
    >>> _eval_arg('0o10', {})
    8
    """
    token = token.strip() # remove leading and trailing whitespace
    # variable?
    if token.startswith('$'):
        key = token[1:]
        value = variables.get(key)
        if value is None:
            # Variable not found - return the token as-is (will be handled by caller)
            return token
        return value
    # numeric?
    try:
        if token.lower().startswith('0x'):
            return int(token, 16)
        if token.lower().startswith('0b'):
            return int(token, 2)
        if token.lower().startswith('0o'):
            return int(token, 8)
        return int(token)
    except ValueError:
        pass
    return token


def _eval_function_call(name: str, arg_tokens: List[str], variables: VariableMap) -> Any:
    """Evaluate the function call.
    
    name: function name
    arg_tokens: function arguments
    variables: variables used in the question
    
    example:
    >>> result = _eval_function_call('random_hex_len', ['4'], {})
    >>> len(result) == 4  # Random hex string of length 4
    True
    """
    resolved_args = []
    for tok in arg_tokens:
        resolved = _eval_arg(tok, variables)
        # For instruction_represent, handle register arguments like "x$1"
        # by resolving the variable part while keeping the prefix
        if name == 'instruction_represent' and isinstance(resolved, str):
            # Check if it's a register format like "x$1" or "x20"
            if resolved.startswith('x') and len(resolved) > 1:
                rest = resolved[1:]
                # If the rest is a variable reference, resolve it
                if rest.startswith('$'):
                    var_key = rest[1:]
                    var_value = variables.get(var_key)
                    if var_value is not None:
                        resolved = f"x{var_value}"
        resolved_args.append(resolved)
    
    fn = FUNCTIONS.get(name) or GENERATORS.get(name)
    if not fn:
        raise ValueError(f"Unknown function: {name}")
    return fn(*resolved_args) # call the function with the arguments


def _evaluate_answer_template(answer_template: str, variables: VariableMap) -> str:
    """Evaluate the answer template. Return the evaluated answer as a string.
    
    answer_template: answer template
    variables: variables used in the question
    
    example:
    >>> _evaluate_answer_template('random_hex_len(4)', {})  # No #...# pattern, returns as-is
    'random_hex_len(4)'
    >>> _evaluate_answer_template('#decimal_to_binary($1)#', {'1': 10})
    '1010'
    """
    # Resolve nested #func(...)# calls from innermost outward
    s = answer_template

    while True:
        # Find innermost pattern by scanning for '#...#' pairs from right to left
        # Find the rightmost '#' that starts a pattern (has a matching '#' after it)
        last_hash = s.rfind('#')
        if last_hash == -1:
            break
        # Find all '#' positions and work backwards to find pairs
        hash_positions = [i for i, ch in enumerate(s) if ch == '#']
        if len(hash_positions) < 2:
            break
        # Find the rightmost pair (start_idx, end_idx) where end_idx > start_idx
        start_idx = -1
        end_idx = -1
        for i in range(len(hash_positions) - 2, -1, -1):
            start_idx = hash_positions[i]
            end_idx = s.find('#', start_idx + 1)
            if end_idx != -1:
                break
        if end_idx == -1:
            break
        inner = s[start_idx + 1:end_idx] # inner is the function call expression
        # Expect something like: name(args)
        if '(' in inner and inner.endswith(')'):
            # Extract function name and args string
            name_end = inner.find('(')
            name = inner[:name_end].strip()
            args_str = inner[name_end + 1:-1]  # Get args between ( and )
            
            # Split top-level commas (handling nested parentheses)
            arg_tokens = []
            depth = 0
            current = []
            for ch in args_str:
                if ch == '(':
                    depth += 1
                elif ch == ')':
                    depth -= 1
                if ch == ',' and depth == 0:
                    arg_tokens.append(''.join(current).strip())
                    current = []
                else:
                    current.append(ch)
            if current:
                arg_tokens.append(''.join(current).strip())

            result = _eval_function_call(name, arg_tokens, variables)
            s = s[:start_idx] + str(result) + s[end_idx + 1:]
        else:
            # Not a function call; replace and continue
            s = s[:start_idx] + inner + s[end_idx + 1:]

    # Replace remaining variables like $1
    def repl_var(m: re.Match) -> str:
        """Replace the variable with the value.
        
        m: match object
        key: variable key
        value: variable value

        example:
        >>> variables = {'1': 10}
        >>> repl_var(re.match(r"\$([0-9]+)", '$1'))
        '10'
        >>> repl_var(re.match(r"\$([0-9]+)", '$2'))
        '$2'
        """
        key = m.group(1)
        return str(variables.get(key, m.group(0)))

    s = re.sub(r"\$([0-9]+)", repl_var, s)
    return s


def _render_question_text(question_string: str, variables: VariableMap) -> str:
    """Render the question text.

    question_string: question string
    variables: variables used in the question

    example:
    >>> _render_question_text('What is the hexadecimal representation of the number $1?', {'1': 10})
    'What is the hexadecimal representation of the number 10?'
    """
    def repl(m: re.Match) -> str:
        """Replace the variable with the value (or generator expression).
        """
        key = m.group(1)
        gen_expr = m.group(2)
        if key in variables: # variable is already defined
            return str(variables[key])
        if gen_expr: # generator expression
            name, args = _parse_generator_call(gen_expr)
            gen = GENERATORS.get(name) 
            if not gen:
                raise ValueError(f"Unknown generator: {name}")
            # Evaluate args now (they may be numeric literals)
            eval_args = [_eval_arg(arg, variables) for arg in args]
            value = gen(*eval_args)
            variables[key] = value
            return str(value)
        # No generator provided; just reuse or leave as-is
        return m.group(0)

    return GEN_PLACEHOLDER_RE.sub(repl, question_string) # replace the variables with the values (or generator expressions)


def generate_question_instance(question) -> Dict[str, Any]:
    """Generate a question instance (rendered question text and answer text).
    
    question_text: rendered question text
    answer_text: rendered answer text
    variables: variables used in the question
    IMPORTANT! variable is needed because the answer template may contain generator expressions

    example:
    question.question_string: What is the binary representation of 10?
    question.answer: #decimal_to_binary(10)#
    
    >>> from types import SimpleNamespace # lightweight object class-like
    >>> question = SimpleNamespace(question_string='What is the binary representation of 10?', answer='#decimal_to_binary(10)#')
    >>> result = generate_question_instance(question)
    >>> result['question_text']
    'What is the binary representation of 10?'
    >>> result['answer_text']
    '1010'
    >>> 'variables' in result
    True
    """
    variables: VariableMap = {}
    rendered_question = _render_question_text(question.question_string, variables)
    answer_template = question.answer if isinstance(question.answer, str) else str(question.answer)
    rendered_answer = _evaluate_answer_template(answer_template, variables)
    return {
        'question_text': rendered_question,
        'answer_text': rendered_answer,
        'variables': variables,
    }


