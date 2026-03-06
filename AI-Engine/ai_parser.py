from google import genai
client = genai.Client(api_key="")

def analyze_plan_json(plan_json):
    prompt = f"""
        You are a civil engineer and architectural drawing analyst.

        Analyze this floor plan image and extract structural information useful for construction cost estimation.

        Understand the layout, symbols, walls, openings and functional spaces.

        Analyze this floor plan data:
         :{plan_json}
        Extract: 

        - floorArea (approx in sq ft)
        - rooms (number of bedrooms + living rooms)
        - bathrooms
        - wallLength (approx total running wall length in feet)
        - doors (count)
        - windows (count)
        - layoutType (simple / compact / luxury)
        - structureComplexity (low / medium / high)

        Guidelines:

        • Detect enclosed spaces as rooms  
        • Detect small tiled areas as bathrooms  
        • Walls form room boundaries  
        • Doors are openings in walls  
        • Windows are wall openings  
        • Estimate wall length based on layout scale  
        • Estimate floor area based on structure size  

        layoutType:

        simple → small / minimal layout  
        compact → normal residential  
        luxury → spacious / multiple sections  

        structureComplexity:

        low → simple rectangle layout  
        medium → moderate partitioning  
        high → complex geometry / many sections  

        If something is unclear, make a reasonable estimate.

        Return format:

        {{
        "floorArea": number,
        "rooms": number,
        "bathrooms": number,
        "wallLength": number,
        "doors": number,
        "windows": number,
        "layoutType": "simple | compact | luxury",
        "structureComplexity": "low | medium | high"
        }}
        Every time give the accurate result and every parameter have the value based on this. 
        No one have the null or no value.
        """
    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=prompt
    )
    try:
        data = json.loads(response.text)
    except:
        data = {}
    

    floor_area = data.get("floorArea", 1000)
    wall_length = data.get("wallLength", 150)
    rooms = data.get("rooms", 3)
    bathrooms = data.get("bathrooms", 2)
    doors = data.get("doors", 6)
    windows = data.get("windows", 8)

    walls = wall_length // 4
    columns = max(4, rooms)

    concrete = floor_area * 0.15
    steel = concrete * 0.12

    return {
        "walls": walls,
        "columns": columns,
        "doors": doors,
        "windows": windows,
        "floorArea": floor_area,
        "rooms": rooms,
        "bathrooms": bathrooms,
        "wallLength": wall_length,
        "layoutType": data.get("layoutType", "compact"),
        "structureComplexity": data.get("structureComplexity", "medium"),
        "slabArea": floor_area,
        "concrete": concrete,
        "steel": steel
    }
