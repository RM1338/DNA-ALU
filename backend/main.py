from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, Response
from pydantic import BaseModel
from typing import List
from models import CircuitPayload, SimulationResult
from simulator import simulate
from optimizer import optimize
from kinetics import hill_curve
from export_pdf import generate_pdf
from export_sbol import generate_sbol
from preset_data import RIPPLE_CARRY_ADDER, CARRY_LOOKAHEAD_ADDER
from io import BytesIO
app=FastAPI()
app.add_middleware(CORSMiddleware,allow_origins=['*'],allow_methods=['*'],allow_headers=['*'])
class OptimizeReq(BaseModel): circuit: CircuitPayload; objective: str
class ExportPdfReq(BaseModel): circuit: CircuitPayload; result: SimulationResult; circuitName: str
class ExportSbolReq(BaseModel): circuit: CircuitPayload; result: SimulationResult
class KReq(BaseModel): concentrations: List[float]; K: float=50; n: float=2
@app.post('/api/simulate', response_model=SimulationResult)
def sim(payload: CircuitPayload): return simulate(payload)
@app.post('/api/optimize')
def opt(req: OptimizeReq): return optimize(req.circuit, req.objective)
@app.get('/api/presets')
def presets(): return {'rippleCarry':RIPPLE_CARRY_ADDER,'carryLookahead':CARRY_LOOKAHEAD_ADDER}
@app.post('/api/export/pdf')
def exp_pdf(req: ExportPdfReq): data=generate_pdf(req.circuit, req.result, req.circuitName); return StreamingResponse(BytesIO(data),media_type='application/pdf',headers={'Content-Disposition':f'attachment; filename="{req.circuitName}.pdf"'})
@app.post('/api/export/sbol')
def exp_sbol(req: ExportSbolReq): xml=generate_sbol(req.circuit, req.result); return Response(content=xml,media_type='application/xml',headers={'Content-Disposition':'attachment; filename="circuit.sbol.xml"'})
@app.post('/api/kinetics')
def kin(req: KReq): return {'rates': hill_curve(req.concentrations, req.K, req.n)}
