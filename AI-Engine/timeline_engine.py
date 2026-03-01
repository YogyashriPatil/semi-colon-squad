def generate_timeline(data):

    area = data.get("floorArea", 1000)
    complexity = data.get("structureComplexity", "medium")

    factor = {
        "low": 0.8,
        "medium": 1,
        "high": 1.3
    }.get(complexity, 1)

    base_days = area / 100

    timeline = [
        ("Site Preparation", 3),
        ("Foundation Work", 6),
        ("Plinth Beam", 4),
        ("Column & Structure", 15),
        ("Wall Construction", 10),
        ("Roof Slab", 7),
        ("Plumbing Rough", 5),
        ("Electrical Rough", 5),
        ("Flooring", 8),
        ("Doors & Windows", 6),
        ("Interior Finishing", 10),
        ("Painting", 5)
    ]

    phases = []

    total = 0

    for name, base in timeline:
        duration = int(base * factor + base_days)
        total += duration

        phases.append({
            "phase": name,
            "durationDays": duration
        })

    return {
        "phases": phases,
        "totalDuration": total
    }