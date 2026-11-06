import mockData from "./mock/conditions.json";
import ScoreBadge from "./components/ScoreBadge";
import BestWindowBanner from "./components/BestWindowBanner";
import HourlyCards from "./components/HourlyCards";

export default function App() {
  const { location, now, best_window, hourly } = mockData;

  return (
<div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 md:p-10">      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-blue-600 dark:text-blue-400">ClearDay CLT</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Location: {location.name}</p>
          </div>
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs font-bold rounded-full uppercase tracking-wider">
            Mock Data Mode
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