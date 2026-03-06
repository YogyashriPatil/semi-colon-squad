import pandas as pd
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table
from reportlab.lib import colors


def generate_excel(data, path="reports/report.xlsx"):

    writer = pd.ExcelWriter(path, engine='openpyxl')

    # ---------- Analysis ----------
    pd.DataFrame([data.get("analysis", {})]).to_excel(
        writer, sheet_name="Analysis", index=False
    )

    # ---------- Estimation ----------
    est = []
    estimation = data.get("estimation", {})

    for level in estimation:
        for cat in estimation[level]:
            est.append({
                "Type": level,
                "Category": cat,
                "Low": estimation[level][cat].get("low", 0),
                "High": estimation[level][cat].get("high", 0)
            })

    pd.DataFrame(est).to_excel(writer, sheet_name="Estimation", index=False)

    # ---------- Timeline ----------
    pd.DataFrame(data.get("timeline", [])).to_excel(
        writer, sheet_name="Timeline", index=False
    )

    # ---------- Pipeline ----------
    pd.DataFrame(data.get("pipeline", [])).to_excel(
        writer, sheet_name="Pipeline", index=False
    )

    writer.close()
    return path


# =========================
# PDF GENERATOR
# =========================

def generate_pdf(data, path="reports/report.pdf"):

    doc = SimpleDocTemplate(path, pagesize=A4)
    styles = getSampleStyleSheet()
    elements = []

    elements.append(Paragraph("<b>PROJECT CONSTRUCTION REPORT</b>", styles['Title']))
    elements.append(Spacer(1, 20))

    # ---------- Analysis ----------
    elements.append(Paragraph("<b>AI Structural Analysis</b>", styles['Heading2']))
    analysis = data.get("analysis", {})

    analysis_table = [[k, str(v)] for k, v in analysis.items()]
    if analysis_table:
        elements.append(Table(analysis_table, style=[
            ('GRID', (0,0), (-1,-1), 1, colors.black)
        ]))
    elements.append(Spacer(1, 20))

    # ---------- Estimation ----------
    elements.append(Paragraph("<b>Cost Estimation</b>", styles['Heading2']))
    est_rows = []
    estimation = data.get("estimation", {})

    for level in estimation:
        for cat in estimation[level]:
            low = round(estimation[level][cat].get("low", 0))
            high = round(estimation[level][cat].get("high", 0))
            est_rows.append([level, cat, low, high])

    if est_rows:
        elements.append(Table(est_rows, style=[
            ('GRID', (0,0), (-1,-1), 1, colors.black)
        ]))
    elements.append(Spacer(1, 20))

    # ---------- Timeline ----------
    elements.append(Paragraph("<b>Construction Timeline</b>", styles['Heading2']))
    timeline_rows = []

    for p in data.get("timeline", []):
        timeline_rows.append([
            p.get("phase", ""),
            p.get("durationDays", "")
        ])

    if timeline_rows:
        elements.append(Table(timeline_rows, style=[
            ('GRID', (0,0), (-1,-1), 1, colors.black)
        ]))
    elements.append(Spacer(1, 20))

    # ---------- Pipeline ----------
    elements.append(Paragraph("<b>Execution Pipeline</b>", styles['Heading2']))
    pipe_rows = []

    for s in data.get("pipeline", []):
        pipe_rows.append([
            s.get("order", ""),
            s.get("stage", ""),
            s.get("status", "")
        ])

    if pipe_rows:
        elements.append(Table(pipe_rows, style=[
            ('GRID', (0,0), (-1,-1), 1, colors.black)
        ]))

    doc.build(elements)
    return path