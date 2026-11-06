import time
import httpx
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from scoring import score_hour, best_window, label

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

CACHE = {}  # key -> (timestamp, data)
TTL = 600   # 10 minutes cache TTL

LOCATIONS = [
    {"id": "uptown", "name": "Uptown", "lat": 35.2271, "lon": -80.8431},
    {"id": "uncc", "name": "UNC Charlotte", "lat": 35.3071, "lon": -80.7352},
    {"id": "freedom", "name": "Freedom Park", "lat": 35.1960, "lon": -80.8400},
    {"id": "noda", "name": "NoDa", "lat": 35.2480, "lon": -80.8000},
    {"id": "southend", "name": "South End", "lat": 35.2100, "lon": -80.8570},
    {"id": "airport", "name": "Charlotte Douglas Airport area", "lat": 35.2140, "lon": -80.9431},
]

async def fetch_json(url: str, params: dict):
    cache_key = str(url) + str(sorted(params.items()))
    now = time.time()
    
    if cache_key in CACHE:
        timestamp, data = CACHE[cache_key]
        if now - timestamp < TTL:
            return data

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            r = await client.get(url, params=params)
            r.raise_for_status()
            data = r.json()
            CACHE[cache_key] = (now, data)
            return data
    except Exception:
        raise HTTPException(status_code=502, detail="Data source unavailable")

@app.get("/")
def read_root():
    return {"status": "ClearDay CLT backend is running"}

@app.get("/api/locations")
def get_locations():
    return LOCATIONS

async def get_location_forecast(lat: float, lon: float):
    weather_url = "https://api.open-meteo.com/v1/forecast"
    weather_params = {
        "latitude": lat,
        "longitude": lon,
        "hourly": "temperature_2m,apparent_temperature,precipitation_probability,wind_speed_10m,uv_index",
        "temperature_unit": "fahrenheit",
        "wind_speed_unit": "mph",
        "timezone": "America/New_York",
        "forecast_days": 2
    }
    
    aq_url = "https://air-quality-api.open-meteo.com/v1/air-quality"
    aq_params = {
        "latitude": lat,
        "longitude": lon,
        "hourly": "us_aqi",
        "timezone": "America/New_York",
        "forecast_days": 2
    }
    
    weather_data = await fetch_json(weather_url, weather_params)
    aq_data = await fetch_json(aq_url, aq_params)
    return weather_data, aq_data

@app.get("/api/overview")
async def get_overview(profile: str = Query("casual")):
    results = []
    for loc in LOCATIONS:
        try:
            w_data, aq_data = await get_location_forecast(loc["lat"], loc["lon"])
            # Get current hour index (or first index)
            feels = w_data["hourly"]["apparent_temperature"][0]
            rain = w_data["hourly"]["precipitation_probability"][0] or 0
            wind = w_data["hourly"]["wind_speed_10m"][0]
            uv = w_data["hourly"]["uv_index"][0]
            aqi = aq_data["hourly"]["us_aqi"][0] or 30
            
            score, lab = score_hour(aqi, feels, rain, uv, wind, profile)
            results.append({
                "location": loc,
                "score": score,
                "label": lab
            })
        except HTTPException:
            raise HTTPException(status_code=502, detail="Air quality data is unavailable")
    return results

@app.get("/api/conditions")
async def get_conditions(location_id: str = Query("uptown"), profile: str = Query("casual")):
    loc = next((l for l in LOCATIONS if l["id"] == location_id), LOCATIONS[0])
    
    w_data, aq_data = await get_location_forecast(loc["lat"], loc["lon"])
    
    w_times = w_data["hourly"]["time"]
    temps = w_data["hourly"]["temperature_2m"]
    feels_temps = w_data["hourly"]["apparent_temperature"]
    precips = w_data["hourly"]["precipitation_probability"]
    winds = w_data["hourly"]["wind_speed_10m"]
    uvs = w_data["hourly"]["uv_index"]
    aqis = aq_data["hourly"]["us_aqi"]
    
    hourly_rows = []
    for i in range(len(w_times)):
        t = w_times[i]
        feels = feels_temps[i] if feels_temps[i] is not None else 70
        rain = precips[i] if precips[i] is not None else 0
        wind = winds[i] if winds[i] is not None else 5
        uv = uvs[i] if uvs[i] is not None else 1
        aqi = aqis[i] if aqis[i] is not None else 30
        
        sc, lab = score_hour(aqi, feels, rain, uv, wind, profile)
        
        hourly_rows.append({
            "time": t,
            "feels_f": round(feels),
            "rain_pct": round(rain),
            "wind_mph": round(wind, 1),
            "uv": round(uv, 1),
            "aqi": round(aqi),
            "score": sc,
            "label": lab
        })
    
    now_score = hourly_rows[0]["score"] if hourly_rows else 80
    best_win = best_window(hourly_rows, hours=2)
    
    return {
        "location": loc,
        "profile": profile,
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%S-05:00"),
        "now": {"score": now_score, "label": label(now_score)},
        "best_window": best_win,
        "hourly": hourly_rows,
        "source_status": {"weather": "ok", "air_quality": "ok"}
    }