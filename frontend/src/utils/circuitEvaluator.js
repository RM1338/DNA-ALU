const gateFns = {
  AND: (i) => i.every(Boolean) ? 1 : 0,
  OR: (i) => i.some(Boolean) ? 1 : 0,
  NOT: (i) => i[0] ? 0 : 1,
  XOR: (i) => (i[0] ^ i[1]) ? 1 : 0,
  NAND: (i) => i.every(Boolean) ? 0 : 1,
  NOR: (i) => i.some(Boolean) ? 0 : 1,
  XNOR: (i) => (i[0] ^ i[1]) ? 0 : 1,
  BUFFER: (i) => i[0] ? 1 : 0,
};
export function evaluateTruthTable(gates, wires, inputIds, outputIds) {
  if (!inputIds?.length) return [];
  const indeg = new Map(); const adj = new Map();
  gates.forEach(g => { indeg.set(g.id, 0); adj.set(g.id, []); });
  wires.forEach(w => { if (indeg.has(w.target) && indeg.has(w.source)) { indeg.set(w.target, indeg.get(w.target)+1); adj.get(w.source).push(w.target);} });
  const q = [...[...indeg.entries()].filter(([,d])=>d===0).map(([k])=>k)];
  const topo = [];
  while(q.length){const n=q.shift(); topo.push(n); for(const m of adj.get(n)||[]){indeg.set(m,indeg.get(m)-1); if(indeg.get(m)===0) q.push(m);} }
  const gateById = Object.fromEntries(gates.map(g => [g.id, g]));
  const incoming = {};
  wires.forEach(w => { (incoming[w.target] ||= []).push(w); });
  const rows = [];
  for(let mask=0; mask<(1<<inputIds.length); mask++){
    const values = {};
    inputIds.forEach((id, idx) => { values[id] = (mask >> (inputIds.length-idx-1)) & 1; });
    topo.forEach(id => {
      const g = gateById[id];
      if (!g || g.type === 'input' || id.startsWith('in_')) return;
      const inVals = (incoming[id]||[]).sort((a,b)=>(a.targetHandle||'').localeCompare(b.targetHandle||'')).map(w => values[w.source] ?? 0);
      values[id] = (gateFns[g.data?.gateType || g.gateType] || (()=>0))(inVals);
    });
    const outputs = {};
    outputIds.forEach((oid) => { outputs[oid] = values[oid] ?? values[`out_${oid}`] ?? 0; });
    const inputs = {}; inputIds.forEach((id) => { inputs[id] = values[id] ?? values[`in_${id}`] ?? 0; });
    rows.push({ inputs, outputs });
  }
  return rows;
}
