import { useMemo, useState } from "react";
import { bioGateMap } from "../data/bioGateMap";
import DNAStrandDiagram from "./DNAStrandDiagram";
import KineticsChart from "./KineticsChart";
import DNAHelixVisualizer from "./DNAHelixVisualizer";

export default function GateDetailDrawer({ gate, onClose, onApply }) {
  const lib = useMemo(() => bioGateMap[gate?.data?.gateType], [gate]);
  const [p, setP] = useState(gate?.data?.params || { temperature: 37, bufferConc: 10, strandConc: 50, hillN: 2 });
  if (!gate || !lib) return null;

  const strandRows = [{
    gateId: gate.id, gateType: lib.gateType, bioMechanism: lib.bioName,
    strandCost: lib.strandCost, reactionTimeMin: lib.reactionTimeMin,
    enzyme: lib.enzyme, stageIndex: 1,
  }];

  return (
    <div className="drawer-overlay">
      <aside className="drawer">
        <button className="ghost" onClick={onClose}>Close</button>
        <h2>{lib.gateType}</h2>
        <p className="mono" style={{ color: "#00C9A7" }}>{lib.bioName}</p>

        <section className="panel">
          <h4>DNA Strand Diagram</h4>
          <DNAStrandDiagram inputCount={lib.inputCount} enzyme={lib.enzyme} />
        </section>

        <DNAHelixVisualizer title="Local Gate Helix Model" rows={strandRows} />

        <section className="panel">
          <h4>Kinetics (Hill)</h4>
          <KineticsChart n={p.hillN} />
        </section>

        <section className="panel">
          <h4>Editable Parameters</h4>
          <label>Reaction Temperature (°C)</label>
          <input className="mono" type="number" value={p.temperature} onChange={(e) => setP({ ...p, temperature: Number(e.target.value) })} />
          <label>Buffer Concentration (mM)</label>
          <input className="mono" type="number" value={p.bufferConc} onChange={(e) => setP({ ...p, bufferConc: Number(e.target.value) })} />
          <label>Strand Concentration (nM)</label>
          <input className="mono" type="number" value={p.strandConc} onChange={(e) => setP({ ...p, strandConc: Number(e.target.value) })} />
          <label>Hill Coefficient (n): {p.hillN}</label>
          <input type="range" min={1} max={4} step={0.1} value={p.hillN} onChange={(e) => setP({ ...p, hillN: Number(e.target.value) })} />
        </section>

        <button onClick={() => onApply(p)}>Apply Changes</button>
        <button className="ghost">View in SBOL Library</button>
      </aside>
    </div>
  );
}
