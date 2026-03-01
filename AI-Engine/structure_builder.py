# import math
# import re

# def line_length(line):
#     x1,y1 = line["start"]
#     x2,y2 = line["end"]
#     return math.hypot(x2-x1, y2-y1)

# def are_parallel(l1, l2, tolerance=5):

#     dx1 = l1["end"][0] - l1["start"][0]
#     dy1 = l1["end"][1] - l1["start"][1]

#     dx2 = l2["end"][0] - l2["start"][0]
#     dy2 = l2["end"][1] - l2["start"][1]

#     angle1 = math.degrees(math.atan2(dy1, dx1))
#     angle2 = math.degrees(math.atan2(dy2, dx2))

#     return abs(angle1 - angle2) < tolerance


# def extract_dimensions(texts):

#     dim_pattern = r'\d+(\.\d+)?\s?(mm|cm|m|ft|")?'
#     dimensions = []

#     for t in texts:
#         if re.match(dim_pattern, t["text"]):
#             dimensions.append(t)

#     return dimensions


# def build_structure(data):

#     lines = data["lines"]
#     texts = data["texts"]

#     walls = []
#     beams = []

#     # ---- WALL DETECTION (Parallel Lines)
#     for i in range(len(lines)):
#         for j in range(i+1, len(lines)):

#             if are_parallel(lines[i], lines[j]):

#                 length = line_length(lines[i])

#                 if length > 80:
#                     walls.append({
#                         "line1": lines[i],
#                         "line2": lines[j],
#                         "length": length
#                     })

#                 elif length > 150:
#                     beams.append({
#                         "line": lines[i],
#                         "length": length
#                     })

#     dimensions = extract_dimensions(texts)

#     return {
#         "walls": walls,
#         "beams": beams,
#         "columns": [],   # can add later
#         "dimensions": dimensions
#     }

from extractor import extract_plan
from ai_parser import analyze_plan_json
from timeline_engine import generate_timeline
def process_file(file_path):
    plan_json = extract_plan(file_path)
    analysis = analyze_plan_json(plan_json)
    timeline = generate_timeline(analysis)

    return {
        "analysis": analysis,
        "timeline": timeline
    }