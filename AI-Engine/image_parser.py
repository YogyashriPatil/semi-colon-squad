import cv2

def image_to_json(file_path):

    img = cv2.imread(file_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    edges = cv2.Canny(gray, 50, 150)

    lines = cv2.HoughLinesP(edges, 1, 3.14/180, 100)

    wall_length = len(lines) if lines is not None else 0

    return {
        "wallLength": wall_length * 3,
        "rooms": wall_length // 20,
        "doors": wall_length // 30,
        "windows": wall_length // 40
    }