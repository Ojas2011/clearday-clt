import { useState, useEffect } from "react";
import ScoreBadge from "./components/ScoreBadge";
import BestWindowBanner from "./components/BestWindowBanner";
import HourlyCards from "./components/HourlyCards";
import MapView from "./components/MapView";
import ProfileSelector from "./components/ProfileSelector";
import ScoreChart from "./components/ScoreChart";
import Toolbar from "./components/Toolbar";

export default function App() {
  const [locations, setLocations] = useState([]);
  const [overview, setOverview] = useState([]);
  const [selectedId, setSelectedId] = useState("uptown");
  const [profile, setProfile] = useState("casual");
  const [conditions, setConditions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scale, setScale] = useState(1);

  // Polish states
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("clearday_dark") === "true";
  });
  const [fontSize, setFontSize] = useState(16);

 useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}, [darkMode]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/locations")
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch((err) => console.error("Failed to load locations", err));
  }, []);

  const fetchOverview = async (prof) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/overview?profile=${prof}`);
      if (!res.ok) throw new Error("Overview data unavailable");
      const json = await res.json();
      setOverview(json);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchConditions = async (locId, prof) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/conditions?location_id=${locId}&profile=${prof}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Data source unavailable");
      }
      const json = await res.json();
      setConditions(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview(profile);
    fetchConditions(selectedId, profile);
  }, [selectedId, profile]);

  if (loading && !conditions) {
    return (
      <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center ${darkMode ? "dark" : ""}`}>
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading ClearDay CLT...</p>
        </div>
      </div>
    );
  }

  const { location, now, best_window, hourly } = conditions || {};

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 md:p-10 ${darkMode ? "dark" : ""}`} style={{
  fontSize: `${fontSize}px`,
  transform: `scale(${scale})`,
  transformOrigin: "top center"
}}>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-blue-600 dark:text-blue-400">ClearDay CLT</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Active Location: {location?.name}</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {locations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setSelectedId(loc.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedId === loc.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {loc.name}
              </button>
            ))}
          </div>
        </header>

        {/* Polish & Accessibility Toolbar */}
        <Toolbar
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          fontSize={fontSize}
          onChangeFontSize={(size) => setFontSize(size)}
        />

        {/* Profile Selector */}
        <ProfileSelector currentProfile={profile} onSelectProfile={(p) => setProfile(p)} />

        {/* Map View */}
        <MapView
          overviewData={overview}
          selectedLocationId={selectedId}
          onSelectLocation={(id) => setSelectedId(id)}
        />

        {/* Main Score & Best Window */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <ScoreBadge score={now?.score} label={now?.label} />
          </div>
          <div className="md:col-span-2 flex flex-col justify-between space-y-6">
            <BestWindowBanner bestWindow={best_window} />
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex-1 flex flex-col justify-center">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Summary</h3>
              <p className="text-base font-semibold text-gray-800 dark:text-gray-200">
                Conditions for <span className="text-blue-600 dark:text-blue-400 font-bold">{profile}</span> mode are currently {now?.label.toLowerCase()}.
              </p>
            </div>
          </div>
        </div>

        {/* Recharts Score Trend */}
        {hourly && <ScoreChart hourly={hourly} />} 

        {/* Hourly Cards */}
        {hourly && <HourlyCards hourly={hourly} />}

      </div>
    </div>
  );
}