import ezdxf

def pdf_to_json(file_path):
    doc = fitz.open(file_path)

    lines = 0

    for page in doc:
        drawings = page.get_drawings()
        lines += len(drawings)

    return {
        "wallLength": lines * 2,
        "rooms": lines // 15,
        "doors": lines // 25,
        "windows": lines // 35
    }