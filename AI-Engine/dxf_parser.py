import ezdxf
import math

def length(line):
    start = line.dxf.start
    end = line.dxf.end
    return math.dist(start, end)

def dxf_to_json(file_path):
    doc = ezdxf.readfile(file_path)
    msp = doc.modelspace()

    wall_length = 0
    rooms = 0
    doors = 0
    windows = 0

    for e in msp:

        if e.dxftype() == "LINE":
            wall_length += length(e)

        elif e.dxftype() == "LWPOLYLINE":
            points = e.get_points()
            if len(points) > 4:
                rooms += 1

        elif e.dxftype() == "ARC":
            doors += 1

        elif e.dxftype() == "CIRCLE":
            windows += 1

    floor_area = wall_length * 0.6

    return {
        "wallLength": round(wall_length),
        "rooms": rooms,
        "doors": doors,
        "windows": windows,
        "floorArea": round(floor_area)
    }