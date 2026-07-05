import math
from .matching import calculate_distance

def optimize_delivery_route(start_loc: list, pickups: list, dropoff_loc: list) -> dict:
    """
    Solves Traveling Salesperson Problem (TSP) using Nearest Neighbor heuristic
    to organize pickups sequentially from the starting location to the target NGO.
    
    start_loc: [lng, lat]
    pickups: list of {"id": str, "location": [lng, lat]}
    dropoff_loc: [lng, lat]
    """
    try:
        unvisited = list(pickups)
        current_coords = start_loc
        route_sequence = []
        total_distance = 0.0
        
        while unvisited:
            # Find nearest pickup
            nearest_idx = 0
            min_dist = float('inf')
            
            for idx, pk in enumerate(unvisited):
                pk_coords = pk['location']
                dist = calculate_distance(current_coords[1], current_coords[0], pk_coords[1], pk_coords[0])
                if dist < min_dist:
                    min_dist = dist
                    nearest_idx = idx
            
            # Move to nearest pickup
            nearest_pickup = unvisited.pop(nearest_idx)
            route_sequence.append(nearest_pickup)
            total_distance += min_dist
            current_coords = nearest_pickup['location']
            
        # Final leg to dropoff (NGO location)
        dist_to_ngo = calculate_distance(current_coords[1], current_coords[0], dropoff_loc[1], dropoff_loc[0])
        total_distance += dist_to_ngo
        
        # Calculate carbon offsets (e.g. 0.12 kg CO2 saved per km optimized compared to naive routes)
        co2_saved = round(total_distance * 0.12, 2)
        
        return {
            "status": "success",
            "optimized_sequence": route_sequence,
            "total_distance_km": round(total_distance, 2),
            "estimated_time_mins": int(total_distance * 2.5), # Approx 2.5 mins per km in city
            "carbon_optimized_offset_kg": co2_saved
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "total_distance_km": 0,
            "estimated_time_mins": 0
        }
