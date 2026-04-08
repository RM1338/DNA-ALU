export default function StrandCostTable({ rows = [] }) {
  const totalStrands = rows.reduce((a, r) => a + (r.strandCost || 0), 0);
  const totalTime = rows.reduce((a, r) => a + (r.reactionTimeMin || 0), 0);

  return (
    <div className="cost-table-wrap">
      <table className="cost-table">
        <thead>
          <tr>
            <th>Gate</th>
            <th>Biological Mechanism</th>
            <th>Strands</th>
            <th>Time (min)</th>
            <th>Enzyme</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={`${r.gateId}_${i}`}>
              <td className="mono">{r.gateType}</td>
              <td>{r.bioMechanism}</td>
              <td><span className="badge teal mono">{r.strandCost}</span></td>
              <td className="mono" style={{ color: "#00FF88" }}>{r.reactionTimeMin}</td>
              <td>{r.enzyme}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2}>Total</td>
            <td className="mono">{totalStrands}</td>
            <td className="mono">{totalTime}</td>
            <td>-</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
