import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function WeightChart({ series }) {
  const data = (series || []).map((d) => ({
    date: new Date(d.date).toLocaleDateString(),
    value: Number(d.value),
  }));

  if (!data.length)
    return (
      <div className="rounded-2xl border border-violet-200 bg-white/90 p-4 text-sm text-slate-600">
        No weight data yet.
      </div>
    );

  return (
    <div className="w-full min-w-0 rounded-2xl border border-violet-200 bg-white/90 p-3">
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 16, left: 4, bottom: 0 }}>
            <CartesianGrid stroke="#E9D5FF" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#64748B", fontSize: 12 }}
              tickMargin={6}
              axisLine={{ stroke: "#E9D5FF" }}
              tickLine={{ stroke: "#E9D5FF" }}
            />
            <YAxis
              width={40}
              tick={{ fill: "#64748B", fontSize: 12 }}
              axisLine={{ stroke: "#E9D5FF" }}
              tickLine={{ stroke: "#E9D5FF" }}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(255,255,255,0.95)",
                border: "1px solid #DDD6FE",
                borderRadius: "12px",
              }}
              labelStyle={{ color: "#334155" }}
              itemStyle={{ color: "#7C3AED" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#7C3AED"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, stroke: "#7C3AED", fill: "#F5F3FF", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
