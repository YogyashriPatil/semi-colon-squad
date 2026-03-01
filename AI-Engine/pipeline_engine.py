def generate_pipeline(analysis):

    complexity = analysis.get("structureComplexity", "medium")

    factor = {
        "low": 1,
        "medium": 1.2,
        "high": 1.5
    }.get(complexity, 1)

    stages = [
        ("Site Survey & Layout", 1),
        ("Excavation", 2),
        ("Foundation", 3),
        ("Plinth", 2),
        ("Columns", 3),
        ("Beam & Slab", 4),
        ("Brickwork", 3),
        ("Plumbing Rough", 2),
        ("Electrical Rough", 2),
        ("Flooring", 3),
        ("Doors & Windows", 2),
        ("Interior Finish", 3),
        ("Painting", 2),
        ("Final Inspection", 1),
        ("Handover", 1)
    ]

    pipeline = []

    order = 1
    for name, weight in stages:
        pipeline.append({
            "order": order,
            "stage": name,
            "effort": int(weight * factor),
            "status": "Pending"
        })
        order += 1

    return {
        "pipeline": pipeline
    }