# DNA-ALU

Full-stack biological circuit simulator.

## Course Outcome Mapping (implemented in code)

### CO1: Use relevant instruction cycle to efficiently manage processor functionality
- **Implementation:** `backend/course_outcomes.py` builds a **fetch → decode → execute → writeback** report from the real graph, library decode, staged DAG, and aggregated metrics. Returned on every `/api/simulate` response as `courseOutcomes.co1`.
- **UI:** Results page **Course outcome compliance** section; simulation overlay messages reference the same pipeline.

### CO4: Use interfacing techniques for programmable peripheral devices
- **Implementation:** Canvas **PIO / Interrupt / DMA** control (stored in `frontend/src/store/circuitStore.js`, sent as `ioInterfaceMode` on simulate). Backend **CO4** metrics (throughput index, latency factor, adjusted schedule) are computed from truth-table size and port counts in `course_outcomes.py`.

### CO5: Evaluate GPU architectures for high-performance computing
- **Implementation:** `course_outcomes.py` compares **serial work** (sum of per-gate reaction times) to **critical-path** time and emits **SIMT / Tensor / Hybrid** profiles with speedups and effective schedule minutes in `courseOutcomes.co5`.

PDF exports include a short CO summary when `courseOutcomes` is present (`backend/export_pdf.py`).

## Run

### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
