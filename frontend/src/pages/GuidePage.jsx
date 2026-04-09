import BioExplainer from "../components/BioExplainer";

export default function GuidePage() {
  return (
    <div className="results-page">
      <section className="panel">
        <h2>Non-Biology User Guide</h2>
        <p className="dna-note">Plain-language explanation of what the simulator does and how to interpret output.</p>
      </section>
      <section className="panel">
        <h3>Course outcomes in this app</h3>
        <p>
          <strong>CO1</strong> is implemented as a four-phase execution narrative (fetch → decode → execute → writeback) computed in{" "}
          <span className="mono">backend/course_outcomes.py</span> and shown after simulation.{" "}
          <strong>CO4</strong> uses the <span className="mono">PIO / Interrupt / DMA</span> selector on the canvas; the backend applies that mode to peripheral timing and throughput metrics.{" "}
          <strong>CO5</strong> estimates SIMT-, tensor-, and hybrid-style speedups from your graph&apos;s serial work vs critical-path parallelism.
        </p>
      </section>
      <BioExplainer />
    </div>
  );
}
