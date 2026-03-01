from fastapi import FastAPI
from structure_builder import process_file

app = FastAPI()

@app.post("/analyze")
def analyze(data: dict):
    file_path = data["filePath"]
    result = process_file(file_path)
    return result
# from fastapi import FastAPI
# from pydantic import BaseModel
# from google import genai
# import base64
# import os
# import json
# import fitz
# import ezdxf

# import ssl
# import certifi

# ssl._create_default_https_context = ssl.create_default_context
# ssl._create_default_https_context(cafile=certifi.where())
# app = FastAPI()



# def parse_ai_output(text):
#     try:
#         text = text.replace("```json", "").replace("```", "").strip()
#         return json.loads(text)
#     except:
#         return {}

# class FileRequest(BaseModel):
#     filePath: str

# def get_mime_type(path):
#     ext = os.path.splitext(path)[1].lower()
#     if ext == ".png":
#         return "image/png"
#     elif ext in [".jpg", ".jpeg"]:
#         return "image/jpeg"
#     return "image/png"


# def image_to_base64(path):
#     with open(path, "rb") as img:
#         return base64.b64encode(img.read()).decode("utf-8")

# def analyze_pdf(file_path):
#     doc = fitz.open(file_path)
#     wall_lines = 0
#     for page in doc:
#         drawings = page.get_drawings()

#         for d in drawings:
#             if d["type"] == "l":   # line
#                 wall_lines += 1

#     floor_area = wall_lines * 20
#     wall_length = wall_lines * 3

#     rooms = max(2, wall_lines // 10)
#     bathrooms = max(1, rooms // 2)
#     doors = rooms * 2
#     windows = rooms * 2
#     columns = max(4, rooms)

#     concrete = floor_area * 0.15
#     steel = concrete * 0.12

#     return {
#         "walls": wall_lines,
#         "columns": columns,
#         "doors": doors,
#         "windows": windows,
#         "floorArea": floor_area,
#         "rooms": rooms,
#         "bathrooms": bathrooms,
#         "wallLength": wall_length,
#         "layoutType": "standard",
#         "structureComplexity": "medium",
#         "slabArea": floor_area,
#         "concrete": concrete,
#         "steel": steel
#     }

# def analyze_cad(file_path):

#     doc = ezdxf.readfile(file_path)
#     msp = doc.modelspace()

#     walls = 0
#     columns = 0
#     doors = 0
#     windows = 0

#     for e in msp:

#         t = e.dxftype()

#         if t in ["LINE", "LWPOLYLINE", "POLYLINE"]:
#             walls += 1

#         elif t == "CIRCLE":
#             columns += 1

#         elif t == "ARC":
#             doors += 1

#         elif t == "INSERT":
#             name = e.dxf.name.lower()

#             if "door" in name:
#                 doors += 1
#             elif "window" in name:
#                 windows += 1

#     floor_area = max(500, walls * 25)

#     wall_length = walls * 4
#     rooms = max(2, walls // 6)
#     bathrooms = max(1, rooms // 2)

#     concrete = floor_area * 0.15
#     steel = concrete * 0.12

#     return {
#         "walls": walls,
#         "columns": columns,
#         "doors": doors,
#         "windows": windows,
#         "floorArea": floor_area,
#         "rooms": rooms,
#         "bathrooms": bathrooms,
#         "wallLength": wall_length,
#         "layoutType": "standard",
#         "structureComplexity": "medium",
#         "slabArea": floor_area,
#         "concrete": concrete,
#         "steel": steel
#     }
# def detect_file_type(path):
#     ext = os.path.splitext(path)[1].lower()
    
#     if ext in [".jpg", ".jpeg", ".png"]:
#         return "image"
#     elif ext == ".pdf":
#         return "pdf"
#     elif ext in [".dxf", ".dwg"]:
#         return "cad"
#     return "unknown"


# @app.post("/analyze")
# def analyze(req: FileRequest):
#     file_type = detect_file_type(req.filePath)

#     if file_type == "image":
#         result = analyze_image_with_gemini(req.filePath)
#     elif file_type == "pdf":
#         result = analyze_pdf(req.filePath)

#     elif file_type == "cad":
#         result = analyze_cad(req.filePath)

#     else:
#         return {"error": "Unsupported file"}

#     result["fileType"] = file_type
#     return result
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

    return {
        "timeline": timeline,
        "totalWeeks": totalWeeks,
        "totalMonths": round(totalWeeks / 4, 1)
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
        "pdf": pdf,
        "excel": excel
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
