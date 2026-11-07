import { useState, useEffect } from "react";
import ScoreBadge from "./components/ScoreBadge";
import BestWindowBanner from "./components/BestWindowBanner";
import HourlyCards from "./components/HourlyCards";

export default function App() {
const [data, setData] = useState<any>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

  const fetchConditions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/conditions?location_id=uptown&profile=casual");
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Data source unavailable");
      }
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConditions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading live Charlotte weather & air quality...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-red-200 dark:border-red-900 text-center space-y-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 text-red-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">!</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Unable to load data</h2>
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={fetchConditions}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { location, now, best_window, hourly } = data;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-blue-600 dark:text-blue-400">ClearDay CLT</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Location: {location.name}</p>
          </div>
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 text-xs font-bold rounded-full uppercase tracking-wider">
            Live API Connected
          </span>
        </header>

        {/* Main Score & Best Window Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <ScoreBadge score={now.score} label={now.label} />
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