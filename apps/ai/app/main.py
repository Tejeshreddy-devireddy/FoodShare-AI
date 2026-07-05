from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os

from app.services.freshness import analyze_food_freshness
from app.services.expiry_scanner import scan_expiry_date
from app.services.matching import find_best_ngo_matches
from app.services.optimizer import optimize_delivery_route

app = FastAPI(title="FoodShare AI - Intelligence Engine", version="1.0.0")

allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5006")
allowed_origins = [o.strip() for o in allowed_origins_str.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def verify_api_key(x_ai_api_key: Optional[str] = Header(None)):
    expected_key = os.getenv("AI_API_KEY", "supersecretaiapikeyforfoodsharedevelopment")
    if x_ai_api_key != expected_key:
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid API Key")


# --- Pydantic Schemas ---
class ImageRequest(BaseModel):
    image_data: str # Base64 string

class FoodItem(BaseModel):
    name: str
    quantity: float
    unit: str
    foodType: str

class Location(BaseModel):
    coordinates: List[float] # [lng, lat]

class DonationDetail(BaseModel):
    foodItems: List[FoodItem]
    location: Location

class NgoDetail(BaseModel):
    id: str
    name: str
    location: Location
    ngoDetails: Optional[dict] = None

class MatchRequest(BaseModel):
    donation: DonationDetail
    ngos: List[NgoDetail]

class PickupLocation(BaseModel):
    id: str
    location: List[float] # [lng, lat]

class RouteRequest(BaseModel):
    start_location: List[float] # [lng, lat]
    pickups: List[PickupLocation]
    dropoff_location: List[float] # [lng, lat]


# --- REST Endpoints ---

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "foodshare-ai"}

@app.post("/ai/freshness", dependencies=[Depends(verify_api_key)])
def check_freshness(request: ImageRequest):
    result = analyze_food_freshness(request.image_data)
    if result.get("status") == "error":
        raise HTTPException(status_code=500, detail="Internal analysis error occurred in AI service")
    return result

@app.post("/ai/ocr-expiry", dependencies=[Depends(verify_api_key)])
def scan_expiry(request: ImageRequest):
    result = scan_expiry_date(request.image_data)
    if result.get("status") == "error":
        raise HTTPException(status_code=500, detail="Internal OCR scanner error occurred in AI service")
    return result

@app.post("/ai/match", dependencies=[Depends(verify_api_key)])
def match_donation(request: MatchRequest):
    # Convert Pydantic objects to dicts
    donation_dict = request.donation.model_dump()
    ngos_list = [ngo.model_dump() for ngo in request.ngos]
    
    matches = find_best_ngo_matches(donation_dict, ngos_list)
    return {"status": "success", "matches": matches}

@app.post("/ai/optimize-route", dependencies=[Depends(verify_api_key)])
def optimize_route(request: RouteRequest):
    pickups_list = [pk.model_dump() for pk in request.pickups]
    result = optimize_delivery_route(request.start_location, pickups_list, request.dropoff_location)
    if result.get("status") == "error":
        raise HTTPException(status_code=500, detail="Internal route optimization error occurred in AI service")
    return result
