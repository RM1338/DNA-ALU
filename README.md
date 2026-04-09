# DNA-ALU

Full-stack **biological logic circuit simulator**: you design digital circuits with DNA-inspired gate metadata, run a server-side simulation (truth table + staged reaction timeline + cost), and review results with course-outcome reports and exports.

For step-by-step usage, see **[USER_GUIDE.md](USER_GUIDE.md)**.

### Prerequisites

- **Python 3.8+** (backend)
- **Node.js 16+** and **npm** (frontend)

---

## Stack

| Layer | Technology |
|-------|------------|
| Backend | Python, **FastAPI** (`backend/main.py`) |
| Frontend | **React**, **Vite**, **React Flow** (canvas), **Zustand** (state), **Recharts** (charts) |
| API | REST under `/api/*` (default `http://localhost:8000`; interactive docs at `/docs`) |

---

## Repository layout

| Path | Role |
|------|------|
| `backend/` | FastAPI app: simulation, course outcomes, optimization, PDF/SBOL export, presets |
| `frontend/` | Vite + React UI: canvas, results, compare, guide |
| `USER_GUIDE.md` | Detailed installation, workflows, and interface reference |

---

## Features (current)

### Circuit design (Canvas)

- **Visual editor** — Place **input** and **output** ports, **logic gates** (`AND`, `OR`, `NOT`, `XOR`, `NAND`, `NOR`, `XNOR`, `BUFFER`), and **wires** between them (`frontend/src/pages/CanvasPage.jsx`).
- **Gate library** — Each gate type has biological metadata (mechanism name, strand cost, reaction time, enzyme) in `backend/gate_library.py`, mirrored in `frontend/src/data/bioGateMap.js` for the UI.
- **Gate details** — Drawer per gate with tunable **parameters** (temperature, buffer concentration, strand concentration, Hill coefficient) and a **Hill curve** preview (`frontend/src/components/GateDetailDrawer.jsx`). Note: timing in the main simulator uses fixed library constants; params are mainly for display and pedagogy.
- **Live truth table** — Client-side evaluation of all input combinations before you run the full simulation (`frontend/src/utils/circuitEvaluator.js`, `LiveTruthTable`).
- **Presets** — Load **Ripple Carry** or **Carry Lookahead** full-adder presets (same inputs/outputs, different gate networks) from `frontend/src/data/presetCircuits.js` (backend definitions in `backend/preset_data.py`).
- **IO interface mode (CO4)** — Choose **PIO**, **Interrupt**, or **DMA** to model how truth-table I/O is characterized in course metrics (`circuitStore` → `ioInterfaceMode` on simulate). Does not change the circuit’s Boolean behavior; see Course outcomes below.
- **Persistence** — **Save** stores the circuit in **localStorage** from the top bar (`TopBar.jsx`).

### Simulation (backend + Simulation page)

- **Full simulation** — `POST /api/simulate` builds a **DAG** of gates, schedules **topological stages** (parallel reaction waves), rejects cycles, and computes:
  - **Truth table** for all input combinations
  - **Critical-path time** (sum of per-stage bottleneck times)
  - **Strand cost table** (per gate: mechanism, strand cost, time, enzyme, stage)
  - **Course outcome bundle** (`course_outcomes.py`): CO1, CO4, CO5
- **Results UI** — Explanation of strand count vs timeline, **Reaction Cascade Timeline** (Gantt-style chart), **Strand Cost Table**, **DNA structure report** (synthetic A/T/G/C sequences, complement, GC%, Tm from `strandModel.js`), **DNA helix visualizer**, **Course outcome compliance** panel (CO1–CO5).
- **Simulation overlay** — Full-screen progress messaging while the run is in flight (`SimulationOverlay.jsx`).

### Optimization

- **Objectives** — `POST /api/optimize` with `minStrand` or `minTime` (`backend/optimizer.py`): replaces some gate types (e.g. `NAND`→`AND`) when library metadata improves the chosen metric, then re-simulates. Results page shows **before/after** strand and time deltas.

### Comparison page

- Side-by-side **Ripple Carry** vs **Carry Lookahead** presets: topology sketch, gate list with mechanism/strand/time, rough summaries, and **PDF/SBOL export** per preset (runs simulate then export).

### Exports

- **PDF** — `POST /api/export/pdf`: report with circuit summary, tables, timeline, CO summary when present (`backend/export_pdf.py`). Triggered from **Results** or **top bar** (after a simulation).
- **SBOL-like XML** — `POST /api/export/sbol`: structured component representation for tooling (`backend/export_sbol.py`).

### Guide

- In-app **Guide** route (`/guide`) for documentation pointers (`GuidePage.jsx`).

### API (other)

- **`GET /api/presets`** — Ripple Carry and Carry Lookahead `CircuitPayload` JSON.
- **`POST /api/kinetics`** — Hill equation rates for a list of concentrations (`backend/kinetics.py`). The UI Hill chart on the gate drawer is computed client-side; the endpoint is available for experiments or scripts.

---

## Course outcomes (COs) explained

**Course outcomes (COs)** are the learning goals your syllabus ties to the project. DNA-ALU **implements three of them** as structured reports on every successful simulation so you can show *how* the app relates to COA topics—not just a generic “circuit simulator.”

### CO1 — Instruction cycle (fetch → decode → execute → writeback)

**Idea:** A CPU repeats a cycle: bring in work, figure out what to do, run it, write results. Your wet-lab pipeline is modeled the same way at a **high level**.

**In this app:** Loading the circuit graph is like **fetch**; binding each gate to a mechanism and timings from the library is **decode**; running the staged DAG (wavefronts of parallel reactions) is **execute**; aggregating strands, critical path, and truth table is **writeback**.

**Where you see it:** **Simulation** page → **Course outcome compliance** → CO1 phases, plus the simulation overlay text that walks through the pipeline.

---

### CO4 — Programmable peripheral interfacing (PIO / Interrupt / DMA)

**Idea:** Processors talk to the outside world through **I/O**: moving data in and out of ports, sometimes polling (PIO), sometimes on events (interrupts), sometimes via a controller that moves blocks of data (DMA).

**In this app:** Your **inputs and outputs** on the canvas are the “peripherals.” The **PIO / Interrupt / DMA** selector does **not** change Boolean logic or the reaction schedule. It only changes **CO4’s numeric story**: how “heavy” moving the truth-table bits in and out is modeled (throughput index, latency factor, adjusted schedule minutes).

**Where you see it:** **Canvas** (interface mode buttons) and **Simulation** → CO4 block. Pick a mode before you run so the report matches what you want to describe in your report.

---

### CO5 — GPU-style parallelism (SIMT / Tensor / Hybrid)

**Idea:** GPUs get speed by running **many operations in parallel** when dependencies allow. You compare **how long work would take if every gate ran one-by-one** (serial) vs **how long your staged schedule takes** (parallelism along the critical path).

**In this app:** The backend computes **serial work** (sum of all gate reaction times) and **critical-path time** (actual staged timeline). From that it derives three **abstract** “GPU personality” scores—**SIMT** (wide wavefronts), **Tensor** (batched / structured flavor), **Hybrid** (average of the two)—each with a hypothetical speedup and “effective” minutes. These are **teaching analogies** on your graph, **not** benchmarks on real GPU hardware.

**Where you see it:** **Simulation** → CO5 cards. Use them to discuss parallelism and depth vs width of your reaction stages, not to claim a specific GPU model was executed.

---

## Course outcome mapping (implemented in code)

### CO1: Use relevant instruction cycle to efficiently manage processor functionality

- **Implementation:** `backend/course_outcomes.py` builds a **fetch → decode → execute → writeback** report from the real graph, library decode, staged DAG, and aggregated metrics. Returned on every `/api/simulate` response as `courseOutcomes.co1`.
- **UI:** Results page **Course outcome compliance** section; simulation overlay messages reference the same pipeline.

### CO4: Use interfacing techniques for programmable peripheral devices

- **Implementation:** Canvas **PIO / Interrupt / DMA** control (stored in `frontend/src/store/circuitStore.js`, sent as `ioInterfaceMode` on simulate). Backend **CO4** metrics (throughput index, latency factor, adjusted schedule) are computed from truth-table size and port counts in `course_outcomes.py`.

### CO5: Evaluate GPU architectures for high-performance computing

- **Implementation:** `course_outcomes.py` compares **serial work** (sum of per-gate reaction times) to **critical-path** time and emits **SIMT / Tensor / Hybrid** profiles with speedups and effective schedule minutes in `courseOutcomes.co5`. These are **abstract** GPU-style analogies on the same circuit graph, not real GPU benchmarks.

PDF exports include a short CO summary when `courseOutcomes` is present (`backend/export_pdf.py`).

---

## API quick reference

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/simulate` | Run full simulation; returns truth table, stages, strand table, `courseOutcomes` |
| `POST` | `/api/optimize` | Body: `{ "circuit", "objective" }` with `objective` = `minStrand` or `minTime` |
| `GET` | `/api/presets` | JSON presets: `rippleCarry`, `carryLookahead` |
| `POST` | `/api/export/pdf` | PDF report (requires circuit + result) |
| `POST` | `/api/export/sbol` | SBOL-like XML |
| `POST` | `/api/kinetics` | Hill curve rates for given concentrations |

OpenAPI / **Swagger UI**: `http://localhost:8000/docs` when the backend is running.

---

## Configuration & troubleshooting

- **CORS** — Backend allows `http://localhost:5173` and `http://127.0.0.1:5173` by default. For another origin, set **`CORS_ALLOW_ORIGINS`** to a comma-separated list (see `backend/main.py`).
- **API base URL** — The frontend calls `http://localhost:8000/api` (`frontend/src/api/bioApi.js`). If you deploy or change ports, update **`BASE`** there to match.
- **Simulation errors** — Ensure the backend is up, the circuit has **no cycles**, and every gate type exists in `gate_library.py`. Validation errors return HTTP **400** with a message in the response body.

---

## Scope & limitations (read before demo / viva)

- **Combinational logic only** — Feedback loops are rejected; there is no sequential/stateful DNA model in the simulator.
- **Timing and “DNA” cost** — Per-gate reaction time and strand cost come from **fixed library metadata**, not from gate-parameter sliders or live kinetics.
- **Displayed DNA sequences** — A/T/G/C strings in the UI are **deterministic synthetic sequences** for visualization; they are not validated wet-lab designs.
- **CO4 / CO5** — PIO/Interrupt/DMA and GPU profiles are **pedagogical models** layered on the same graph metrics, not measurements of real hardware or instruments.

---

## Run

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the app at the URL shown by Vite (typically `http://localhost:5173`). Ensure the backend is running so **Canvas → Run simulation** and **Results** work.

Optional: set `CORS_ALLOW_ORIGINS` if the frontend is not on `localhost:5173` (see `backend/main.py`).
