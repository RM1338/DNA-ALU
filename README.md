# DNA-ALU

Full-stack biological circuit simulator.

## Course Outcome Mapping

### CO1: Use relevant instruction cycle to efficiently manage processor functionality
- Implemented in simulation pipeline: **Fetch Circuit -> Decode Gate Map -> Execute Stage DAG -> Writeback Metrics**.
- Visible in UI under `Results -> Course Outcome Compliance` panel.
- Backend execution graph uses topological stage scheduling (`backend/simulator.py`).

### CO4: Use interfacing techniques for programmable peripheral devices
- Implemented with explicit **Input/Output node interfacing** on canvas.
- Added IO mode demonstrator (PIO / Interrupt / DMA) in `Course Outcome Compliance` panel.
- Truth table transfer and IO throughput index are shown for assessment.

### CO5: Evaluate GPU architectures for high-performance computing
- Added GPU architecture evaluator (SIMT / Tensor / Hybrid) in `Course Outcome Compliance` panel.
- Shows estimated speedup and effective simulation time for each architecture profile.

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
