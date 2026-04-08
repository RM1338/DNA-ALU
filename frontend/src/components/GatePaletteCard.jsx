export default function GatePaletteCard({ gate, onDragStart }) {
  return (
    <div className="gate-card" draggable onDragStart={(e) => onDragStart(e, gate.gateType)}>
      <div className="gate-title">{gate.gateType}</div>
      <div className="gate-sub mono">{gate.bioName}</div>
      <div className="badge-row">
        <span className="badge teal">{gate.strandCost} strands</span>
        <span className="badge green">{gate.reactionTimeMin} min</span>
      </div>
    </div>
  );
}
