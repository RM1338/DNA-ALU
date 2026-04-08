from io import BytesIO
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle


def generate_pdf(circuit, result, circuitName):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, title=f"DNA-ALU Report: {circuitName}")
    styles = getSampleStyleSheet()
    elements = []

    elements.append(Paragraph(f"DNA-ALU Lab Report: <b>{circuitName}</b>", styles["Title"]))
    elements.append(Spacer(1, 8))
    elements.append(Paragraph(
        f"Critical Path: <b>{result.criticalPathMinutes} min</b> &nbsp;&nbsp; "
        f"Total Strand Types: <b>{result.totalStrandTypes}</b> &nbsp;&nbsp; "
        f"Stages: <b>{result.stageCount}</b>",
        styles["BodyText"],
    ))
    elements.append(Spacer(1, 16))

    summary = [["Project", circuit.projectName], ["Inputs", ", ".join(circuit.inputs)], ["Outputs", ", ".join(circuit.outputs)], ["Gates", str(len(circuit.gates))], ["Wires", str(len(circuit.wires))]]
    t1 = Table(summary, colWidths=[140, 360])
    t1.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#efefef")),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
    ]))
    elements.append(t1)
    elements.append(Spacer(1, 16))

    rows = [["Gate", "Mechanism", "Strands", "Time(min)", "Enzyme", "Stage"]]
    for r in result.strandCostTable:
        rows.append([r.gateType, r.bioMechanism, str(r.strandCost), str(r.reactionTimeMin), r.enzyme, str(r.stageIndex)])

    t2 = Table(rows, colWidths=[55, 190, 55, 65, 120, 45])
    t2.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#d9f7e8")),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.grey),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
    ]))
    elements.append(Paragraph("Strand Cost Table", styles["Heading2"]))
    elements.append(t2)

    elements.append(Spacer(1, 16))
    elements.append(Paragraph("Reaction Timeline", styles["Heading2"]))
    for st in result.stages:
        elements.append(Paragraph(
            f"Stage {st.stageIndex}: start {st.startMinute} min, duration {st.durationMinutes} min, dominant {st.dominantGateType}",
            styles["BodyText"],
        ))

    doc.build(elements)
    return buffer.getvalue()
