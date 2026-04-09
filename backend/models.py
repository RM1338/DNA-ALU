from pydantic import BaseModel, Field
from typing import List, Dict, Any


class GateParams(BaseModel):
    temperature: float = 37
    bufferConc: float = 10
    strandConc: float = 50
    hillN: float = 2


class GateNode(BaseModel):
    id: str
    gateType: str
    position: dict
    params: GateParams = GateParams()


class Wire(BaseModel):
    id: str
    source: str
    sourceHandle: str = ""
    target: str
    targetHandle: str = ""


class CircuitPayload(BaseModel):
    projectName: str
    gates: List[GateNode]
    wires: List[Wire]
    inputs: List[str]
    outputs: List[str]
    # CO4: programmable peripheral interfacing mode (PIO vs interrupt vs DMA-style bulk).
    ioInterfaceMode: str = Field(default="PIO", description="PIO | INTERRUPT | DMA")


class ReactionStage(BaseModel):
    stageIndex: int
    startMinute: float
    durationMinutes: float
    gatesInStage: List[str]
    dominantGateType: str
    enzymesInvolved: List[str]


class GateCostRow(BaseModel):
    gateId: str
    gateType: str
    bioMechanism: str
    strandCost: int
    reactionTimeMin: float
    enzyme: str
    stageIndex: int


class InstructionCyclePhase(BaseModel):
    id: str
    title: str
    description: str
    metrics: Dict[str, Any] = Field(default_factory=dict)


class CO1Report(BaseModel):
    phases: List[InstructionCyclePhase]
    pipelineStageCount: int
    logicalGateCount: int
    uniqueGateTypes: List[str]


class CO4Report(BaseModel):
    mode: str
    inputPortCount: int
    outputPortCount: int
    truthTableRows: int
    bitsPerTruthRow: int
    totalBitsTransferred: int
    throughputIndex: float
    interfaceLatencyFactor: float
    adjustedScheduleMinutes: float


class GPUProfileEval(BaseModel):
    profileId: str
    label: str
    speedup: float
    effectiveScheduleMinutes: float
    rationale: str


class CO5Report(BaseModel):
    serialWorkMinutes: float
    criticalPathMinutes: float
    maxParallelGatesPerStage: int
    averageParallelism: float
    estimatedIdealSpeedup: float
    profiles: List[GPUProfileEval]


class CourseOutcomesBundle(BaseModel):
    co1: CO1Report
    co4: CO4Report
    co5: CO5Report


class SimulationResult(BaseModel):
    totalStrandTypes: int
    criticalPathMinutes: float
    stageCount: int
    stages: List[ReactionStage]
    strandCostTable: List[GateCostRow]
    truthTable: List[dict]
    courseOutcomes: CourseOutcomesBundle
