5. Data contract (write this before any code)
Save this as CONTRACT.md in your repo. The frontend and backend both build to it.
Endpoints
• GET /api/locations returns the list of preset locations
• GET /api/overview?profile=casual returns each location with its current score (for map markers)
• GET /api/conditions?location_id=uptown&profile=casual returns the hourly detail
• POST /api/advice (optional) returns a short summary for one location
Example response for /api/conditions
{
  "location": {"id": "uptown", "name": "Uptown", "lat": 35.2271, "lon": -80.8431},
  "profile": "casual",
  "generated_at": "2026-11-05T14:00:00-05:00",
  "now": {"score": 82, "label": "Great"},
  "best_window": {"start": "2026-11-05T16:00", "end": "2026-11-05T18:00", "avg_score": 88},
  "hourly": [
    {"time": "2026-11-05T15:00", "feels_f": 58, "rain_pct": 10, "wind_mph": 8, "uv": 2.1, "aqi": 42, "score": 87, "label": "Great"}
  ],
  "source_status": {"weather": "ok", "air_quality": "ok"}
}
Error rule: if a data source fails, the backend returns HTTP 502 with {"error": "Air quality data is unavailable"}. The frontend shows that message. Nothing is ever faked.
Preset locations (coordinates are approximate; verify them with a map or the geocoding API)
• Uptown: 35.2271, -80.8431
• UNC Charlotte: 35.3071, -80.7352
• Freedom Park: 35.1960, -80.8400
• NoDa: 35.2480, -80.8000
• South End: 35.2100, -80.8570
• Charlotte Douglas Airport area: 35.2140, -80.9431