import { useMemo } from "react";

function PhaseCard({ phase }) {
  const entries = phase?.metrics ? Object.entries(phase.metrics) : [];
  return (
    <div className="co-phase">
      <div className="co-phase-head">
        <span className="co-phase-id mono">{phase?.id}</span>
        <h5>{phase?.title}</h5>
      </div>
      <p className="co-phase-desc">{phase?.description}</p>
      {entries.length > 0 && (
        <ul className="co-metrics mono">
          {entries.map(([k, v]) => (
            <li key={k}>
              <span className="co-metric-key">{k}:</span>{" "}
              <span className="co-metric-val">{typeof v === "object" ? JSON.stringify(v) : String(v)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function CoCompliancePanel({ result }) {
  const co = result?.courseOutcomes;

  const fallback = useMemo(() => !co, [co]);

  if (fallback) {
    return (
      <section className="panel co-panel">
        <h3>Course outcomes (CO1, CO4, CO5)</h3>
        <p className="muted">Run a new simulation to load computed course-outcome reports from the server.</p>
      </section>
    );
  }

  const { co1, co4, co5 } = co;

  return (
    <section className="panel co-panel">
      <h3>Course outcome compliance — computed from this simulation</h3>
      <p className="co-lede muted">
        CO1 maps the wet-lab schedule to a fetch/decode/execute/writeback narrative. CO4 models IO ports and truth-table
        transfer under your selected interface mode. CO5 estimates abstract GPU-style speedups from graph parallelism vs serial work.
      </p>

      <div className="co-grid co-grid-detailed">
        <div className="co-box">
          <h4>CO1 · Instruction cycle orchestration</h4>
          <p className="mono co-summary">
            Pipeline stages: {co1.pipelineStageCount} · Logical gates: {co1.logicalGateCount} · Unique types:{" "}
            {(co1.uniqueGateTypes || []).join(", ")}
          </p>
          <div className="co-phase-stack">
            {(co1.phases || []).map((p) => (
              <PhaseCard key={p.id} phase={p} />
            ))}
          </div>
        </div>

        <div className="co-box">
          <h4>CO4 · Programmable peripheral interfacing</h4>
          <p className="co-summary">
            Mode <span className="mono">{co4.mode}</span> · Ports in/out:{" "}
            <span className="mono">
              {co4.inputPortCount}/{co4.outputPortCount}
            </span>
          </p>
          <ul className="co-metrics mono">
            <li>
              Truth rows: <strong>{co4.truthTableRows}</strong>
            </li>
            <li>
              Bits per row (in+out): <strong>{co4.bitsPerTruthRow}</strong>
            </li>
            <li>
              Total bits transferred (model): <strong>{co4.totalBitsTransferred}</strong>
            </li>
            <li>
              Throughput index: <strong>{co4.throughputIndex}</strong>
            </li>
            <li>
              Interface latency factor × critical path: <strong>{co4.interfaceLatencyFactor}</strong>
            </li>
            <li>
              Adjusted schedule (incl. IO service model): <strong>{co4.adjustedScheduleMinutes} min</strong>{" "}
              <span className="muted">(DAG critical path remains primary)</span>
            </li>
          </ul>
        </div>

        <div className="co-box">
          <h4>CO5 · GPU architecture evaluation</h4>
          <p className="mono co-summary">
            Serial work (sum of gate times): {co5.serialWorkMinutes} min · Critical path: {co5.criticalPathMinutes} min ·
            Max parallel gates/stage: {co5.maxParallelGatesPerStage} · Avg parallelism: {co5.averageParallelism} · Ideal
            speedup cap: {co5.estimatedIdealSpeedup}×
          </p>
          <div className="co-gpu-grid">
            {(co5.profiles || []).map((p) => (
              <div key={p.profileId} className="co-gpu-card">
                <div className="co-gpu-title">{p.label}</div>
                <div className="mono">
                  {p.speedup}× speedup → {p.effectiveScheduleMinutes} min effective
                </div>
                <p className="co-gpu-why">{p.rationale}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
