import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function MoodChart({ moodData }) {
  return (
    <div className="card">
      <h2>PHQ-9 Score Over Time</h2>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={moodData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis domain={[0, 27]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="phq9_score"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MoodChart;
