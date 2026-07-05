import math

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Haversine formula to compute distance in km between two geo-points.
    """
    R = 6371.0 # Earth radius in km
    
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c

def find_best_ngo_matches(donation: dict, ngos: list) -> list:
    """
    Ranks NGOs for a donation based on distance, capacity, food type preferences, and urgency.
    """
    donation_lat = donation['location']['coordinates'][1]
    donation_lon = donation['location']['coordinates'][0]
    
    # Calculate weight of food items
    donation_weight = 0
    donation_types = set()
    for item in donation.get('foodItems', []):
        donation_types.add(item.get('foodType'))
        qty = item.get('quantity', 0)
        unit = item.get('unit', 'servings')
        if unit == 'kg':
            donation_weight += qty
        else:
            donation_weight += qty * 0.4 # approx 400g per serving
            
    scored_ngos = []
    
    for ngo in ngos:
        ngo_lat = ngo['location']['coordinates'][1]
        ngo_lon = ngo['location']['coordinates'][0]
        
        # 1. Distance score (closer is better, max distance 15km)
        dist = calculate_distance(donation_lat, donation_lon, ngo_lat, ngo_lon)
        if dist > 15.0:
            continue # Skip if too far
            
        dist_score = max(0, 100 * (1 - (dist / 15.0)))
        
        # 2. Capacity matching (NGO should have enough capacity)
        ngo_cap = ngo.get('ngoDetails', {}).get('capacity', 100)
        cap_score = 100 if ngo_cap >= donation_weight else (ngo_cap / (donation_weight + 1)) * 100
        
        # 3. Preference matching (does the NGO accept this food category)
        ngo_prefs = set(ngo.get('ngoDetails', {}).get('preferredFoodTypes', []))
        pref_matches = donation_types.intersection(ngo_prefs)
        pref_score = 100 if len(pref_matches) > 0 else 30 # partial match fallback
        
        # Calculate compound score (Weighted average)
        # 50% distance, 30% preference, 20% capacity
        final_score = (dist_score * 0.5) + (pref_score * 0.3) + (cap_score * 0.2)
        
        scored_ngos.append({
            "ngo_id": ngo.get('id') or ngo.get('_id'),
            "ngo_name": ngo.get('name'),
            "distance_km": round(dist, 2),
            "match_score": round(final_score, 1),
            "reason": f"Located {round(dist, 1)}km away. Matching preferred categories: {list(pref_matches)}."
        })
        
    # Sort by match score descending
    scored_ngos.sort(key=lambda x: x['match_score'], reverse=True)
    return scored_ngos
