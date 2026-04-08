import { Handle, Position } from "reactflow";

export default function InputNode({ data }) {
  return (
    <div className="io-node input">
      <div className="io-label mono">{data.label}</div>
      <Handle type="source" position={Position.Right} id="out" style={{ background: "#00FF88" }} />
    </div>
  );
}
