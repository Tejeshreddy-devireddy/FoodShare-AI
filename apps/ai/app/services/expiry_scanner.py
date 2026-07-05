import base64
from io import BytesIO
from PIL import Image
import re
from datetime import datetime, timedelta

def scan_expiry_date(image_base64: str) -> dict:
    """
    Decodes base64 package label image, simulates OCR text extraction,
    and returns detected expiry dates.
    """
    try:
        # Strip metadata header if present
        if ',' in image_base64:
            image_base64 = image_base64.split(',')[1]

        image_data = base64.b64decode(image_base64)
        image = Image.open(BytesIO(image_data))
        
        # Simulating OCR output based on packaging text characteristics
        # In a real environment, you would use pytesseract.image_to_string(image)
        # Here we mock regex-based matching of dates in the simulated text
        detected_text = "BEST BEFORE / EXPIRY: 28/06/2026 LOT#B94032"
        
        # Regex to locate dates
        date_patterns = [
            r'\b(\d{2})[-/](\d{2})[-/](\d{4})\b', # DD/MM/YYYY
            r'\b(\d{4})[-/](\d{2})[-/](\d{2})\b', # YYYY-MM-DD
        ]
        
        found_date = None
        for pattern in date_patterns:
            match = re.search(pattern, detected_text)
            if match:
                # Mock date formatting
                found_date = "2026-06-28T23:59:59Z"
                break
                
        if not found_date:
            # Fallback to tomorrow
            found_date = (datetime.utcnow() + timedelta(days=1)).strftime("%Y-%m-%dT%H:%M:%SZ")

        return {
            "status": "success",
            "ocr_text_extracted": detected_text,
            "detected_expiry_date": found_date,
            "confidence": 0.94
        }
    except Exception as e:
        return {
            "status": "fallback",
            "detected_expiry_date": (datetime.utcnow() + timedelta(days=1)).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "error": str(e),
            "confidence": 0.50
        }
