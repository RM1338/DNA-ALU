import networkx as nx
from gate_library import GATE_LIBRARY
from models import SimulationResult, ReactionStage, GateCostRow
from itertools import product

def build_graph(payload):
    G=nx.DiGraph()
    for g in payload.gates:
        if g.gateType not in GATE_LIBRARY:
            raise ValueError(f"Unsupported gate type '{g.gateType}' for gate '{g.id}'")
        lib=GATE_LIBRARY[g.gateType]
        G.add_node(g.id, gateType=g.gateType, strandCost=lib['strandCost'], reactionTime=lib['reactionTimeMin'], enzyme=lib['enzyme'])
    for w in payload.wires:
        if w.source in G and w.target in G: G.add_edge(w.source,w.target)
    return G

def _eval(gt, vals):
    a=vals+[0,0]
    return {"AND":int(a[0] and a[1]),"OR":int(a[0] or a[1]),"NOT":int(not a[0]),"XOR":int((a[0]^a[1])==1),"NAND":int(not(a[0] and a[1])),"NOR":int(not(a[0] or a[1])),"XNOR":int((a[0]^a[1])==0),"BUFFER":int(a[0])}.get(gt,0)

def simulate(payload):
    G=build_graph(payload)
    generations=list(nx.topological_generations(G)) if len(G) else []
    stages=[]; cost=[]; t=0.0
    for i,gen in enumerate(generations,1):
        d=max(G.nodes[g]['reactionTime'] for g in gen)
        dom=max(gen,key=lambda g:G.nodes[g]['reactionTime'])
        stages.append(ReactionStage(stageIndex=i,startMinute=t,durationMinutes=d,gatesInStage=list(gen),dominantGateType=G.nodes[dom]['gateType'],enzymesInvolved=list({G.nodes[g]['enzyme'] for g in gen})))
        for g in gen:
            lib=GATE_LIBRARY[G.nodes[g]['gateType']]
            cost.append(GateCostRow(gateId=g,gateType=lib['gateType'],bioMechanism=lib['bioName'],strandCost=lib['strandCost'],reactionTimeMin=lib['reactionTimeMin'],enzyme=lib['enzyme'],stageIndex=i))
        t+=d
    incoming={}
    for w in payload.wires: incoming.setdefault(w.target,[]).append(w.source)
    truth=[]
    topo=list(nx.topological_sort(G)) if len(G) else []
    for combo in product([0,1], repeat=len(payload.inputs)):
        input_assignment={k:v for k,v in zip(payload.inputs,combo)}
        vals={f'in_{k}':v for k,v in input_assignment.items()}
        vals.update(input_assignment)
        for gid in topo:
            ins=[vals.get(src,0) for src in incoming.get(gid,[])]
            vals[gid]=_eval(G.nodes[gid]['gateType'],ins)
        outs={k:vals.get(k,vals.get(f'out_{k}',0)) for k in payload.outputs}
        truth.append({'inputs':{k:vals[k] for k in payload.inputs},'outputs':outs})
    return SimulationResult(totalStrandTypes=sum(r.strandCost for r in cost),criticalPathMinutes=t,stageCount=len(stages),stages=stages,strandCostTable=cost,truthTable=truth)
