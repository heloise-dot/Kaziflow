from google import genai
from google.genai import types
import os
import json

api_key = os.environ.get("GOOGLE_API_KEY")

async def analyze_vendor_risk(vendor_data: dict) -> dict:
    if not api_key:
        # Initial Mock for when API Key is missing during dev
        return {
            "score": 85,
            "level": "Low",
            "reasoning": "Mock analysis: API Key not set.",
            "factors": [{"label": "Mock Factor", "impact": 0.8}]
        }

    client = genai.Client(api_key=api_key)
    
    prompt = f"""
    Analyze the following vendor supply chain data and provide a fintech risk score (0-100).
    A higher score means LOWER risk (safer).
    
    Data: {json.dumps(vendor_data)}
    
    Consider:
    - Transaction frequency
    - Payment delay history
    - Delivery consistency
    - FIFO (First-In-First-Out) transaction flow health
    
    Return a valid JSON object with:
    - score (number)
    - level (string: Low, Medium, High)
    - reasoning (string)
    - factors (list of objects with label and impact)
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": {
                    "type": "OBJECT",
                    "properties": {
                        "score": {"type": "NUMBER"},
                        "level": {"type": "STRING"},
                        "reasoning": {"type": "STRING"},
                        "factors": {
                            "type": "ARRAY",
                            "items": {
                                "type": "OBJECT",
                                "properties": {
                                    "label": {"type": "STRING"},
                                    "impact": {"type": "NUMBER"}
                                }
                            }
                        }
                    }
                }
            }
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"AI Error: {e}")
        return {
            "score": 50,
            "level": "Medium",
            "reasoning": "AI Analysis Failed, using fallback.",
            "factors": []
        }
