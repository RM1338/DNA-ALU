import { useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import "reactflow/dist/style.css";
import { useNavigate } from "react-router-dom";
import { gateList } from "../data/bioGateMap";
import GatePaletteCard from "../components/GatePaletteCard";
import HexGateNode from "../components/HexGateNode";
import InputNode from "../components/InputNode";
import OutputNode from "../components/OutputNode";
import GateDetailDrawer from "../components/GateDetailDrawer";
import MetricKPI from "../components/MetricKPI";
import LiveTruthTable from "../components/LiveTruthTable";
import { useCircuitStore } from "../store/circuitStore";
import { evaluateTruthTable } from "../utils/circuitEvaluator";
import { simulateCircuit } from "../api/bioApi";
import { RIPPLE_CARRY_ADDER, CARRY_LOOKAHEAD_ADDER } from "../data/presetCircuits";
import { useUiStore } from "../store/uiStore";
import SimulationOverlay from "../components/SimulationOverlay";

const INPUT_LABELS = ["A", "B", "Cin", "D", "E"];
const OUTPUT_LABELS = ["Sum", "Cout", "Out3", "Out4"];
const MIN_SIMULATION_POPUP_MS = 5000;

function mapCircuit(nodes, edges) {
  const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const inputs = nodes.filter((n) => n.type === "inputNode");
  const outputs = nodes.filter((n) => n.type === "outputNode");
  const gates = nodes.filter((n) => n.type === "bioGate").map((n) => ({
    id: n.id,
    gateType: n.data?.gateType,
    position: n.position,
    params: n.data?.params || {},
  }));

  const wires = edges.map((e) => {
    const src = nodeById[e.source];
    const tgt = nodeById[e.target];

    let source = e.source;
    let target = e.target;

    if (src?.type === "inputNode") source = `in_${src.data?.label}`;
    if (tgt?.type === "outputNode") target = `out_${tgt.data?.label}`;

    return {
      id: e.id,
      source,
      sourceHandle: e.sourceHandle || "out",
      target,
      targetHandle: e.targetHandle || "in",
    };
  });

  return {
    gates,
    wires,
    inputLabels: inputs.map((i) => i.data?.label),
    outputLabels: outputs.map((o) => o.data?.label),
  };
}

export default function CanvasPage() {
  const store = useCircuitStore();
  const navigate = useNavigate();
  const pushToast = useUiStore((s) => s.pushToast);
  const [q, setQ] = useState("");

  const nodes = store.gates;
  const edges = store.wires;

  const filtered = gateList.filter((g) =>
    `${g.gateType} ${g.bioName}`.toLowerCase().includes(q.toLowerCase()),
  );

  const inputCount = nodes.filter((n) => n.type === "inputNode").length;
  const outputCount = nodes.filter((n) => n.type === "outputNode").length;

  const transformed = useMemo(() => mapCircuit(nodes, edges), [nodes, edges]);

  const truthRows = useMemo(() => {
    if (!transformed.inputLabels.length || !transformed.outputLabels.length) return [];

    const evalNodes = [
      ...transformed.inputLabels.map((l) => ({ id: `in_${l}`, type: "input" })),
      ...transformed.gates.map((g) => ({ id: g.id, data: { gateType: g.gateType } })),
      ...transformed.outputLabels.map((l) => ({ id: `out_${l}`, type: "output" })),
    ];

    return evaluateTruthTable(evalNodes, transformed.wires, transformed.inputLabels, transformed.outputLabels);
  }, [transformed]);

  const unconnectedWarning = useMemo(() => {
    const gateNodes = nodes.filter((n) => n.type === "bioGate");
    if (!gateNodes.length) return false;
    return gateNodes.some((g) => !edges.some((e) => e.source === g.id || e.target === g.id));
  }, [nodes, edges]);

  function onDrop(e) {
    e.preventDefault();
    const gateType = e.dataTransfer.getData("gateType");
    if (!gateType) return;
    const rect = e.currentTarget.getBoundingClientRect();
    store.addGate(gateType, { x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  async function runSimulation() {
    const payload = {
      projectName: store.projectName,
      gates: transformed.gates,
      wires: transformed.wires,
      inputs: transformed.inputLabels,
      outputs: transformed.outputLabels,
      ioInterfaceMode: store.ioInterfaceMode,
    };

    const startedAt = Date.now();
    store.setSimulating(true);
    try {
      const result = await simulateCircuit(payload);
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, MIN_SIMULATION_POPUP_MS - elapsed);
      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining));
      }
      store.setSimulationResult(result);
      store.setSimulating(false);
      navigate("/results");
    } catch (e) {
      pushToast(e.message || "Simulation failed");
      store.setSimulating(false);
    }
  }

  return (
    <div className="page">
      <div className="layout">
        <aside>
          <div className="pane-head">
            <div className="dot" />
            <span className="mono pane-title">Gate Palette</span>
          </div>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search gate or biology" />
          {filtered.map((g) => (
            <GatePaletteCard key={g.gateType} gate={g} onDragStart={(e, t) => e.dataTransfer.setData("gateType", t)} />
          ))}
        </aside>

        <main onDrop={onDrop} onDragOver={(e) => e.preventDefault()}>
          <div className="floating-tools">
            <button className="ghost" onClick={() => store.addIoNode("input", INPUT_LABELS[inputCount] || `In${inputCount + 1}`, { x: 70, y: 120 + inputCount * 80 })}>Add Input</button>
            <button className="ghost" onClick={() => store.addIoNode("output", OUTPUT_LABELS[outputCount] || `Out${outputCount + 1}`, { x: 950, y: 180 + outputCount * 90 })}>Add Output</button>
            <button className="ghost" onClick={() => store.loadPreset(RIPPLE_CARRY_ADDER)}>Load Ripple</button>
            <button className="ghost" onClick={() => store.loadPreset(CARRY_LOOKAHEAD_ADDER)}>Load CLA</button>
            <button className="ghost" onClick={() => window.confirm("Clear circuit?") && store.clearCircuit()}>Clear</button>
          </div>

          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={{ bioGate: HexGateNode, inputNode: InputNode, outputNode: OutputNode }}
            onNodesChange={(changes) => store.setGates(applyNodeChanges(changes, nodes))}
            onEdgesChange={(changes) => store.setWires(applyEdgeChanges(changes, edges))}
            onNodeClick={(_, n) => n.type === "bioGate" && store.setSelectedGate(n.id)}
            onConnect={(params) =>
              store.setWires(
                addEdge(
                  {
                    ...params,
                    type: "smoothstep",
                    style: { stroke: "#00FF88", strokeWidth: 1.5, opacity: 0.8 },
                  },
                  edges,
                ),
              )
            }
            fitView
            deleteKeyCode="Delete"
          >
            <Background gap={24} color="rgba(59,75,61,0.45)" />
            <Controls />
          </ReactFlow>
        </main>

        <aside>
          <div className="pane-head"><div className="dot" /><span className="mono pane-title">Telemetry</span></div>
          <MetricKPI label="Total Strand Types" value={store.getTotalStrandCost()} accent="var(--accent-teal)" />
          <MetricKPI label="Gate Count" value={store.getGateCount()} />
          <MetricKPI label="Input Nodes" value={inputCount} />
          <MetricKPI label="Output Nodes" value={outputCount} />

          <div className="co-io-panel">
            <div className="mono pane-title co-io-title">CO4 · Peripheral interface</div>
            <p className="co-io-hint">How truth-table IO is modeled for this run (PIO / IRQ / DMA).</p>
            <div className="co-toggle-row">
              <button
                type="button"
                className={`ghost ${store.ioInterfaceMode === "PIO" ? "selected" : ""}`}
                onClick={() => store.setIoInterfaceMode("PIO")}
              >
                PIO
              </button>
              <button
                type="button"
                className={`ghost ${store.ioInterfaceMode === "INTERRUPT" ? "selected" : ""}`}
                onClick={() => store.setIoInterfaceMode("INTERRUPT")}
              >
                Interrupt
              </button>
              <button
                type="button"
                className={`ghost ${store.ioInterfaceMode === "DMA" ? "selected" : ""}`}
                onClick={() => store.setIoInterfaceMode("DMA")}
              >
                DMA
              </button>
            </div>
          </div>

          {inputCount === 0 && store.getGateCount() > 0 && <div className="warn">No input nodes</div>}
          {outputCount === 0 && store.getGateCount() > 0 && <div className="warn">No output nodes</div>}
          {unconnectedWarning && <div className="warn">Circuit has unconnected gates</div>}

          <button disabled={!store.getGateCount() || !inputCount || !outputCount || store.isSimulating} onClick={runSimulation}>
            {store.isSimulating ? "Running reaction cascade..." : "Run Full Simulation"}
          </button>

          <LiveTruthTable rows={truthRows} />
        </aside>
      </div>

      <SimulationOverlay active={store.isSimulating} />

      {store.selectedGateId && (
        <GateDetailDrawer
          gate={nodes.find((n) => n.id === store.selectedGateId)}
          onClose={() => store.setSelectedGate(null)}
          onApply={(params) => store.updateGateParams(store.selectedGateId, params)}
        />
      )}
    </div>
  );
}
