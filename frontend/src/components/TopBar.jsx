import { useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { exportPDF, exportSBOL } from "../api/bioApi";
import { useCircuitStore } from "../store/circuitStore";
import { useUiStore } from "../store/uiStore";

export default function TopBar() {
  const nav = useNavigate();
  const pushToast = useUiStore((s) => s.pushToast);
  const { projectName, setProjectName, gates, wires, simulationResult, ioInterfaceMode } = useCircuitStore();
  const nodeById = useMemo(() => Object.fromEntries(gates.map((g) => [g.id, g])), [gates]);

  const circuit = {
    projectName,
    gates: gates.filter((g) => g.type === "bioGate").map((g) => ({ id: g.id, gateType: g.data?.gateType, position: g.position, params: g.data?.params || {} })),
    wires: wires.map((w) => {
      const sourceNode = nodeById[w.source];
      const targetNode = nodeById[w.target];
      return {
        ...w,
        source: sourceNode?.type === "inputNode" ? `in_${sourceNode.data?.label}` : w.source,
        target: targetNode?.type === "outputNode" ? `out_${targetNode.data?.label}` : w.target,
      };
    }),
    inputs: gates.filter((g) => g.type === "inputNode").map((g) => g.data?.label),
    outputs: gates.filter((g) => g.type === "outputNode").map((g) => g.data?.label),
    ioInterfaceMode: simulationResult?.courseOutcomes?.co4?.mode || ioInterfaceMode,
  };

  async function onExportPdf() {
    try { if (!simulationResult) throw new Error("Run simulation first"); await exportPDF(circuit, simulationResult, projectName); pushToast("PDF downloaded", "ok"); }
    catch (e) { pushToast(e.message || "PDF export failed"); }
  }
  async function onExportSbol() {
    try { if (!simulationResult) throw new Error("Run simulation first"); await exportSBOL(circuit, simulationResult); pushToast("SBOL downloaded", "ok"); }
    catch (e) { pushToast(e.message || "SBOL export failed"); }
  }

  return (
    <header className="topbar">
      <div className="logo" onClick={() => nav('/canvas')} style={{ cursor: 'pointer' }}>BIO-ALU</div>
      <nav className="top-nav">
        <NavLink to="/canvas" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>Canvas</NavLink>
        <NavLink to="/results" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>Simulation</NavLink>
        <NavLink to="/compare" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>Comparison</NavLink>
        <NavLink to="/guide" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>Guide</NavLink>
      </nav>
      <input className="project-input" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
      <div className="top-actions">
        <button
          className="ghost"
          onClick={() => {
            localStorage.setItem("bioalu_circuit", JSON.stringify({ gates, wires, projectName, ioInterfaceMode }));
            pushToast("Saved locally", "ok");
          }}
        >
          Save
        </button>
        <button className="ghost" onClick={onExportPdf}>Export PDF</button>
        <button className="ghost" onClick={onExportSbol}>Export SBOL</button>
      </div>
    </header>
  );
}
