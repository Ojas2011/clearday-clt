export default function ScoreBadge({ score, label }) {
  // Color mapping based on score/label
  let bgColor = "bg-green-500";
  if (score < 75 && score >= 50) bgColor = "bg-yellow-500";
  else if (score < 50 && score >= 30) bgColor = "bg-orange-500";
  else if (score < 30) bgColor = "bg-red-500";

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
      <div className={`w-28 h-28 rounded-full ${bgColor} flex flex-col items-center justify-center text-white shadow-md transition-all duration-300`}>
        <span className="text-4xl font-black">{score}</span>
        <span className="text-sm font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">Current Outdoor Score</p>
    </div>
  );
}