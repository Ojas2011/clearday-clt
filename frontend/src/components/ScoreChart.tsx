import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function ScoreChart({ hourly }: any) {
  if (!hourly || hourly.length === 0) return null;

  const chartData = hourly.map((item: any) => ({
    time: item.time.split("T")[1],
    score: item.score,
  }));

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-2xl 
    shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
        24-Hour Outdoor Score Trend
      </h3>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#2563eb"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}