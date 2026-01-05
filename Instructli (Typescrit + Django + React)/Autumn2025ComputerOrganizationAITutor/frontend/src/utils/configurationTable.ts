import { instructionTypeMap, CommandType, PipelineState, IFPath,
     IDPath, EXPath, MEMPath, WBPath, IFComponents, IDComponents, EXComponents, MEMComponents} from "./pipeline-types";  

export const stageIFTable: Record<string, IFPath> = {
  add : { branch_taken:false, mux_pc:true,  pc_increment:true,  pc_default:true,  pc_id:false, pc_im:true,  im_id:true },
  beq : { branch_taken:false, mux_pc:true,  pc_increment:true,  pc_default:true,  pc_id:true,  pc_im:true,  im_id:true },
};

export const stageIDTable: Record<string, IDPath> = {
  R: {
      id_reg1: true,
      id_reg2: true,
      id_reg_write: true,
      id_imm_gen: false,
      imm_ex: false,
      id_ex: false,
      reg1_ex: true,
      reg2_ex: true
  },
  I:{
      id_reg1: true,
      id_reg2: false,
      id_reg_write: true,
      id_imm_gen: true,
      imm_ex: true,
      id_ex: false,
      reg1_ex: true,
      reg2_ex: false
  },
  B: {
      id_reg1: true,
      id_reg2: true,
      id_reg_write: false,
      id_imm_gen: true,
      imm_ex: true,
      id_ex: true,
      reg1_ex: true,
      reg2_ex: true
  },
  S: {
      id_reg1: true,
      id_reg2: true,
      id_reg_write: false,
      id_imm_gen: true,
      imm_ex: true,
      id_ex: false,
      reg1_ex: true,
      reg2_ex: true
  },
  J: {
      id_reg1: false,
      id_reg2: false,
      id_reg_write: true,
      id_imm_gen: true,
      imm_ex: true,
      id_ex: true,
      reg1_ex: false,
      reg2_ex: false
  },
  U: {
      id_reg1: false,
      id_reg2: false,
      id_reg_write: true,
      id_imm_gen: true,
      imm_ex: true,
      id_ex: false,
      reg1_ex: false,
      reg2_ex: false
  },
  JI: {
      id_reg1: true,
      id_reg2: false,
      id_reg_write: true,
      id_imm_gen: true,
      imm_ex: true,
      id_ex: true,
      reg1_ex: true,
      reg2_ex: false
  } 
}

export const stageEXTable: Record<string, EXPath> = {
  R: {
      ex_add: false,
      add_mem: false,
      reg1_alu: true,
      reg2_mux: true,
      ex_shift: false,
      ex_mux: false,
      mux_alu: true,
      reg2_mem: false,
      zero_mem: false,
      alu_mem: true
  },
  B: {
      ex_add: true,
      add_mem: true,
      reg1_alu: true,
      reg2_mux: true,
      ex_shift: true,
      ex_mux: false,
      mux_alu: true,
      reg2_mem: false,
      zero_mem: false,
      alu_mem: false
  },
  I: {
      ex_add: false,
      add_mem: false,
      reg1_alu: true,
      reg2_mux: false,
      ex_shift: false,
      ex_mux: true,
      mux_alu: true,
      reg2_mem: false,
      zero_mem: false,
      alu_mem: true
  },
  S: {
      ex_add: false,
      add_mem: false,
      reg1_alu: true,
      reg2_mux: false,
      ex_shift: false,
      ex_mux: true,
      mux_alu: true,
      reg2_mem: true,
      zero_mem: false,
      alu_mem: true
  },
  J: {
      ex_add: true,
      add_mem: true,
      reg1_alu: true,
      reg2_mux: true,
      ex_shift: true,
      ex_mux: false,
      mux_alu: true,
      reg2_mem: false,
      zero_mem: false,
      alu_mem: true
  },
  U: {
      ex_add: false,
      add_mem: false,
      reg1_alu: false,
      reg2_mux: false,
      ex_shift: false,
      ex_mux: true,
      mux_alu: true,
      reg2_mem: false,
      zero_mem: false,
      alu_mem: true
  },
  JI: {
      ex_add: true,
      add_mem: true,
      reg1_alu: true,
      reg2_mux: false,
      ex_shift: false,
      ex_mux: true,
      mux_alu: true,
      reg2_mem: false,
      zero_mem: false,
      alu_mem: true
  }
}

export const stageMEMTable: Record<string, MEMPath> = {
    R: {
        zero_mem2: false,
        alu_dm: false,
        reg2_dm: false,
        dm_wb: false,
        alu_wb: true
    },
    B: {
        zero_mem2: false,
        alu_dm: false,
        reg2_dm: false,
        dm_wb: false,
        alu_wb: false,
    },
    I: {
        zero_mem2: false,
        alu_dm: false,
        reg2_dm: false,
        dm_wb: false,
        alu_wb: true
        },
    lw: {
        zero_mem2: false,
        alu_dm: true,
        reg2_dm: false,
        dm_wb: true,
        alu_wb: false
        },
    S: {
        zero_mem2: false,
        alu_dm: true,
        reg2_dm: true,
        dm_wb: false,
        alu_wb: false
        },
    J: {
        zero_mem2: false,
        alu_dm: false,
        reg2_dm: false,
        dm_wb: false,
        alu_wb: true
    },
    U: {
      zero_mem2: false,
      alu_dm: false,
      reg2_dm: false,
      dm_wb: false,
      alu_wb: true
  }
}

export const stageWBTable: Record<string, WBPath> = {
    R: {
        dm_mux: false,
        alu_mux: true,
        reg_write: true
    },
    I: {
        dm_mux: false,
        alu_mux: true,
        reg_write: true
    },
    lw: {
        dm_mux: true,
        alu_mux: false,
        reg_write: true
    },
    B: {
        dm_mux: false,
        alu_mux: false,
        reg_write: false
    },
    S: {
        dm_mux: false,
        alu_mux: false,
        reg_write: false
    },
    J: {
        dm_mux: false,
        alu_mux: true,
        reg_write: true
    },
    U: {
        dm_mux: false,
        alu_mux: true,
        reg_write: true
    }

}
export type IFComponentsTable = {
  type: string,
  jump?: boolean
}

export const componentIFTable: Record<string, IFComponentsTable> = {
  // R-type instruction
  add: { type: "R" }, sub: { type: "R" }, or: { type: "R" }, xor: { type: "R" }, 
  and: { type: "R" }, sll: { type: "R" }, srl: { type: "R" }, sra: { type: "R" },
  slt: { type: "R" }, sltu: { type: "R" },
  // I-type instruction
  addi: { type: "I" }, ori: { type: "I" }, xori: { type: "I" }, andi: { type: "I" },
  slli: { type: "I" }, srli: { type: "I" }, srai: { type: "I" }, slti: { type: "I" },
  sltiu: { type: "I" }, jalr: { type: "I" , jump: true}, ecall: { type: "I" }, ebreak: {type: "I"},
  li: { type: "I" }, lw: { type: "I" }, lh: { type: "I" }, lb: { type: "I" },
  lbu: { type: "I" }, lhu: { type: "I" },
  // B-type instruction
  beq: { type: "B" }, bne: { type: "B" }, blt: { type: "B" }, bge: { type: "B" },
  bltu: { type: "B" }, bgeu: { type: "B" },
  // S-type instruction
  sw: { type: "S"}, sh: { type: "S"}, sb: { type: "S"},
  // U-type instruction
  lui: { type: "U" }, auipc: { type: "U"},
  // J-type instruction
  jal: { type: "J" },
  "Unknown instruction": { type: "Error"}
};

export const componentIDTable: Record<string, IDComponents> = {};

export type EXComponentsTable = {
  operation: string,
  operationName: string
}

export const componentEXTable: Record<string, EXComponentsTable> = {
  // R-type
  add:  { operation: "+",  operationName: "ADD" },
  sub:  { operation: "-",  operationName: "SUB" },
  or:   { operation: "|",  operationName: "OR" },
  xor:  { operation: "^",  operationName: "XOR" },
  and:  { operation: "&",  operationName: "AND" },
  sll:  { operation: "<<", operationName: "SLL" },
  srl:  { operation: ">>", operationName: "SRL" },
  sra:  { operation: ">>", operationName: "SRA" },
  slt:  { operation: "(rs1 < rs2)?1:0",  operationName: "SUB" },
  sltu: { operation: "(rs1 < rs2)?1:0", operationName: "SUB" },

  // I-type
  addi:  { operation: "+",  operationName: "ADD" },
  ori:   { operation: "|",  operationName: "OR" },
  xori:  { operation: "^",  operationName: "XOR" },
  andi:  { operation: "&",  operationName: "ANDI" },
  slli:  { operation: "<<", operationName: "SLL" },
  srli:  { operation: ">>", operationName: "SRL" },
  srai:  { operation: ">>", operationName: "SRA" },
  slti:  { operation: "(rs1 < imm)?1:0",  operationName: "SUB" },
  sltiu: { operation: "(rs1 < imm)?1:0", operationName: "SUB" },
  jalr:  { operation: "+",  operationName: "ADDI" },
  ecall: { operation: "SYS", operationName: "ECALL" },
  ebreak:{ operation: "SYS", operationName: "EBREAK" },
  li:    { operation: "+",  operationName: "ADD" },
  lw:    { operation: "+",  operationName: "ADD" },
  lh:    { operation: "+",  operationName: "ADD" },
  lb:    { operation: "+",  operationName: "ADD" },
  lbu:   { operation: "+",  operationName: "ADD" },
  lhu:   { operation: "+",  operationName: "ADD" },

  // B-type
  beq:  { operation: "==", operationName: "SUB" },
  bne:  { operation: "!=", operationName: "SUB" },
  blt:  { operation: "<",  operationName: "SUB" },
  bge:  { operation: ">=", operationName: "SUB" },
  bltu: { operation: "<", operationName: "SUB" },
  bgeu: { operation: ">=",operationName: "SUB" },

  // S-type
  sw: { operation: "+", operationName: "ADD" },
  sh: { operation: "+", operationName: "ADD" },
  sb: { operation: "+", operationName: "ADD" },

  // U-type
  lui:   { operation: "<<", operationName: "SLL" },
  auipc: { operation: "+",   operationName: "ADD" },
  // J-type
  jal:   { operation: "+", operationName: "ADD" },
};

export const componentMEMTable: Record<string, MEMComponents> = {
  // e.g. beq: { branch: true, mem_read: false, mem_write: false },
};
