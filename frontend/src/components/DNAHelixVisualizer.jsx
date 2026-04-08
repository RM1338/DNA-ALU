import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useState } from "react";
import * as THREE from "three";
import { buildStrandsFromCostRows } from "../utils/strandModel";

function colorForPair(base) {
  if (base === "A") return "#7aa2ff";
  if (base === "T") return "#ffd166";
  if (base === "G") return "#00c7a5";
  return "#f28482";
}

function StrandHelix({ strand, onHover }) {
  const { leftPts, rightPts } = useMemo(() => {
    const l = [];
    const r = [];
    const n = strand.sequence.length;
    for (let i = 0; i < n; i += 1) {
      const t = (i / Math.max(1, n - 1)) * Math.PI * 6.2;
      const y = ((i / Math.max(1, n - 1)) - 0.5) * 5.2;
      const base = strand.sequence[i];
      const radius = (base === "G" || base === "C") ? 1.02 : 0.86;
      const x = Math.sin(t) * radius;
      const z = Math.cos(t) * 0.52;
      l.push(new THREE.Vector3(x, y, z));
      r.push(new THREE.Vector3(-x, y, -z));
    }
    return { leftPts: l, rightPts: r };
  }, [strand]);

  const leftCurve = useMemo(() => new THREE.CatmullRomCurve3(leftPts), [leftPts]);
  const rightCurve = useMemo(() => new THREE.CatmullRomCurve3(rightPts), [rightPts]);

  return (
    <group>
      <mesh onPointerMove={(e) => { e.stopPropagation(); onHover(strand, null); }}>
        <tubeGeometry args={[leftCurve, 220, 0.065, 12, false]} />
        <meshStandardMaterial color="#00c7a5" emissive="#00c7a5" emissiveIntensity={0.22} metalness={0.3} roughness={0.35} />
      </mesh>
      <mesh onPointerMove={(e) => { e.stopPropagation(); onHover(strand, null); }}>
        <tubeGeometry args={[rightCurve, 220, 0.065, 12, false]} />
        <meshStandardMaterial color="#9aa9bf" emissive="#9aa9bf" emissiveIntensity={0.12} metalness={0.2} roughness={0.4} />
      </mesh>

      {leftPts.map((p, i) => {
        const q = rightPts[i];
        const pairColor = colorForPair(strand.sequence[i]);
        const mid = p.clone().add(q).multiplyScalar(0.5);
        const dir = new THREE.Vector3().subVectors(q, p);
        const len = dir.length();
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
        return (
          <group key={`${strand.id}-${i}`}>
            <mesh position={mid} quaternion={quat} onPointerMove={(e) => { e.stopPropagation(); onHover(strand, i); }}>
              <cylinderGeometry args={[0.014, 0.014, len, 8]} />
              <meshStandardMaterial color={pairColor} metalness={0.15} roughness={0.45} />
            </mesh>
            <mesh position={p} onPointerMove={(e) => { e.stopPropagation(); onHover(strand, i); }}>
              <sphereGeometry args={[0.03, 10, 10]} />
              <meshStandardMaterial color="#f1ffef" emissive="#ffffff" emissiveIntensity={0.12} />
            </mesh>
            <mesh position={q} onPointerMove={(e) => { e.stopPropagation(); onHover(strand, i); }}>
              <sphereGeometry args={[0.03, 10, 10]} />
              <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.25} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Scene({ strand, onHover }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 5, 6]} intensity={1.1} color="#f1ffef" />
      <directionalLight position={[-4, -2, -5]} intensity={0.55} color="#00c7a5" />
      <StrandHelix strand={strand} onHover={onHover} />
      <OrbitControls enablePan enableZoom enableRotate minDistance={4} maxDistance={18} />
    </>
  );
}

export default function DNAHelixVisualizer({ title = "DNA Helix Simulation", rows = [], strands }) {
  const [hovered, setHovered] = useState(null);
  const list = useMemo(() => strands || buildStrandsFromCostRows(rows), [strands, rows]);
  const strand = list[0];

  const onHover = (s, baseIndex = null) => setHovered({ strand: s, baseIndex });

  if (!strand) {
    return (
      <section className="panel helix-panel">
        <h3>{title}</h3>
        <p className="dna-note">No strand data available.</p>
      </section>
    );
  }

  return (
    <section className="panel helix-panel">
      <div className="helix-head">
        <h3>{title}</h3>
        <span className="mono helix-tag">Single 3D Strand · Interactive</span>
      </div>

      <div className="helix-wrap-3d">
        <Canvas camera={{ position: [0, 0, 8.5], fov: 45 }} onPointerMissed={() => setHovered(null)}>
          <color attach="background" args={["#0e0e0e"]} />
          <Scene strand={strand} onHover={onHover} />
        </Canvas>
      </div>

      {hovered && (
        <div className="helix-tooltip mono">
          <div><strong>{hovered.strand.id}</strong> ({hovered.strand.gate})</div>
          <div>Len: {hovered.strand.length} · GC: {hovered.strand.gc}% · Tm: {hovered.strand.tm}C</div>
          <div>Stage {hovered.strand.stage} · {hovered.strand.enzyme}</div>
          {hovered.baseIndex !== null && (
            <div>Base #{hovered.baseIndex + 1}: {hovered.strand.sequence[hovered.baseIndex]}-{hovered.strand.complement[hovered.baseIndex]}</div>
          )}
          <div className="helix-seq">5' {hovered.strand.sequence.slice(0, 22)}... 3'</div>
        </div>
      )}

      <p className="dna-note">Drag to rotate, scroll to zoom, shift/right-drag to pan. Hover over the strand/base-pair to inspect details.</p>
    </section>
  );
}
