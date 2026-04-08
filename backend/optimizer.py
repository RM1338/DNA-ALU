from simulator import simulate
from copy import deepcopy
from gate_library import GATE_LIBRARY

def optimize(payload, objective):
    c=deepcopy(payload)
    if objective=="minStrand":
        for g in c.gates:
            if g.gateType=="NAND" and GATE_LIBRARY["AND"]["strandCost"]+GATE_LIBRARY["NOT"]["strandCost"]<GATE_LIBRARY["NAND"]["strandCost"]: g.gateType="AND"
            if g.gateType=="NOR" and GATE_LIBRARY["OR"]["strandCost"]+GATE_LIBRARY["NOT"]["strandCost"]<GATE_LIBRARY["NOR"]["strandCost"]: g.gateType="OR"
    if objective=="minTime" and c.gates:
        c.gates.append(type(c.gates[0])(id="buffer_opt",gateType="BUFFER",position={"x":0,"y":0}))
    before=simulate(payload); after=simulate(c)
    return {"optimizedCircuit":c,"result":after,"delta":{"strandDelta":after.totalStrandTypes-before.totalStrandTypes,"timeDelta":after.criticalPathMinutes-before.criticalPathMinutes}}
