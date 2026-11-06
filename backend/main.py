import time
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

CACHE = {}  # key -> (timestamp, data)
TTL = 600   # 10 minutes cache TTL

async def fetch_json(url, params):
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            r = await client.get(url, params=params)
            r.raise_for_status()
            return r.json()
    except Exception:
        raise HTTPException(status_code=502, detail="Data source unavailable")

@app.get("/")
def read_root():
    return {"status": "ClearDay CLT backend is running"}

@app.get("/api/test-fetch")
async def test_fetch():
    # Uptown Charlotte coordinates
    lat, lon = 35.2271, -80.8431
    
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
    
    return {
        "weather_sample": weather_data["hourly"]["time"][:5],
        "temperature_sample": weather_data["hourly"]["temperature_2m"][:5],
        "aqi_sample": aq_data["hourly"]["us_aqi"][:5]
    }