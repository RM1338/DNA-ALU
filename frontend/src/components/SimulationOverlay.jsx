import { useEffect, useRef, useState } from "react";

const MESSAGES = [
  "Validating circuit topology...",
  "Resolving biological gate mappings...",
  "Computing reaction stages...",
  "Estimating strand synthesis cost...",
  "Evaluating truth table outputs...",
  "Finalizing reaction cascade...",
];

const MIN_VISIBLE_MS = 5000;

export default function SimulationOverlay({ active }) {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const startedAtRef = useRef(0);

  useEffect(() => {
    if (active) {
      startedAtRef.current = Date.now();
      setVisible(true);
      return;
    }

    const elapsed = Date.now() - startedAtRef.current;
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

    const hideTimer = setTimeout(() => {
      setVisible(false);
      setProgress(0);
      setStep(0);
    }, remaining);

    return () => clearTimeout(hideTimer);
  }, [active]);

  useEffect(() => {
    if (!visible) return undefined;

    const id = setInterval(() => {
      setProgress((p) => {
        const target = active ? 96 : 100;
        const next = Math.min(target, p + Math.random() * 8);
        const idx = Math.min(MESSAGES.length - 1, Math.floor((next / 100) * MESSAGES.length));
        setStep(idx);
        return next;
      });
    }, 300);

    return () => clearInterval(id);
  }, [visible, active]);

  if (!visible) return null;

  return (
    <div className="sim-overlay">
      <div className="sim-card">
        <h3>ALU Simulation In Progress</h3>
        <p className="mono">{MESSAGES[step]}</p>
        <div className="sim-progress"><div style={{ width: `${progress}%` }} /></div>
        <div className="sim-chip-row">
          <span className="sim-chip">DNA mapping</span>
          <span className="sim-chip">Stage solving</span>
          <span className="sim-chip">Truth propagation</span>
        </div>
      </div>
    </div>
  );
}
