import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function WeightChart({ series }) {
  const data = (series || []).map(d => ({
    date: new Date(d.date).toLocaleDateString(),
    value: Number(d.value)
  }));

  if (!data.length) return <div className="p-4 text-sm text-gray-500">No weight data yet.</div>;

  return (
    <div className="w-full min-w-0" style={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
