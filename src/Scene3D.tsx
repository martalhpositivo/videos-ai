import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { automarketBrand, automarketColors } from "./config/brands/automarket-durango";

/**
 * Intro 3D con la identidad de Automarket Durango.
 * Un toroide rojo metálico girando + cubos ámbar en órbita, iluminado, sobre el
 * fondo oscuro de marca, con un rótulo 2D encima. Animado 100% con
 * useCurrentFrame() para render determinista.
 */

const SpinningKnot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({ frame, fps, config: { damping: 200, mass: 0.8 } });
  const scale = interpolate(pop, [0, 1], [0.2, 1]);

  return (
    <mesh rotation={[frame * 0.02, frame * 0.03, 0]} scale={scale}>
      <torusKnotGeometry args={[1.15, 0.36, 220, 32]} />
      <meshStandardMaterial
        color={automarketColors.red}
        metalness={0.7}
        roughness={0.25}
      />
    </mesh>
  );
};

const OrbitingCube: React.FC<{ index: number; total: number }> = ({
  index,
  total,
}) => {
  const frame = useCurrentFrame();
  const base = (index / total) * Math.PI * 2;
  const a = base + frame * 0.02;
  const r = 2.7;
  const x = Math.cos(a) * r;
  const z = Math.sin(a) * r;
  const y = Math.sin(frame * 0.03 + index) * 0.5;

  return (
    <mesh position={[x, y, z]} rotation={[frame * 0.04, frame * 0.04, 0]}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial
        color={automarketColors.amber}
        metalness={0.5}
        roughness={0.35}
      />
    </mesh>
  );
};

export const Scene3D: React.FC = () => {
  const { width, height, fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const c = automarketBrand.colors;

  const titleIn = spring({ frame: frame - 20, fps, config: { damping: 200 } });
  const kickerIn = spring({ frame: frame - 12, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ backgroundColor: c.background }}>
      {/* Glow de marca detrás del 3D. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(50% 40% at 50% 38%, ${c.primary}44, transparent 70%)`,
        }}
      />

      <ThreeCanvas
        width={width}
        height={height}
        camera={{ position: [0, 0, 6], fov: 50 }}
        style={{ position: "absolute" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 6, 5]} intensity={2.2} />
        <pointLight position={[-5, -3, 2]} intensity={30} color={c.primary} />
        <SpinningKnot />
        {new Array(6).fill(0).map((_, i) => (
          <OrbitingCube key={i} index={i} total={6} />
        ))}
      </ThreeCanvas>

      {/* Rótulo 2D encima del 3D. */}
      <AbsoluteFill
        style={{ fontFamily: automarketBrand.fontFamily }}
        className="items-center justify-end pb-[16%] text-center"
      >
        <div
          style={{
            opacity: kickerIn,
            transform: `translateY(${(1 - kickerIn) * 24}px)`,
            backgroundColor: c.primary,
          }}
          className="mb-6 rounded-full px-8 py-3 text-3xl font-extrabold uppercase tracking-[0.18em] text-white"
        >
          Coche de la semana
        </div>
        <h1
          style={{
            opacity: titleIn,
            transform: `translateY(${(1 - titleIn) * 30}px)`,
            color: c.text,
          }}
          className="text-[104px] font-black leading-[0.9] tracking-tight"
        >
          Automarket
          <br />
          <span style={{ color: automarketColors.amber }}>Durango</span>
        </h1>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
