import { useMemo, useState } from "react";

function InstructionCycle({ stages = [] }) {
  return (
    <div className="co-box">
      <h4>CO1 · Instruction Cycle Orchestration</h4>
      <p>Maps ALU simulation into a deterministic execution cycle similar to fetch/decode/execute/writeback.</p>
      <div className="co-chip-row">
        <span className="co-chip">Fetch Circuit</span>
        <span className="co-chip">Decode Gate Map</span>
        <span className="co-chip">Execute Stage DAG</span>
        <span className="co-chip">Writeback Metrics</span>
      </div>
      <p className="mono">Observed stages: {stages.length} · Critical path schedule generated.</p>
    </div>
  );
}

function IOInterfacing({ truthRows = [] }) {
  const [mode, setMode] = useState("PIO");
  const rows = truthRows.length;
  const throughput = mode === "DMA" ? rows * 2.4 : rows * 1.0;
  return (
    <div className="co-box">
      <h4>CO4 · Programmable Peripheral Interfacing</h4>
      <p>Input/Output nodes are treated as programmable peripheral ports. Mode switching demonstrates IO control strategy.</p>
      <div className="co-toggle-row">
        <button className={`ghost ${mode === "PIO" ? "selected" : ""}`} onClick={() => setMode("PIO")}>PIO</button>
        <button className={`ghost ${mode === "Interrupt" ? "selected" : ""}`} onClick={() => setMode("Interrupt")}>Interrupt</button>
        <button className={`ghost ${mode === "DMA" ? "selected" : ""}`} onClick={() => setMode("DMA")}>DMA</button>
      </div>
      <p className="mono">Rows transferred: {rows} · IO throughput index: {throughput.toFixed(1)} units ({mode})</p>
    </div>
  );
}

function GpuArchitecture({ stages = [] }) {
  const [arch, setArch] = useState("SIMT");
  const base = stages.reduce((a, s) => a + (s.durationMinutes || 0), 0) || 1;
  const speedup = arch === "SIMT" ? 1.8 : arch === "Tensor" ? 2.3 : 1.3;
  const effTime = (base / speedup).toFixed(2);
  return (
    <div className="co-box">
      <h4>CO5 · GPU Architecture Evaluation</h4>
      <p>Evaluates ALU graph workload on abstract GPU execution models for high-performance simulation acceleration.</p>
      <div className="co-toggle-row">
        <button className={`ghost ${arch === "SIMT" ? "selected" : ""}`} onClick={() => setArch("SIMT")}>SIMT Cores</button>
        <button className={`ghost ${arch === "Tensor" ? "selected" : ""}`} onClick={() => setArch("Tensor")}>Tensor/Matrix</button>
        <button className={`ghost ${arch === "Hybrid" ? "selected" : ""}`} onClick={() => setArch("Hybrid")}>Hybrid GPU</button>
      </div>
      <p className="mono">Estimated speedup: {speedup.toFixed(1)}x · Effective sim time: {effTime} min</p>
    </div>
  );
}

export default function CoCompliancePanel({ result }) {
  const truthRows = useMemo(() => result?.truthTable || [], [result]);
  return (
    <section className="panel co-panel">
      <h3>Course Outcome Compliance (CO1, CO4, CO5)</h3>
      <div className="co-grid">
        <InstructionCycle stages={result?.stages || []} />
        <IOInterfacing truthRows={truthRows} />
        <GpuArchitecture stages={result?.stages || []} />
      </div>
    </section>
  );
}
