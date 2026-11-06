from scoring import score_hour, best_window

def test_scoring():
    # 1. Test ideal conditions
    perfect_score, perfect_label = score_hour(aqi=20, feels_f=70, rain_pct=0, uv=2, wind_mph=5, profile='casual')
    print(f"Perfect hour score: {perfect_score} ({perfect_label})")
    assert perfect_score >= 90

    # 2. Test terrible conditions (bad AQI, high heat, rain)
    bad_score, bad_label = score_hour(aqi=160, feels_f=95, rain_pct=80, uv=8, wind_mph=25, profile='runner')
    print(f"Terrible hour score: {bad_score} ({bad_label})")
    assert bad_score < 40

    # 3. Test best window logic
    mock_hourly = [
        {"time": "2026-11-06T12:00", "score": 60},
        {"time": "2026-11-06T13:00", "score": 85},
        {"time": "2026-11-06T14:00", "score": 90},
        {"time": "2026-11-06T15:00", "score": 70},
    ]
    window = best_window(mock_hourly, hours=2)
    print("Best window result:", window)
    assert window['start'] == "2026-11-06T13:00"
    assert window['avg_score'] == 87.5

    print("\nAll scoring tests passed successfully!")

if __name__ == "__main__":
    test_scoring()