import { gateList } from "../data/bioGateMap";

export default function BioExplainer() {
  return (
    <div className="panel explainer">
      <h3>What This Means (Non-Biology View)</h3>
      <p>
        This app treats each logic gate as a lab reaction. Instead of nanoseconds, we measure minutes.
        Instead of transistor count, we measure DNA strand types needed to synthesize the circuit.
      </p>
      <ol>
        <li><strong>Build:</strong> Add Input/Output + gates and connect wires.</li>
        <li><strong>Run:</strong> Simulation computes reaction stages and truth table.</li>
        <li><strong>Read:</strong> Timeline = synthesis order, strand table = lab cost drivers.</li>
      </ol>
      <div className="gate-legend-grid">
        {gateList.map((g) => (
          <div key={g.gateType} className="legend-row">
            <span className="mono" style={{ color: g.color }}>{g.gateType}</span>
            <span>{g.bioName}</span>
            <span className="mono">{g.strandCost} strands</span>
            <span className="mono">{g.reactionTimeMin} min</span>
          </div>
        ))}
      </div>
    </div>
  );
}
