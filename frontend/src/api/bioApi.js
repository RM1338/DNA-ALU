const BASE = "http://localhost:8000/api";

async function getErrorMessage(response) {
  try {
    const data = await response.clone().json();
    if (typeof data?.detail === "string" && data.detail.trim()) return data.detail;
    if (typeof data?.message === "string" && data.message.trim()) return data.message;
    if (typeof data?.error === "string" && data.error.trim()) return data.error;
  } catch {
    // fall through
  }

  try {
    const txt = await response.text();
    if (txt?.trim()) return txt;
  } catch {
    // fall through
  }

  return `Request failed with status ${response.status}`;
}

async function call(path, body) {
  const r = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!r.ok) throw new Error(await getErrorMessage(r));
  return r.json();
}

export const simulateCircuit = (circuitPayload) => call("/simulate", circuitPayload);
export const optimizeCircuit = (circuit, objective) => call("/optimize", { circuit, objective });

export const fetchPresets = async () => {
  const r = await fetch(`${BASE}/presets`);
  if (!r.ok) throw new Error(await getErrorMessage(r));
  return r.json();
};

async function download(path, body, filename) {
  const r = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!r.ok) throw new Error(await getErrorMessage(r));

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
