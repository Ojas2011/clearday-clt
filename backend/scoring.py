def penalties(aqi, feels_f, rain_pct, uv, wind_mph):
    p_aqi = min(100, max(0, (aqi - 50) * 100 / 150))
    
    if feels_f < 55:
        p_heat = (55 - feels_f) * 3
    elif feels_f > 80:
        p_heat = (feels_f - 80) * 4
    else:
        p_heat = 0
    p_heat = min(100, max(0, p_heat))

    p_rain = min(100, max(0, rain_pct))
    p_uv = min(100, max(0, (uv - 5) * 12))
    p_wind = min(100, max(0, (wind_mph - 15) * 5))

    return dict(aqi=p_aqi, heat=p_heat, rain=p_rain, uv=p_uv, wind=p_wind)

WEIGHTS = {
    'casual': dict(aqi=0.25, heat=0.30, rain=0.25, uv=0.10, wind=0.10),
    'runner': dict(aqi=0.30, heat=0.35, rain=0.10, uv=0.10, wind=0.15),
    'sensitive': dict(aqi=0.50, heat=0.20, rain=0.10, uv=0.10, wind=0.10),
    'worker': dict(aqi=0.20, heat=0.40, rain=0.10, uv=0.25, wind=0.05),
}

def label(score):
    if score >= 75:
        return 'Great'
    if score >= 50:
        return 'OK'
    if score >= 30:
        return 'Poor'
    return 'Avoid'

def score_hour(aqi, feels_f, rain_pct, uv, wind_mph, profile='casual'):
    w = WEIGHTS.get(profile, WEIGHTS['casual'])
    p = penalties(aqi, feels_f, rain_pct, uv, wind_mph)
    
    weighted_penalty = sum(p[k] * w[k] for k in p)
    score = max(0, min(100, round(100 - weighted_penalty)))
    return score, label(score)

def best_window(hourly_list, hours=2):
    if len(hourly_list) < hours:
        return None
    
    best_avg = -1
    best_start = None
    best_end = None

    for i in range(len(hourly_list) - hours + 1):
        window = hourly_list[i : i + hours]
        avg = sum(item['score'] for item in window) / hours
        if avg > best_avg:
            best_avg = round(avg, 1)
            best_start = window[0]['time']
            best_end = window[-1]['time']

    return {
        "start": best_start,
        "end": best_end,
        "avg_score": best_avg
    }