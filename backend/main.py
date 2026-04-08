import logging
import os
from io import BytesIO
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, StreamingResponse
from pydantic import BaseModel

from export_pdf import generate_pdf
from export_sbol import generate_sbol
from kinetics import hill_curve
from models import CircuitPayload, SimulationResult
from optimizer import optimize
from preset_data import CARRY_LOOKAHEAD_ADDER, RIPPLE_CARRY_ADDER
from simulator import simulate

logger = logging.getLogger("bioalu.api")
logging.basicConfig(level=logging.INFO)

DEFAULT_CORS_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]


def _cors_origins():
    raw = os.getenv("CORS_ALLOW_ORIGINS", "")
    if not raw.strip():
        return DEFAULT_CORS_ORIGINS
    parsed = [origin.strip() for origin in raw.split(",") if origin.strip()]
    return parsed or DEFAULT_CORS_ORIGINS


app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=_cors_origins(), allow_methods=["*"], allow_headers=["*"])


class OptimizeReq(BaseModel):
    circuit: CircuitPayload
    objective: str


class ExportPdfReq(BaseModel):
    circuit: CircuitPayload
    result: SimulationResult
    circuitName: str


class ExportSbolReq(BaseModel):
    circuit: CircuitPayload
    result: SimulationResult


class KReq(BaseModel):
    concentrations: List[float]
    K: float = 50
    n: float = 2


@app.post("/api/simulate", response_model=SimulationResult)
def sim(payload: CircuitPayload):
    try:
        return simulate(payload)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=f"Simulation input invalid: {exc}")
    except Exception as exc:
        logger.exception("Simulation failed")
        raise HTTPException(status_code=500, detail=f"Simulation failed: {exc}")


@app.post("/api/optimize")
def opt(req: OptimizeReq):
    try:
        return optimize(req.circuit, req.objective)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=f"Optimization input invalid: {exc}")
    except Exception as exc:
        logger.exception("Optimization failed")
        raise HTTPException(status_code=500, detail=f"Optimization failed: {exc}")


@app.get("/api/presets")
def presets():
    try:
        return {"rippleCarry": RIPPLE_CARRY_ADDER, "carryLookahead": CARRY_LOOKAHEAD_ADDER}
    except Exception as exc:
        logger.exception("Preset load failed")
        raise HTTPException(status_code=500, detail=f"Preset load failed: {exc}")


@app.post("/api/export/pdf")
def exp_pdf(req: ExportPdfReq):
    try:
        data = generate_pdf(req.circuit, req.result, req.circuitName)
        return StreamingResponse(
            BytesIO(data),
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{req.circuitName}.pdf"'},
        )
    except Exception as exc:
        logger.exception("PDF export failed")
        raise HTTPException(status_code=500, detail=f"PDF export failed: {exc}")


@app.post("/api/export/sbol")
def exp_sbol(req: ExportSbolReq):
    try:
        xml = generate_sbol(req.circuit, req.result)
        return Response(
            content=xml,
            media_type="application/xml",
            headers={"Content-Disposition": 'attachment; filename="circuit.sbol.xml"'},
        )
    except Exception as exc:
        logger.exception("SBOL export failed")
        raise HTTPException(status_code=500, detail=f"SBOL export failed: {exc}")


@app.post("/api/kinetics")
def kin(req: KReq):
    try:
        return {"rates": hill_curve(req.concentrations, req.K, req.n)}
    except Exception as exc:
        logger.exception("Kinetics calculation failed")
        raise HTTPException(status_code=500, detail=f"Kinetics calculation failed: {exc}")
