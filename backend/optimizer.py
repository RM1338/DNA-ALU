from simulator import simulate
from copy import deepcopy
from gate_library import GATE_LIBRARY

VALID_OBJECTIVES = {"minStrand", "minTime"}

def _replacement(gt):
    if gt == "NAND":
        return "AND"
    if gt == "NOR":
        return "OR"
    if gt == "XNOR":
        return "XOR"
    return None

def optimize(payload, objective):
    if objective not in VALID_OBJECTIVES:
        allowed = ", ".join(sorted(VALID_OBJECTIVES))
        raise ValueError(f"Unsupported optimization objective '{objective}'. Allowed values: {allowed}")
    c=deepcopy(payload)
    if objective=="minStrand":
        for g in c.gates:
            repl = _replacement(g.gateType)
            if repl and GATE_LIBRARY[repl]["strandCost"] < GATE_LIBRARY[g.gateType]["strandCost"]:
                g.gateType=repl
    if objective=="minTime":
        for g in c.gates:
            repl = _replacement(g.gateType)
            if repl and GATE_LIBRARY[repl]["reactionTimeMin"] < GATE_LIBRARY[g.gateType]["reactionTimeMin"]:
                g.gateType=repl
    before=simulate(payload); after=simulate(c)
    return {"optimizedCircuit":c,"result":after,"delta":{"strandDelta":after.totalStrandTypes-before.totalStrandTypes,"timeDelta":after.criticalPathMinutes-before.criticalPathMinutes}}
