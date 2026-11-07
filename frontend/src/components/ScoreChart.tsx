import { LineChart, Line } from "recharts";

export default function ScoreChart() {
  const data = [
    { score: 10 },
    { score: 20 },
    { score: 30 },
  ];

  return (
    <LineChart width={300} height={200} data={data}>
      <Line dataKey="score" stroke="#2563eb" />
    </LineChart>
  );
}