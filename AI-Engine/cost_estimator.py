def estimate_cost(data):

    area = data.get("floorArea", 1000)
    complexity = data.get("structureComplexity", "medium")

    factor = {
        "low": 0.9,
        "medium": 1.0,
        "high": 1.2
    }.get(complexity, 1)

    BASIC = 1400 * factor
    STANDARD = 1900 * factor
    PREMIUM = 2600 * factor

    def breakdown(rate):
        total = area * rate

        return {
            "totalCost": round(total),
            "civil": round(total * 0.45),
            "finishing": round(total * 0.25),
            "plumbing": round(total * 0.10),
            "electrical": round(total * 0.10),
            "flooring": round(total * 0.05),
            "contingency": round(total * 0.05)
        }

    return {
        "basic": breakdown(BASIC),
        "standard": breakdown(STANDARD),
        "premium": breakdown(PREMIUM)
    }