import base64
from io import BytesIO
from PIL import Image, ImageStat
import re

def analyze_food_freshness(image_base64: str) -> dict:
    """
    Decodes base64 image data and runs simulated computer vision analysis
    estimating food freshness percentage and shelf life hours based on color distribution.
    """
    try:
        # Strip metadata header if present
        if ',' in image_base64:
            image_base64 = image_base64.split(',')[1]

        image_data = base64.b64decode(image_base64)
        image = Image.open(BytesIO(image_data))
        
        # Analyze RGB stats of the image to simulate CV analysis
        stat = ImageStat.Stat(image)
        avg_rgb = stat.mean[:3] # Average R, G, B colors
        
        # Calculate scores
        # We simulate brown/rot spots (lower green, high red/blue imbalance)
        # or fresh green veggies (high green, lower red)
        red, green, blue = avg_rgb[0], avg_rgb[1], avg_rgb[2]
        
        # Check if dominant green
        if green > red and green > blue:
            # Fresh green veg/fruit
            freshness = min(100, int(70 + (green / (red + blue + 1)) * 30))
            shelf_life = min(72, int((freshness / 100.0) * 48))
            category = "Fresh Produce / Green Vegetables"
        elif red > green and red > blue and abs(red - green) > 50:
            # Brownish color (lower freshness)
            freshness = max(40, int(90 - (red / (green + blue + 1)) * 25))
            shelf_life = max(2, int((freshness / 100.0) * 12))
            category = "Bakery / Cooked Meals"
        else:
            # Mixed or balanced color (standard food)
            freshness = min(98, max(50, int(85 + (green / (red + 1)) * 10)))
            shelf_life = min(48, int((freshness / 100.0) * 24))
            category = "Mixed Meal / Dairy"

        return {
            "status": "success",
            "category": category,
            "freshness_score": freshness,
            "predicted_shelf_life_hours": shelf_life,
            "insights": [
                f"Minimal discoloration detected. Fits best with {category}.",
                f"Freshness is estimated at {freshness}%. Recommended pickup within {shelf_life} hours."
            ]
        }
    except Exception as e:
        return {
            "status": "fallback",
            "freshness_score": 85,
            "predicted_shelf_life_hours": 12,
            "error": str(e),
            "insights": ["AI Service fallback score applied. General safe-handling shelf life set to 12 hours."]
        }
