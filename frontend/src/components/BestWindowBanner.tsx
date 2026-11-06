export default function BestWindowBanner({ bestWindow }) {
  if (!bestWindow) return null;

  return (
    <div className="w-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
      <div>
        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 uppercase tracking-wide">Best Time Window</h3>
        <p className="text-lg font-bold text-blue-700 dark:text-blue-200 mt-0.5">
          {bestWindow.start} to {bestWindow.end}
        </p>
      </div>
      <div className="text-right">
        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Avg Score</span>
        <p className="text-xl font-black text-blue-800 dark:text-blue-100">{bestWindow.avg_score}</p>
      </div>
    </div>
  );
}