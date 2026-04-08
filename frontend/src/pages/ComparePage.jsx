import { useEffect, useMemo, useState } from "react";
import { exportPDF, exportSBOL, fetchPresets, simulateCircuit } from "../api/bioApi";
import { bioGateMap } from "../data/bioGateMap";
import { useUiStore } from "../store/uiStore";

function summarize(circuit) {
  const strands = circuit.gates.reduce((acc, g) => acc + (bioGateMap[g.gateType]?.strandCost || 0), 0);
  const totalTime = circuit.gates.reduce((acc, g) => acc + (bioGateMap[g.gateType]?.reactionTimeMin || 0), 0);
  const stages = Math.max(1, Math.ceil(circuit.gates.length / 2));
  return { strands, totalTime, stages };
}

function MiniTopology({ gates }) {
  return (
    <svg viewBox="0 0 860 250" width="100%" height="220">
      {gates.slice(0, 10).map((g, i) => {
        const col = i % 5;
        const row = Math.floor(i / 5);
        const x = 60 + col * 150;
        const y = 40 + row * 120;
        return (
          <g key={g.id}>
            <polygon points={`${x + 22},${y} ${x + 44},${y + 12} ${x + 44},${y + 36} ${x + 22},${y + 48} ${x},${y + 36} ${x},${y + 12}`} fill="#1E1E1E" stroke="#00FF88" strokeOpacity="0.7" />
            <text x={x + 22} y={y + 30} textAnchor="middle" fill="#fff" fontSize="10">{g.gateType}</text>
            {col < 4 && <line x1={x + 44} y1={y + 24} x2={x + 145} y2={y + 24} stroke="#00FF88" strokeOpacity="0.4" />}
          </g>
        );
      })}
    </svg>
  );
}

function GateTable({ gates }) {
  return (
    <table className="cost-table">
      <thead><tr><th>Gate</th><th>Mechanism</th><th>Strands</th><th>Time</th></tr></thead>
      <tbody>
        {gates.map((g) => {
          const d = bioGateMap[g.gateType];
          return <tr key={g.id}><td className="mono">{g.gateType}</td><td>{d?.bioName}</td><td className="mono">{d?.strandCost}</td><td className="mono">{d?.reactionTimeMin} min</td></tr>;
        })}
      </tbody>
    </table>
  );
}

async function exportCircuit(circuit, type) {
  const result = await simulateCircuit(circuit);
  if (type === "pdf") return exportPDF(circuit, result, circuit.projectName);
  return exportSBOL(circuit, result);
}

export default function ComparePage() {
  const pushToast = useUiStore((s) => s.pushToast);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPresets().then(setData).catch((e) => pushToast(e.message || "Failed to load presets")).finally(() => setLoading(false));
  }, [pushToast]);

  const summary = useMemo(() => {
    if (!data) return null;
    return { r: summarize(data.rippleCarry), c: summarize(data.carryLookahead) };
  }, [data]);

  if (loading) return <div className="compare-loading"><div className="panel skel" /><div className="panel skel" /></div>;
  if (!data || !summary) return <div className="compare-loading">No preset data</div>;

  const doExport = async (circuit, type) => {
    try { await exportCircuit(circuit, type); pushToast(`${circuit.projectName} ${type.toUpperCase()} downloaded`, "ok"); }
    catch (e) { pushToast(e.message || "Export failed"); }
  };

  return (
    <div className="compare-page compare-page-xl">
      <div className="compare-split compare-split-xl">
        <section className="panel compare-panel-xl">
          <h3>Ripple Carry</h3>
          <MiniTopology gates={data.rippleCarry.gates} />
          <p className="mono">{summary.r.strands} strand types · {summary.r.totalTime} min · {summary.r.stages} stages</p>
          <GateTable gates={data.rippleCarry.gates} />
        </section>

        <section className="panel compare-panel-xl">
          <h3>Carry Lookahead</h3>
          <MiniTopology gates={data.carryLookahead.gates} />
          <p className="mono">{summary.c.strands} strand types · {summary.c.totalTime} min · {summary.c.stages} stages</p>
          <GateTable gates={data.carryLookahead.gates} />
        </section>
      </div>

      <div className="diff-card diff-card-xl">
        <div className="down">↓ {Math.max(0, summary.r.totalTime - summary.c.totalTime)} min faster synthesis</div>
        <div className="up">↑ +{Math.max(0, summary.c.strands - summary.r.strands)} strand types required</div>
        <div className="up">↑ +{Math.max(0, summary.c.stages - summary.r.stages)} reaction stages</div>
      </div>

      <div className="panel export-grid-xl">
        <button className="ghost" onClick={() => doExport(data.rippleCarry, "pdf")}>Export Ripple PDF</button>
        <button className="ghost" onClick={() => doExport(data.rippleCarry, "sbol")}>Export Ripple SBOL XML</button>
        <button className="ghost" onClick={() => doExport(data.carryLookahead, "pdf")}>Export CLA PDF</button>
        <button className="ghost" onClick={() => doExport(data.carryLookahead, "sbol")}>Export CLA SBOL XML</button>
      </div>
    </div>
  );
}
