import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactionGantt from "../components/ReactionGantt";
import StrandCostTable from "../components/StrandCostTable";
import { exportPDF, optimizeCircuit } from "../api/bioApi";
import { useCircuitStore } from "../store/circuitStore";
import { useUiStore } from "../store/uiStore";
import DNAStructureReport from "../components/DNAStructureReport";
import DNAHelixVisualizer from "../components/DNAHelixVisualizer";
import { buildStrandsFromCostRows } from "../utils/strandModel";
import CoCompliancePanel from "../components/CoCompliancePanel";

function ExplainResult({ result }) {
  const fastestStage = [...(result.stages || [])].sort((a, b) => b.durationMinutes - a.durationMinutes)[0];
  return (
    <div className="panel explain-result">
      <h3>How to Explain This Result</h3>
      <p>
        Your circuit needs <strong>{result.totalStrandTypes}</strong> DNA strand types and completes in
        <strong> {result.criticalPathMinutes} minutes</strong> across <strong>{result.stageCount}</strong> reaction stages.
      </p>
      <p>
        Longest bottleneck stage: <strong>Stage {fastestStage?.stageIndex || "-"}</strong>
        {fastestStage ? ` (${fastestStage.durationMinutes} min, dominant gate ${fastestStage.dominantGateType})` : ""}.
      </p>
      <p>
        For non-biology audience: strand count ~ "material complexity", timeline ~ "how long the wet-lab flow takes".
      </p>
    </div>
  );
}

function OptimizationDeltaPanel({ delta }) {
  if (!delta) return null;

  const strandClass = delta.strandDelta > 0 ? "up" : "down";
  const timeClass = delta.timeDelta > 0 ? "up" : "down";
  const strandPrefix = delta.strandDelta > 0 ? "+" : "";
  const timePrefix = delta.timeDelta > 0 ? "+" : "";

  return (
    <div className="panel">
      <h3>Optimization Change Summary</h3>
      <p className="mono">Objective: {delta.objective}</p>
      <p className="mono">Strands: {delta.beforeStrands} {"→"} {delta.afterStrands} <span className={strandClass}>({strandPrefix}{delta.strandDelta})</span></p>
      <p className="mono">Time: {delta.beforeTime} min {"→"} {delta.afterTime} min <span className={timeClass}>({timePrefix}{delta.timeDelta} min)</span></p>
    </div>
  );
}

export default function ResultsPage() {
  const nav = useNavigate();
  const pushToast = useUiStore((s) => s.pushToast);
  const { simulationResult, projectName, gates, wires, setSimulationResult } = useCircuitStore();
  const [optimizing, setOptimizing] = useState(false);
  const [optimizationDelta, setOptimizationDelta] = useState(null);

  if (!simulationResult) {
    return (
      <div className="results-page">
        <div className="panel">
          <h2>No simulation yet</h2>
          <p>Create a circuit on canvas and run simulation to unlock this page.</p>
          <button onClick={() => nav("/canvas")}>Go to Canvas</button>
        </div>
      </div>
    );
  }

  const inputLabels = gates.filter((g) => g.type === "inputNode").map((g) => g.data?.label);
  const outputLabels = gates.filter((g) => g.type === "outputNode").map((g) => g.data?.label);

  const strands = useMemo(() => buildStrandsFromCostRows(simulationResult.strandCostTable), [simulationResult]);

  const circuit = useMemo(() => ({
    projectName,
    gates: gates.filter((g) => g.type === "bioGate").map((g) => ({ id: g.id, gateType: g.data?.gateType, position: g.position, params: g.data?.params || {} })),
    wires: wires.map((w) => ({ ...w })),
    inputs: inputLabels,
    outputs: outputLabels,
  }), [projectName, gates, wires, inputLabels, outputLabels]);

  async function runOptimize(objective) {
    setOptimizing(true);
    try {
      const beforeStrands = simulationResult.totalStrandTypes;
      const beforeTime = simulationResult.criticalPathMinutes;
      const data = await optimizeCircuit(circuit, objective);
      setSimulationResult(data.result);
      const afterStrands = data.result.totalStrandTypes;
      const afterTime = data.result.criticalPathMinutes;
      setOptimizationDelta({
        objective,
        beforeStrands,
        afterStrands,
        strandDelta: afterStrands - beforeStrands,
        beforeTime,
        afterTime,
        timeDelta: Number((afterTime - beforeTime).toFixed(2)),
      });
      pushToast(`Optimized for ${objective === "minStrand" ? "strand cost" : "reaction time"}`, "ok");
    } catch (e) {
      pushToast(e);
    } finally {
      setOptimizing(false);
    }
  }

  async function onExportPdf() {
    try {
      await exportPDF(circuit, simulationResult, projectName || "bio-alu-report");
      pushToast("PDF downloaded", "ok");
    } catch (e) {
      pushToast(e);
    }
  }

  return (
    <div className="results-page">
      <div className="results-head">
        <button className="ghost" onClick={() => nav("/canvas")}>Back to Canvas</button>
        <div>
          <h2>{projectName} <span className="success">Simulation Complete</span></h2>
          <p className="mono">{simulationResult.criticalPathMinutes} min · {simulationResult.totalStrandTypes} strand types · {simulationResult.stageCount} stages</p>
        </div>
        <button onClick={onExportPdf}>Export PDF</button>
      </div>

      <ExplainResult result={simulationResult} />
      <OptimizationDeltaPanel delta={optimizationDelta} />

      <div className="results-main results-main-xl">
        <section className="panel"><h3>Reaction Cascade Timeline</h3><ReactionGantt stages={simulationResult.stages} /></section>
        <section className="panel"><h3>Strand Cost Table</h3><StrandCostTable rows={simulationResult.strandCostTable} /></section>
      </div>

      <div className="panel optimizer">
        <h3>Optimisation Objective</h3>
        <div className="opt-grid">
          <button className="ghost" disabled={optimizing} onClick={() => runOptimize("minStrand")}>Minimise Strand Cost</button>
          <button className="ghost" disabled={optimizing} onClick={() => runOptimize("minTime")}>Minimise Reaction Time</button>
        </div>
      </div>

      <DNAHelixVisualizer title="DNA Product Structure" rows={simulationResult.strandCostTable} strands={strands} />

      <DNAStructureReport rows={simulationResult.strandCostTable} strands={strands} />

      <CoCompliancePanel result={simulationResult} />

      <button className="ghost" onClick={() => nav("/compare")}>Compare circuit topologies →</button>
    </div>
  );
}
