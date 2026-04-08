import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export default function KineticsChart({ n = 2, K = 50 }) {
  const data = [...Array(21)].map((_, i) => {
    const c = i * 5;
    const rate = (c ** n) / ((K ** n) + (c ** n) || 1);
    return { concentration: c, rate: Number(rate.toFixed(4)) };
  });

  return (
    <div style={{ height: 150 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="concentration" tick={{ fill: "#A0A0A0", fontSize: 11 }} />
          <YAxis tick={{ fill: "#A0A0A0", fontSize: 11 }} domain={[0, 1]} />
          <Line dataKey="rate" stroke="#00FF88" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
