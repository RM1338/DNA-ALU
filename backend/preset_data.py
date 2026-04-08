from models import CircuitPayload, GateNode, Wire

RIPPLE_CARRY_ADDER = CircuitPayload(
    projectName="Ripple Carry Full Adder",
    gates=[
        GateNode(id="xor_1", gateType="XOR", position={"x": 320, "y": 180}),
        GateNode(id="xor_2", gateType="XOR", position={"x": 520, "y": 180}),
        GateNode(id="and_1", gateType="AND", position={"x": 320, "y": 320}),
        GateNode(id="and_2", gateType="AND", position={"x": 520, "y": 320}),
        GateNode(id="or_1", gateType="OR", position={"x": 720, "y": 320}),
    ],
    wires=[
        Wire(id="w_a_xor1", source="in_A", target="xor_1"), Wire(id="w_b_xor1", source="in_B", target="xor_1"),
        Wire(id="w_xor1_xor2", source="xor_1", target="xor_2"), Wire(id="w_cin_xor2", source="in_Cin", target="xor_2"),
        Wire(id="w_a_and1", source="in_A", target="and_1"), Wire(id="w_b_and1", source="in_B", target="and_1"),
        Wire(id="w_xor1_and2", source="xor_1", target="and_2"), Wire(id="w_cin_and2", source="in_Cin", target="and_2"),
        Wire(id="w_and1_or1", source="and_1", target="or_1"), Wire(id="w_and2_or1", source="and_2", target="or_1"),
        Wire(id="w_xor2_sum", source="xor_2", target="out_Sum"), Wire(id="w_or1_cout", source="or_1", target="out_Cout"),
    ],
    inputs=["A", "B", "Cin"], outputs=["Sum", "Cout"],
).model_dump()

CARRY_LOOKAHEAD_ADDER = CircuitPayload(
    projectName="Carry Lookahead Full Adder",
    gates=[
        GateNode(id="xor_p", gateType="XOR", position={"x": 300, "y": 180}),
        GateNode(id="and_g", gateType="AND", position={"x": 300, "y": 320}),
        GateNode(id="buffer_p", gateType="BUFFER", position={"x": 480, "y": 180}),
        GateNode(id="and_pc", gateType="AND", position={"x": 480, "y": 320}),
        GateNode(id="or_cout", gateType="OR", position={"x": 660, "y": 320}),
        GateNode(id="xor_sum", gateType="XOR", position={"x": 660, "y": 180}),
        GateNode(id="and_aux", gateType="AND", position={"x": 840, "y": 320}),
        GateNode(id="or_aux", gateType="OR", position={"x": 1020, "y": 320}),
    ],
    wires=[
        Wire(id="cla_w1", source="in_A", target="xor_p"), Wire(id="cla_w2", source="in_B", target="xor_p"),
        Wire(id="cla_w3", source="in_A", target="and_g"), Wire(id="cla_w4", source="in_B", target="and_g"),
        Wire(id="cla_w5", source="xor_p", target="buffer_p"), Wire(id="cla_w6", source="buffer_p", target="and_pc"),
        Wire(id="cla_w7", source="in_Cin", target="and_pc"), Wire(id="cla_w8", source="and_g", target="or_cout"),
        Wire(id="cla_w9", source="and_pc", target="or_cout"), Wire(id="cla_w10", source="xor_p", target="xor_sum"),
        Wire(id="cla_w11", source="in_Cin", target="xor_sum"), Wire(id="cla_w12", source="or_cout", target="and_aux"),
        Wire(id="cla_w13", source="buffer_p", target="and_aux"), Wire(id="cla_w14", source="and_aux", target="or_aux"),
        Wire(id="cla_w15", source="or_cout", target="or_aux"), Wire(id="cla_w16", source="xor_sum", target="out_Sum"),
        Wire(id="cla_w17", source="or_aux", target="out_Cout"),
    ],
    inputs=["A", "B", "Cin"], outputs=["Sum", "Cout"],
).model_dump()
