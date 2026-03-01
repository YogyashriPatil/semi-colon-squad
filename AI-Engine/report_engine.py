import pandas as pd
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

def generate_excel(data, path="report.xlsx"):

    writer = pd.ExcelWriter(path, engine='openpyxl')

    pd.DataFrame(data["analysis"], index=[0]).to_excel(writer, sheet_name="Analysis")

    est = []
    for level in data["estimation"]:
        for cat in data["estimation"][level]:
            est.append({
                "Type": level,
                "Category": cat,
                "Low": data["estimation"][level][cat]["low"],
                "High": data["estimation"][level][cat]["high"]
            })

    pd.DataFrame(est).to_excel(writer, sheet_name="Estimation")

    pd.DataFrame(data["timeline"]).to_excel(writer, sheet_name="Timeline")

    pd.DataFrame(data["pipeline"]).to_excel(writer, sheet_name="Pipeline")

    writer.close()

    return path
    
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table
from reportlab.lib import colors


def generate_pdf(data, path="report.pdf"):

    doc = SimpleDocTemplate(path, pagesize=A4)
    styles = getSampleStyleSheet()
    elements = []

    elements.append(Paragraph("<b>PROJECT CONSTRUCTION REPORT</b>", styles['Title']))
    elements.append(Spacer(1,20))

    # AI Analysis
    elements.append(Paragraph("<b>AI Structural Analysis</b>", styles['Heading2']))
    analysis_table = [[k, str(v)] for k,v in data["analysis"].items()]
    elements.append(Table(analysis_table, style=[
        ('GRID', (0,0), (-1,-1), 1, colors.black)
    ]))
    elements.append(Spacer(1,20))

    # Estimation
    elements.append(Paragraph("<b>Cost Estimation</b>", styles['Heading2']))
    est_rows = []
    for level in data["estimation"]:
        for cat in data["estimation"][level]:
            low = round(data["estimation"][level][cat]["low"])
            high = round(data["estimation"][level][cat]["high"])
            est_rows.append([level, cat, low, high])

    elements.append(Table(est_rows, style=[
        ('GRID', (0,0), (-1,-1), 1, colors.black)
    ]))
    elements.append(Spacer(1,20))

    # Timeline
    elements.append(Paragraph("<b>Construction Timeline</b>", styles['Heading2']))
    timeline_rows = [[p["phase"], p["durationDays"]] for p in data["timeline"]]
    elements.append(Table(timeline_rows, style=[
        ('GRID', (0,0), (-1,-1), 1, colors.black)
    ]))
    elements.append(Spacer(1,20))

    # Pipeline
    elements.append(Paragraph("<b>Execution Pipeline</b>", styles['Heading2']))
    pipe_rows = [[s["order"], s["stage"], s["status"]] for s in data["pipeline"]]
    elements.append(Table(pipe_rows, style=[
        ('GRID', (0,0), (-1,-1), 1, colors.black)
    ]))

    doc.build(elements)
    return path