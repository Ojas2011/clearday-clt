export default function HourlyCards({ hourly }) {
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Hourly Forecast</h3>
      <div className="flex space-x-4 overflow-x-auto pb-3 scrollbar-thin">
        {hourly.map((row, index) => (
          <div key={index} className="flex-shrink-0 w-32 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 border border-gray-200/60 dark:border-gray-600 text-center">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              {row.time.split("T")[1]}
            </span>
            <div className="my-2 text-xl font-black text-gray-800 dark:text-gray-100">
              {row.score}
            </div>
            <span className="inline-block px-2 py-0.5 text-xs font-bold rounded-full bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
              {row.label}
            </span>
            <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-300 space-y-1">
              <p>Feels: {row.feels_f}°F</p>
              <p>Rain: {row.rain_pct}%</p>
              <p>Wind: {row.wind_mph} mph</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}