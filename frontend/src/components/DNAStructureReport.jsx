import { buildStrandsFromCostRows } from "../utils/strandModel";

export default function DNAStructureReport({ rows = [], strands }) {
  const list = strands || buildStrandsFromCostRows(rows);

  return (
    <section className="panel">
      <h3>Generated DNA Strand Structures</h3>
      <p className="dna-note">Sequence-coupled strand preview with complementary strand, GC% and estimated melting temperature.</p>
      <div className="dna-grid">
        {list.map((s) => (
          <div key={s.id} className="dna-card">
            <div className="dna-head">
              <span className="mono">{s.id}</span>
              <span className="dna-tag">{s.gate}</span>
            </div>
            <div className="mono dna-seq">5' {s.sequence} 3'</div>
            <div className="mono dna-seq" style={{ color: "#9fd0b6" }}>3' {s.complement} 5'</div>
            <div className="dna-metrics mono">Len: {s.length} · GC: {s.gc}% · Tm: {s.tm}C · Stage {s.stage}</div>
            <div className="dna-metrics mono" style={{ opacity: 0.8 }}>{s.mechanism} · {s.enzyme}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
