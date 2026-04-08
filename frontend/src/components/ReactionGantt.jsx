import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function ReactionGantt({ stages = [] }) {
  const data = stages.map((s) => ({
    name: `Stage ${s.stageIndex}`,
    duration: Number(s.durationMinutes || 0),
    start: Number(s.startMinute || 0),
    dominant: s.dominantGateType,
    enzymes: (s.enzymesInvolved || []).join(", "),
  }));

  return (
    <div style={{ height: 320 }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 24, right: 16, top: 8, bottom: 8 }}>
          <XAxis type="number" tick={{ fill: "#A0A0A0" }} />
          <YAxis type="category" dataKey="name" tick={{ fill: "#A0A0A0" }} width={70} />
          <Tooltip
            contentStyle={{ background: "#1E1E1E", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
            formatter={(v, k) => (k === "duration" ? [`${v} min`, "Duration"] : [v, k])}
            labelFormatter={(l, p) => {
              const d = p?.[0]?.payload;
              return `${l} · ${d?.dominant || ""} · ${d?.enzymes || ""}`;
            }}
          />
          <Bar dataKey="duration" fill="#00FF88" radius={2}>
            <LabelList dataKey="duration" position="right" fill="#00FF88" formatter={(v) => `${v}m`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
