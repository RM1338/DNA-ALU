const BASE = "http://localhost:8000/api";

async function call(path, body) {
  const r = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!r.ok) {
    const txt = await r.text();
    throw new Error(txt || `Request failed: ${r.status}`);
  }

  return r.json();
}

export const simulateCircuit = (circuitPayload) => call("/simulate", circuitPayload);
export const optimizeCircuit = (circuit, objective) => call("/optimize", { circuit, objective });

export const fetchPresets = async () => {
  const r = await fetch(`${BASE}/presets`);
  if (!r.ok) throw new Error((await r.text()) || "Failed to fetch presets");
  return r.json();
};

async function download(path, body, filename) {
  const r = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!r.ok) throw new Error((await r.text()) || "Download failed");

  const blob = await r.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export const exportPDF = (circuit, result, name) => download("/export/pdf", { circuit, result, circuitName: name }, `${name}.pdf`);
export const exportSBOL = (circuit, result) => download("/export/sbol", { circuit, result }, "circuit.sbol.xml");
