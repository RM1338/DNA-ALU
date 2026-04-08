export function generateSequence(seed, len = 24) {
  const chars = ["A", "T", "G", "C"];
  let x = 0;
  for (let i = 0; i < seed.length; i += 1) x = (x * 31 + seed.charCodeAt(i)) % 1000003;
  let out = "";
  for (let i = 0; i < len; i += 1) {
    x = (x * 1664525 + 1013904223) >>> 0;
    out += chars[x % 4];
  }
  return out;
}

export function complement(base) {
  return ({ A: "T", T: "A", G: "C", C: "G" }[base] || "N");
}

export function complementSequence(seq) {
  return seq.split("").map(complement).join("");
}

export function gcContent(seq) {
  const gc = [...seq].filter((c) => c === "G" || c === "C").length;
  return Math.round((gc / Math.max(1, seq.length)) * 100);
}

export function estimateTm(seq) {
  const at = [...seq].filter((c) => c === "A" || c === "T").length;
  const gc = [...seq].filter((c) => c === "G" || c === "C").length;
  if (seq.length < 14) return at * 2 + gc * 4;
  return Math.round(64.9 + 41 * (gc - 16.4) / Math.max(1, seq.length));
}

export function buildStrandsFromCostRows(rows = []) {
  return rows.map((r, i) => {
    const length = 20 + ((r.strandCost || 1) * 3) + ((i % 3) * 2);
    const sequence = generateSequence(`${r.gateId}-${r.gateType}-${r.enzyme}-${i}`, length);
    const complementStrand = complementSequence(sequence);
    return {
      id: `${r.gateId}-strand-${i + 1}`,
      gate: r.gateType,
      enzyme: r.enzyme,
      stage: r.stageIndex,
      sequence,
      complement: complementStrand,
      length,
      gc: gcContent(sequence),
      tm: estimateTm(sequence),
      mechanism: r.bioMechanism,
    };
  });
}
