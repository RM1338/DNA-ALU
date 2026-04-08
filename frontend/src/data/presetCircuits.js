export const RIPPLE_CARRY_ADDER = {
  projectName: "Ripple Carry Full Adder",
  gates: [
    { id: "xor_1", gateType: "XOR", position: { x: 320, y: 180 }, params: {} },
    { id: "xor_2", gateType: "XOR", position: { x: 520, y: 180 }, params: {} },
    { id: "and_1", gateType: "AND", position: { x: 320, y: 320 }, params: {} },
    { id: "and_2", gateType: "AND", position: { x: 520, y: 320 }, params: {} },
    { id: "or_1", gateType: "OR", position: { x: 720, y: 320 }, params: {} },
  ],
  wires: [
    { id: "w_a_xor1", source: "in_A", sourceHandle: "out", target: "xor_1", targetHandle: "in-0" },
    { id: "w_b_xor1", source: "in_B", sourceHandle: "out", target: "xor_1", targetHandle: "in-1" },
    { id: "w_xor1_xor2", source: "xor_1", sourceHandle: "out", target: "xor_2", targetHandle: "in-0" },
    { id: "w_cin_xor2", source: "in_Cin", sourceHandle: "out", target: "xor_2", targetHandle: "in-1" },
    { id: "w_a_and1", source: "in_A", sourceHandle: "out", target: "and_1", targetHandle: "in-0" },
    { id: "w_b_and1", source: "in_B", sourceHandle: "out", target: "and_1", targetHandle: "in-1" },
    { id: "w_xor1_and2", source: "xor_1", sourceHandle: "out", target: "and_2", targetHandle: "in-0" },
    { id: "w_cin_and2", source: "in_Cin", sourceHandle: "out", target: "and_2", targetHandle: "in-1" },
    { id: "w_and1_or1", source: "and_1", sourceHandle: "out", target: "or_1", targetHandle: "in-0" },
    { id: "w_and2_or1", source: "and_2", sourceHandle: "out", target: "or_1", targetHandle: "in-1" },
    { id: "w_xor2_sum", source: "xor_2", sourceHandle: "out", target: "out_Sum", targetHandle: "in" },
    { id: "w_or1_cout", source: "or_1", sourceHandle: "out", target: "out_Cout", targetHandle: "in" }
  ],
  inputs: ["A", "B", "Cin"],
  outputs: ["Sum", "Cout"]
};

export const CARRY_LOOKAHEAD_ADDER = {
  projectName: "Carry Lookahead Full Adder",
  gates: [
    { id: "xor_p", gateType: "XOR", position: { x: 300, y: 180 }, params: {} },
    { id: "and_g", gateType: "AND", position: { x: 300, y: 320 }, params: {} },
    { id: "buffer_p", gateType: "BUFFER", position: { x: 480, y: 180 }, params: {} },
    { id: "and_pc", gateType: "AND", position: { x: 480, y: 320 }, params: {} },
    { id: "or_cout", gateType: "OR", position: { x: 660, y: 320 }, params: {} },
    { id: "xor_sum", gateType: "XOR", position: { x: 660, y: 180 }, params: {} },
    { id: "and_aux", gateType: "AND", position: { x: 840, y: 320 }, params: {} },
    { id: "or_aux", gateType: "OR", position: { x: 1020, y: 320 }, params: {} }
  ],
  wires: [
    { id: "cla_w1", source: "in_A", sourceHandle: "out", target: "xor_p", targetHandle: "in-0" },
    { id: "cla_w2", source: "in_B", sourceHandle: "out", target: "xor_p", targetHandle: "in-1" },
    { id: "cla_w3", source: "in_A", sourceHandle: "out", target: "and_g", targetHandle: "in-0" },
    { id: "cla_w4", source: "in_B", sourceHandle: "out", target: "and_g", targetHandle: "in-1" },
    { id: "cla_w5", source: "xor_p", sourceHandle: "out", target: "buffer_p", targetHandle: "in-0" },
    { id: "cla_w6", source: "buffer_p", sourceHandle: "out", target: "and_pc", targetHandle: "in-0" },
    { id: "cla_w7", source: "in_Cin", sourceHandle: "out", target: "and_pc", targetHandle: "in-1" },
    { id: "cla_w8", source: "and_g", sourceHandle: "out", target: "or_cout", targetHandle: "in-0" },
    { id: "cla_w9", source: "and_pc", sourceHandle: "out", target: "or_cout", targetHandle: "in-1" },
    { id: "cla_w10", source: "xor_p", sourceHandle: "out", target: "xor_sum", targetHandle: "in-0" },
    { id: "cla_w11", source: "in_Cin", sourceHandle: "out", target: "xor_sum", targetHandle: "in-1" },
    { id: "cla_w12", source: "or_cout", sourceHandle: "out", target: "and_aux", targetHandle: "in-0" },
    { id: "cla_w13", source: "buffer_p", sourceHandle: "out", target: "and_aux", targetHandle: "in-1" },
    { id: "cla_w14", source: "and_aux", sourceHandle: "out", target: "or_aux", targetHandle: "in-0" },
    { id: "cla_w15", source: "or_cout", sourceHandle: "out", target: "or_aux", targetHandle: "in-1" },
    { id: "cla_w16", source: "xor_sum", sourceHandle: "out", target: "out_Sum", targetHandle: "in" },
    { id: "cla_w17", source: "or_aux", sourceHandle: "out", target: "out_Cout", targetHandle: "in" }
  ],
  inputs: ["A", "B", "Cin"],
  outputs: ["Sum", "Cout"]
};
