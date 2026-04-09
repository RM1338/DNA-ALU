import { create } from "zustand";
import { bioGateMap } from "../data/bioGateMap";

const KEY = "bioalu_circuit";
const DEFAULT_PARAMS = { temperature: 37, bufferConc: 10, strandConc: 50, hillN: 2 };

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
};

const save = (state) => {
  localStorage.setItem(
    KEY,
    JSON.stringify({
      gates: state.gates,
      wires: state.wires,
      projectName: state.projectName,
      ioInterfaceMode: state.ioInterfaceMode || "PIO",
    }),
  );
};

function validatePreset(circuit) {
  if (!circuit || typeof circuit !== "object") throw new Error("Preset payload is invalid.");
  const required = ["gates", "wires", "inputs", "outputs"];
  for (const key of required) {
    if (!Array.isArray(circuit[key])) throw new Error(`Preset missing array: ${key}`);
  }

  for (const g of circuit.gates) {
    if (!g?.id || !g?.gateType || !g?.position) throw new Error("Preset gate has invalid structure.");
    if (typeof g.position.x !== "number" || typeof g.position.y !== "number") throw new Error(`Gate ${g.id} position invalid.`);
    if (!bioGateMap[g.gateType]) throw new Error(`Gate ${g.id} has unknown type ${g.gateType}.`);
  }

  const validNodeIds = new Set([
    ...circuit.gates.map((g) => g.id),
    ...circuit.inputs.map((i) => `in_${i}`),
    ...circuit.outputs.map((o) => `out_${o}`),
  ]);

  for (const w of circuit.wires) {
    if (!w?.id || !w?.source || !w?.target) throw new Error("Preset wire has invalid structure.");
    if (!validNodeIds.has(w.source) || !validNodeIds.has(w.target)) throw new Error(`Wire ${w.id} references missing node.`);
  }

  return true;
}

export const useCircuitStore = create((set, get) => ({
  gates: load().gates || [],
  wires: load().wires || [],
  selectedGateId: null,
  simulationResult: null,
  isSimulating: false,
  projectName: load().projectName || "Untitled Circuit",
  /** CO4: PIO | INTERRUPT | DMA — sent with /api/simulate and reflected in course outcomes. */
  ioInterfaceMode: load().ioInterfaceMode || "PIO",

  setIoInterfaceMode: (mode) =>
    set((s) => {
      const allowed = ["PIO", "INTERRUPT", "DMA"];
      const next = allowed.includes(mode) ? mode : "PIO";
      const ns = { ...s, ioInterfaceMode: next };
      save(ns);
      return ns;
    }),

  addGate: (gateType, position) =>
    set((s) => {
      const id = `gate_${Date.now()}`;
      const g = { id, type: "bioGate", position, data: { gateType, params: { ...DEFAULT_PARAMS } } };
      const ns = { ...s, gates: [...s.gates, g] };
      save(ns);
      return ns;
    }),

  addIoNode: (ioType, label, position) =>
    set((s) => {
      const id = `${ioType}_${Date.now()}`;
      const node = { id, type: ioType === "input" ? "inputNode" : "outputNode", position, data: { ioType, label } };
      const ns = { ...s, gates: [...s.gates, node] };
      save(ns);
      return ns;
    }),

  setGates: (gates) =>
    set((s) => {
      const ns = { ...s, gates };
      save(ns);
      return ns;
    }),

  removeGate: (id) =>
    set((s) => {
      const ns = {
        ...s,
        gates: s.gates.filter((g) => g.id !== id),
        wires: s.wires.filter((w) => w.source !== id && w.target !== id),
      };
      save(ns);
      return ns;
    }),

  updateGateParams: (id, params) =>
    set((s) => {
      const ns = {
        ...s,
        gates: s.gates.map((g) =>
          g.id === id ? { ...g, data: { ...g.data, params: { ...(g.data?.params || DEFAULT_PARAMS), ...params } } } : g,
        ),
      };
      save(ns);
      return ns;
    }),

  setWires: (wires) =>
    set((s) => {
      const ns = { ...s, wires };
      save(ns);
      return ns;
    }),

  setSelectedGate: (id) => set({ selectedGateId: id }),
  setSimulationResult: (result) => set({ simulationResult: result }),
  setSimulating: (value) => set({ isSimulating: value }),

  setProjectName: (name) =>
    set((s) => {
      const ns = { ...s, projectName: name };
      save(ns);
      return ns;
    }),

  clearCircuit: () =>
    set((s) => {
      const ns = { ...s, gates: [], wires: [], selectedGateId: null };
      save(ns);
      return ns;
    }),

  loadPreset: (circuit) =>
    set((s) => {
      try {
        validatePreset(circuit);

        const gateNodes = circuit.gates.map((g) => ({
          id: g.id,
          type: "bioGate",
          position: g.position,
          data: { gateType: g.gateType, params: g.params || { ...DEFAULT_PARAMS } },
        }));

        const inputNodes = (circuit.inputs || []).map((label, i) => ({
          id: `in_${label}`,
          type: "inputNode",
          position: { x: 80, y: 120 + i * 80 },
          data: { ioType: "input", label },
        }));

        const outputNodes = (circuit.outputs || []).map((label, i) => ({
          id: `out_${label}`,
          type: "outputNode",
          position: { x: 980, y: 180 + i * 100 },
          data: { ioType: "output", label },
        }));

        const wires = (circuit.wires || []).map((w) => ({ ...w, type: "smoothstep", style: { stroke: "#00FF88", strokeWidth: 1.5, opacity: 0.6 } }));
        const ns = { ...s, gates: [...inputNodes, ...gateNodes, ...outputNodes], wires, projectName: circuit.projectName || s.projectName };
        save(ns);
        return ns;
      } catch (err) {
        console.error("Invalid preset rejected:", err);
        return s;
      }
    }),

  getTotalStrandCost: () => get().gates.reduce((sum, g) => sum + (bioGateMap[g.data?.gateType]?.strandCost || 0), 0),

  getGateCount: () => get().gates.filter((g) => g.type === "bioGate").length,
}));
