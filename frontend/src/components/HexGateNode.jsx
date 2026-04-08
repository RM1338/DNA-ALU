import { Handle, Position } from "reactflow";

export default function HexGateNode({ data, selected }) {
  const color = data.color || "#00FF88";
  return (
    <div className="hex-wrap" style={{ width: 64, height: 72 }}>
      <svg width="64" height="72">
        <polygon
          points="32,3 58,18 58,54 32,69 6,54 6,18"
          fill="#1c1b1b"
          stroke={color}
          strokeOpacity={selected ? 1 : 0.45}
          strokeWidth={selected ? 2 : 1.5}
        />
      </svg>
      <div className="hex-label mono">{data.gateType}</div>
      <Handle type="target" position={Position.Left} id="in-0" style={{ background: "#00c7a5" }} />
      <Handle type="target" position={Position.Left} id="in-1" style={{ top: "70%", background: "#00c7a5" }} />
      <Handle type="source" position={Position.Right} id="out" style={{ background: "#00ff88" }} />
    </div>
  );
}
