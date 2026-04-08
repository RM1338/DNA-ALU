from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

def generate_pdf(circuit, result, circuitName):
    b=BytesIO(); c=canvas.Canvas(b,pagesize=letter)
    c.drawString(72,760,f"DNA-ALU Report: {circuitName}"); c.drawString(72,740,f"Total Time: {result.criticalPathMinutes} min"); c.showPage()
    y=760
    for r in result.strandCostTable:
        c.drawString(72,y,f"{r.gateId} {r.gateType} {r.strandCost} strands {r.reactionTimeMin} min"); y-=14
        if y<72: c.showPage(); y=760
    c.showPage(); c.drawString(72,760,"Reaction Timeline")
    c.showPage(); c.drawString(72,760,"Gate Descriptions")
    c.save(); return b.getvalue()
