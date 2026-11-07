import { useState, useEffect } from "react";
import ScoreBadge from "./components/ScoreBadge";
import BestWindowBanner from "./components/BestWindowBanner";
import HourlyCards from "./components/HourlyCards";
import MapView from "./components/MapView";

export default function App() {
  const [locations, setLocations] = useState<any[]>([]);
  const [overview, setOverview] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState("uptown");
  const [conditions, setConditions] = useState<any>(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch locations preset list once
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/locations")
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch((err) => console.error("Failed to load locations", err));
  }, []);

  // Fetch overview data for map markers
  const fetchOverview = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/overview?profile=casual");
      if (!res.ok) throw new Error("Overview data unavailable");
      const json = await res.json();
      setOverview(json);
    } catch (err: any) {
      console.error(err);
    }
  };

  // Fetch conditions for selected location
  const fetchConditions = async (locId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/conditions?location_id=${locId}&profile=casual`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Data source unavailable");
      }
      const json = await res.json();
      setConditions(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
    fetchConditions(selectedId);
  }, [selectedId]);

  if (loading && !conditions) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading ClearDay CLT...</p>
        </div>
      </div>
    );
  }

  if (error && !conditions) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-red-200 dark:border-red-900 text-center space-y-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 text-red-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">!</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Unable to load data</h2>
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={() => fetchConditions(selectedId)}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { location, now, best_window, hourly } = conditions || {};

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-blue-600 dark:text-blue-400">ClearDay CLT</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Active Location: {location?.name}</p>
          </div>
          {/* Location Selector Tabs */}
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

        {/* Map View */}
        <MapView
          overviewData={overview}
          selectedLocationId={selectedId}
          onSelectLocation={(id) => setSelectedId(id)}
        />

        {/* Main Score & Best Window Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <ScoreBadge score={now?.score} label={now?.label} />
          </div>
          <div className="md:col-span-2 flex flex-col justify-between space-y-6">
            <BestWindowBanner bestWindow={best_window} />
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex-1 flex flex-col justify-center">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Tagline</h3>
              <p className="text-lg font-bold">The best hour to be outside, in one score.</p>
            </div>
          </div>
        </div>

        {/* Hourly Cards */}
        <HourlyCards hourly={hourly} />

      </div>
    </div>
  );
}