from fastapi import FastAPI
from structure_builder import process_file
from fastapi.staticfiles import StaticFiles

app = FastAPI()

@app.post("/analyze")
def analyze(data: dict):
    file_path = data["filePath"]
    result = process_file(file_path)
    return result

app.mount("/files", StaticFiles(directory="reports"), name="files")

@app.post("/quality")
def quality(data: dict):

    floor = data.get("floorArea", 1000)
    layout = data.get("layoutType", "compact")
    complexity = data.get("structureComplexity", "medium")

    # ---------------------------
    # STEP 1: BASE SCORE
    # ---------------------------

    score = 1.0

    # floor area impact
    if floor > 2000:
        score += 0.2
    elif floor < 800:
        score -= 0.1

    # layout impact
    if layout == "luxury":
        score += 0.3
    elif layout == "simple":
        score -= 0.1

    # complexity impact
    if complexity == "high":
        score += 0.25
    elif complexity == "low":
        score -= 0.1

    # ---------------------------
    # STEP 2: CATEGORY FACTORS
    # ---------------------------

    structure = 1.0 + score * 0.2
    masonry = 1.0 + score * 0.15
    flooring = 1.0 + score * 0.25
    plumbing = 1.0 + score * 0.2
    electrical = 1.0 + score * 0.2
    finishing = 1.0 + score * 0.25
    fixtures = 1.0 + score * 0.2
    labour = 1.0 + score * 0.15

    # ---------------------------
    # STEP 3: RETURN LEVELS
    # ---------------------------

    return {
        "budget": {
            "structure": structure * 0.85,
            "masonry": masonry * 0.85,
            "flooring": flooring * 0.8,
            "plumbing": plumbing * 0.85,
            "electrical": electrical * 0.85,
            "finishing": finishing * 0.8,
            "fixtures": fixtures * 0.85,
            "labour": labour * 0.9
        },
        "standard": {
            "structure": structure,
            "masonry": masonry,
            "flooring": flooring,
            "plumbing": plumbing,
            "electrical": electrical,
            "finishing": finishing,
            "fixtures": fixtures,
            "labour": labour
        },
        "premium": {
            "structure": structure * 1.3,
            "masonry": masonry * 1.2,
            "flooring": flooring * 1.5,
            "plumbing": plumbing * 1.4,
            "electrical": electrical * 1.3,
            "finishing": finishing * 1.5,
            "fixtures": fixtures * 1.4,
            "labour": labour * 1.3
        }
    }
@app.post("/timeline")
def timeline(data: dict):

    area = data.get("floorArea", 1000)
    rooms = data.get("rooms", 2)
    bathrooms = data.get("bathrooms", 1)
    wall_length = data.get("wallLength", 100)
    complexity = data.get("structureComplexity", "medium")

    sizeFactor = area / 1000

    complexityFactor = {
        "low": 1.0,
        "medium": 1.2,
        "high": 1.4
    }.get(complexity, 1.2)

    # ---- REALISTIC DURATIONS (in weeks) ----

    site = int(2 * sizeFactor)

    foundation = int(4 * sizeFactor * complexityFactor)
    curing_foundation = 2

    structure = int(6 * sizeFactor * complexityFactor)
    curing_slab = 2

    masonry = int(4 * sizeFactor * complexityFactor)
    curing_wall = 1

    plumbing = int(2 * bathrooms * complexityFactor)
    electrical = int(2 * rooms * complexityFactor)

    plaster = int(3 * sizeFactor)
    curing_plaster = 1

    flooring = int(3 * sizeFactor)

    wall_height = 10
    paint_area = wall_length * wall_height
    painting = int((paint_area / 600) * complexityFactor)

    fixtures = int(2 * sizeFactor)
    finishing = int(2 * sizeFactor)

    # ---- CIVIL FLOW ----

    timeline = [
        {"phase": "Site Preparation", "startWeek": 1, "duration": site},

        {"phase": "Foundation Work", "startWeek": 3, "duration": foundation},
        {"phase": "Foundation Curing", "startWeek": 3 + foundation, "duration": curing_foundation},

        {"phase": "Structure Work", "startWeek": 6 + foundation, "duration": structure},
        {"phase": "Slab Curing", "startWeek": 6 + foundation + structure, "duration": curing_slab},

        {"phase": "Masonry Work", "startWeek": 10 + foundation + structure, "duration": masonry},
        {"phase": "Wall Curing", "startWeek": 10 + foundation + structure + masonry, "duration": curing_wall},

        {"phase": "Plumbing Rough", "startWeek": 12 + foundation + structure + masonry, "duration": plumbing},
        {"phase": "Electrical Rough", "startWeek": 12 + foundation + structure + masonry, "duration": electrical},

        {"phase": "Plastering", "startWeek": 14 + foundation + structure + masonry, "duration": plaster},
        {"phase": "Plaster Curing", "startWeek": 14 + foundation + structure + masonry + plaster, "duration": curing_plaster},

        {"phase": "Flooring / Tiling", "startWeek": 17 + foundation + structure + masonry, "duration": flooring},

        {"phase": "Painting", "startWeek": 19 + foundation + structure + masonry, "duration": painting},

        {"phase": "Fixtures Installation", "startWeek": 21 + foundation + structure + masonry, "duration": fixtures},

        {"phase": "Final Finishing", "startWeek": 23 + foundation + structure + masonry, "duration": finishing}
    ]

    totalWeeks = max([p["startWeek"] + p["duration"] for p in timeline])

    phases = []

    for p in timeline:
        phases.append({
            "phase": p["phase"],
            "durationDays": int(p["duration"] * 7)
        })

    return {
        "phases": phases,
        "totalDuration": sum(p["durationDays"] for p in phases)
    }
from pipeline_engine import generate_pipeline

@app.post("/pipeline")
def pipeline(data: dict):
    return generate_pipeline(data["analysis"])

from report_engine import generate_pdf, generate_excel

@app.post("/report")
def report(data: dict):

    pdf = generate_pdf(data)
    excel = generate_excel(data)

    return {
        "pdf": f"/files/{pdf.split('/')[-1]}",
        "excel": f"/files/{excel.split('/')[-1]}"
    }
# # import os
# # from structure_builder import build_structure
# # from image_processor import process_image
# # from pdf_processor import process_pdf
# # from dxf_processor import process_dxf

# # def normalize_drawing(file_path):
# #     ext = os.path.splitext(file_path)[1].lower()

# #     if ext in [".png", ".jpg", ".jpeg"]:
# #         return process_image(file_path)

# #     elif ext == ".pdf":
# #         return process_pdf(file_path)

# #     elif ext == ".dxf":
# #         return process_dxf(file_path)

# #     else:
# #         raise ValueError("Unsupported file format")
