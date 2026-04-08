export default function MetricKPI({ label, value, accent = "var(--text-primary)" }) {
  return (
    <div className="kpi">
      <div className="kpi-label mono">{label}</div>
      <div className="kpi-value mono" style={{ color: accent }}>{value}</div>
      <div className="kpi-bar"><div style={{ width: "72%" }} /></div>
    </div>
  );
}
