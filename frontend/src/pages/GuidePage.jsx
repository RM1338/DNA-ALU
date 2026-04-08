import BioExplainer from "../components/BioExplainer";

export default function GuidePage() {
  return (
    <div className="results-page">
      <section className="panel">
        <h2>Non-Biology User Guide</h2>
        <p className="dna-note">Plain-language explanation of what the simulator does and how to interpret output.</p>
      </section>
      <BioExplainer />
    </div>
  );
}
