import os
from dxf_parser import dxf_to_json
from pdf_parser import pdf_to_json
from image_parser import image_to_json

def extract_plan(file_path):

    ext = os.path.splitext(file_path)[1].lower()

    if ext == ".dxf":
        return dxf_to_json(file_path)

    elif ext == ".pdf":
        return pdf_to_json(file_path)

    else:
        return image_to_json(file_path)