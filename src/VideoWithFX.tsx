import React from "react";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { parseMedia } from "@remotion/media-parser";
import { ThreeCanvas } from "@remotion/three";
import { fxConfig, type FxConfig } from "./config/fx.config";
import { automarketColors } from "./config/brands/automarket-durango";

const INTRO_FRAMES = 75; // 2.5s de intro 3D
const OUTRO_FRAMES = 80;

export type VideoWithFXProps = {
  config?: FxConfig;
  /** Sobrescribe config.videoSrc (lo pasa la CLI como prop de nivel superior). */
  videoSrc?: string;
};

const resolveVideoSrc = (props: VideoWithFXProps): string =>
  props.videoSrc ?? props.config?.videoSrc ?? fxConfig.videoSrc;

// ── Metadata: adopta dimensiones/duración/fps del video de entrada ──────────
export const calculateVideoWithFxMetadata: CalculateMetadataFunction<
  VideoWithFXProps
> = async ({ props }) => {
  const videoSrc = resolveVideoSrc(props);
  if (!videoSrc) {
    return { durationInFrames: 300, fps: 30, width: 1080, height: 1920 };
  }
  const { dimensions, slowDurationInSeconds, fps } = await parseMedia({
    src: staticFile(videoSrc),
    fields: { dimensions: true, slowDurationInSeconds: true, fps: true },
    acknowledgeRemotionLicense: true,
  });
  const useFps = fps ?? 30;
  return {
    fps: useFps,
    durationInFrames: Math.max(1, Math.ceil(slowDurationInSeconds * useFps)),
    width: dimensions?.width ?? 1080,
    height: dimensions?.height ?? 1920,
  };
};

// ── Intro 3D que cubre el video y se desvanece ──────────────────────────────
const Knot: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <mesh rotation={[frame * 0.03, frame * 0.04, 0]}>
      <torusKnotGeometry args={[1.1, 0.34, 180, 28]} />
      <meshStandardMaterial color={automarketColors.red} metalness={0.7} roughness={0.25} />
    </mesh>
  );
};

const Intro3D: React.FC<{ config: FxConfig }> = ({ config }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const c = config.brand.colors;

  const out = interpolate(frame, [INTRO_FRAMES - 15, INTRO_FRAMES], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleIn = spring({ frame: frame - 10, fps, config: { damping: 200 } });
  const lines = config.introTitle.split("\n");

  return (
    <AbsoluteFill style={{ backgroundColor: c.background, opacity: out }}>
      <AbsoluteFill
        style={{ background: `radial-gradient(50% 40% at 50% 40%, ${c.primary}44, transparent 70%)` }}
      />
      {config.intro3d ? (
        <ThreeCanvas width={width} height={height} camera={{ position: [0, 0, 5], fov: 55 }} style={{ position: "absolute" }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 6, 5]} intensity={2.4} />
          <pointLight position={[-5, -3, 2]} intensity={30} color={c.primary} />
          <Knot />
        </ThreeCanvas>
      ) : null}
      <AbsoluteFill
        style={{ fontFamily: config.brand.fontFamily }}
        className="items-center justify-end pb-[20%] text-center"
      >
        <h1
          style={{ opacity: titleIn, transform: `translateY(${(1 - titleIn) * 30}px)`, color: c.text }}
          className="text-[110px] font-black leading-[0.9] tracking-tight"
        >
          {lines.map((l, i) => (
            <span key={i} className="block">
              {l}
            </span>
          ))}
        </h1>
        <p style={{ opacity: titleIn, color: automarketColors.amber }} className="mt-6 text-5xl font-bold">
          {config.introSubtitle}
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Rótulo inferior ─────────────────────────────────────────────────────────
const LowerThird: React.FC<{ config: FxConfig }> = ({ config }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = config.brand.colors;
  // Dentro de <Sequence> el frame ya es relativo al inicio del rótulo.
  const inn = spring({ frame, fps, config: { damping: 200 } });
  const x = interpolate(inn, [0, 1], [-700, 0]);

  return (
    <div
      style={{ position: "absolute", left: 48, bottom: "22%", transform: `translateX(${x}px)`, opacity: inn, fontFamily: config.brand.fontFamily }}
      className="flex items-center gap-4"
    >
      <div style={{ backgroundColor: c.primary }} className="h-14 w-3 rounded-full" />
      <span
        style={{ backgroundColor: "#000000aa", color: c.text }}
        className="rounded-2xl px-7 py-4 text-5xl font-black backdrop-blur-sm"
      >
        {config.lowerThird}
      </span>
    </div>
  );
};

// ── Sticker/keyword temporizado ─────────────────────────────────────────────
const Chip: React.FC<{ config: FxConfig; text: string; from: number; dur: number; row: number }> = ({
  config,
  text,
  from,
  dur,
  row,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = config.brand.colors;

  const appear = spring({ frame: frame - from, fps, config: { damping: 14, mass: 0.5 } });
  const disappear = interpolate(frame, [from + dur - 8, from + dur], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = appear * disappear;
  const scale = interpolate(appear, [0, 1], [0.7, 1]);

  return (
    <div
      style={{
        position: "absolute",
        top: `${26 + row * 11}%`,
        left: 0,
        right: 0,
        opacity,
        transform: `scale(${scale})`,
        fontFamily: config.brand.fontFamily,
      }}
      className="flex justify-center px-12"
    >
      <span
        style={{ backgroundColor: c.primary, color: "#fff", boxShadow: `0 12px 40px ${c.primary}66` }}
        className="rounded-2xl px-8 py-4 text-4xl font-extrabold"
      >
        {text}
      </span>
    </div>
  );
};

// ── Cierre ──────────────────────────────────────────────────────────────────
const Outro: React.FC<{ config: FxConfig }> = ({ config }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const c = config.brand.colors;
  const start = durationInFrames - OUTRO_FRAMES;
  const inn = spring({ frame: frame - start, fps, config: { damping: 200 } });
  const y = interpolate(inn, [0, 1], [400, 0]);
  const pulse = 1 + Math.sin(frame / 12) * 0.03;

  return (
    <AbsoluteFill style={{ opacity: inn }}>
      <AbsoluteFill style={{ backgroundColor: `${c.background}cc` }} />
      <AbsoluteFill
        style={{ transform: `translateY(${y}px)`, fontFamily: config.brand.fontFamily }}
        className="items-center justify-center px-16 text-center"
      >
        <h2 style={{ color: c.text }} className="mb-10 text-[104px] font-black leading-[0.9] tracking-tight">
          {config.outroTitle}
        </h2>
        <div
          style={{ backgroundColor: c.primary, transform: `scale(${pulse})` }}
          className="rounded-full px-14 py-7 text-6xl font-extrabold text-white"
        >
          {config.outroCta}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Composición ─────────────────────────────────────────────────────────────
export const VideoWithFX: React.FC<VideoWithFXProps> = (props) => {
  const { fps, durationInFrames } = useVideoConfig();
  const config: FxConfig = {
    ...fxConfig,
    ...props.config,
    videoSrc: resolveVideoSrc(props),
  };

  if (!config.videoSrc) {
    return (
      <AbsoluteFill
        style={{ backgroundColor: "#0b0b13", fontFamily: config.brand.fontFamily }}
        className="items-center justify-center px-20 text-center"
      >
        <p className="text-5xl font-bold leading-snug text-white/80">
          Ejecuta <span className="text-cyan-400">npm run fx -- tu-video.mp4</span> para añadir efectos.
        </p>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo src={staticFile(config.videoSrc)} />

      {/* Stickers temporizados. */}
      {config.chips.map((chip, i) => (
        <Chip
          key={i}
          config={config}
          text={chip.text}
          from={Math.round(chip.atSeconds * fps)}
          dur={Math.round((chip.durationSeconds ?? 2.5) * fps)}
          row={i % 2}
        />
      ))}

      {/* Rótulo (aparece tras la intro, se va antes del cierre). */}
      <Sequence from={INTRO_FRAMES} durationInFrames={durationInFrames - INTRO_FRAMES - OUTRO_FRAMES}>
        <LowerThird config={config} />
      </Sequence>

      {/* Intro 3D. */}
      <Sequence durationInFrames={INTRO_FRAMES}>
        <Intro3D config={config} />
      </Sequence>

      {/* Cierre. */}
      <Outro config={config} />
    </AbsoluteFill>
  );
};
