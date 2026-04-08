from pydantic import BaseModel
from typing import List
class GateParams(BaseModel): temperature: float = 37; bufferConc: float = 10; strandConc: float = 50; hillN: float = 2
class GateNode(BaseModel): id: str; gateType: str; position: dict; params: GateParams = GateParams()
class Wire(BaseModel): id: str; source: str; sourceHandle: str = ""; target: str; targetHandle: str = ""
class CircuitPayload(BaseModel): projectName: str; gates: List[GateNode]; wires: List[Wire]; inputs: List[str]; outputs: List[str]
class ReactionStage(BaseModel): stageIndex: int; startMinute: float; durationMinutes: float; gatesInStage: List[str]; dominantGateType: str; enzymesInvolved: List[str]
class GateCostRow(BaseModel): gateId: str; gateType: str; bioMechanism: str; strandCost: int; reactionTimeMin: float; enzyme: str; stageIndex: int
class SimulationResult(BaseModel): totalStrandTypes: int; criticalPathMinutes: float; stageCount: int; stages: List[ReactionStage]; strandCostTable: List[GateCostRow]; truthTable: List[dict]
