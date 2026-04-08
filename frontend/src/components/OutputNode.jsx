import { Handle, Position } from "reactflow";

export default function OutputNode({ data }) {
  return (
    <div className="io-node output">
      <Handle type="target" position={Position.Left} id="in" style={{ background: "#00C9A7" }} />
      <div className="io-label mono">{data.label}</div>
    </div>
  );
}
