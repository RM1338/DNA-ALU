export default function DNAStrandDiagram({ inputCount = 2, enzyme = "Catalyst" }) {
  const y1 = inputCount === 1 ? 40 : 22;
  const y2 = 58;
  return (
    <svg viewBox="0 0 340 84" width="100%" role="img" aria-label="DNA strand diagram">
      <line x1="12" y1={y1} x2="144" y2={y1} stroke="#00C9A7" strokeWidth="2" />
      {inputCount > 1 && <line x1="12" y1={y2} x2="144" y2={y2} stroke="#00C9A7" strokeWidth="2" />}
      <circle cx="172" cy="40" r="14" fill="#1E1E1E" stroke="#F59E0B" />
      <text x="172" y="44" textAnchor="middle" fontSize="9" fill="#F59E0B">{enzyme}</text>
      <line x1="188" y1="40" x2="326" y2="40" stroke="#00FF88" strokeWidth="2" />
      <text x="12" y="12" fontSize="10" fill="#00C9A7">Input</text>
      <text x="286" y="28" fontSize="10" fill="#00FF88">Output</text>
    </svg>
  );
}
