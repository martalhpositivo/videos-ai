import React from "react";
import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * Instagram vertical reel — 1080x1920, 30fps, 30s (900 frames).
 *
 * A data-driven, brand-agnostic template. Edit `REEL` below (or pass
 * `defaultProps` from Root.tsx) to change the story without touching the
 * animation code. Each scene fades through the animated background, so scenes
 * never visually overlap.
 */

// ---------------------------------------------------------------------------
// Content — edit this to change the reel.
// ---------------------------------------------------------------------------

export type Scene = {
  /** Small uppercase label above the headline. */
  kicker: string;
  /** Big headline. Use \n for manual line breaks. */
  title: string;
  /** Supporting line under the headline. */
  subtitle?: string;
  /** Large emoji / glyph shown as the scene's focal art. */
  glyph: string;
  /** Accent color used for the kicker, glyph glow and progress fill. */
  accent: string;
  /** Length of the scene in frames. */
  durationInFrames: number;
};

export type ReelProps = {
  handle: string;
  scenes: Scene[];
};

export const REEL: ReelProps = {
  handle: "@videos.ai",
  scenes: [
    {
      kicker: "Say goodbye to editing",
      title: "Stop editing\nfor hours.",
      subtitle: "There's a faster way to make videos.",
      glyph: "🎬",
      accent: "#f43f5e",
      durationInFrames: 120, // 0–4s
    },
    {
      kicker: "Step 1",
      title: "Type a\nprompt.",
      subtitle: "Describe the video you want in one sentence.",
      glyph: "✍️",
      accent: "#8b5cf6",
      durationInFrames: 150, // 4–9s
    },
    {
      kicker: "Step 2",
      title: "Get an AI\nvoiceover.",
      subtitle: "Studio-quality narration, no microphone.",
      glyph: "🎙️",
      accent: "#3b82f6",
      durationInFrames: 150, // 9–14s
    },
    {
      kicker: "Step 3",
      title: "Add viral\ncaptions.",
      subtitle: "Word-by-word captions that keep people watching.",
      glyph: "💬",
      accent: "#22c55e",
      durationInFrames: 150, // 14–19s
    },
    {
      kicker: "Step 4",
      title: "Render in\nminutes.",
      subtitle: "Export in 4K, ready for Reels, Shorts & TikTok.",
      glyph: "⚡",
      accent: "#f59e0b",
      durationInFrames: 180, // 19–25s
    },
    {
      kicker: "Your turn",
      title: "Make your\nfirst video.",
      subtitle: "Free to start — no card required.",
      glyph: "🚀",
      accent: "#ec4899",
      durationInFrames: 150, // 25–30s
    },
  ],
};

// ---------------------------------------------------------------------------
// Small animation helpers.
// ---------------------------------------------------------------------------

/** Spring in the [0,1] range, driven from a given frame offset. */
const useEnter = (delay = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, mass: 0.6 },
  });
};

// ---------------------------------------------------------------------------
// Background — a slowly rotating multi-stop gradient that drifts across the
// whole reel so scenes feel connected.
// ---------------------------------------------------------------------------

const Background: React.FC<{ accents: string[] }> = ({ accents }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = frame / durationInFrames;

  const from = interpolateColors(
    progress,
    accents.map((_, i) => i / (accents.length - 1)),
    accents,
  );
  const angle = interpolate(frame, [0, durationInFrames], [135, 245]);
  const drift = interpolate(frame, [0, durationInFrames], [0, 40]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a12" }}>
      <AbsoluteFill
        style={{
          background: `linear-gradient(${angle}deg, ${from}22, #0a0a12 60%)`,
        }}
      />
      {/* Two soft glowing blobs that slowly drift. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${30 + drift}% ${25}%, ${from}55, transparent 45%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${70 - drift}% ${80}%, ${from}33, transparent 40%)`,
        }}
      />
      {/* Subtle vignette for contrast. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 45%, transparent 40%, #00000099 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Progress bar — segmented, one segment per scene, filling as it plays.
// ---------------------------------------------------------------------------

const ProgressBar: React.FC<{ scenes: Scene[]; accent: string }> = ({
  scenes,
  accent,
}) => {
  const frame = useCurrentFrame();
  let elapsed = 0;

  return (
    <div className="absolute left-0 right-0 top-[70px] flex gap-2 px-12">
      {scenes.map((s, i) => {
        const start = elapsed;
        elapsed += s.durationInFrames;
        const fill = interpolate(frame, [start, elapsed], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/20"
          >
            <div
              style={{
                width: `${fill * 100}%`,
                backgroundColor: accent,
              }}
              className="h-full rounded-full"
            />
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------
// A single scene — glyph, kicker, headline, subtitle. Fades in and out so it
// dissolves through the shared background between scenes.
// ---------------------------------------------------------------------------

const SceneCard: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Fade in over the first 12 frames, out over the last 12.
  const opacity = interpolate(
    frame,
    [0, 12, durationInFrames - 12, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const glyphIn = useEnter(2);
  const kickerIn = useEnter(8);
  const titleIn = useEnter(12);
  const subIn = useEnter(22);

  // Gentle float on the glyph.
  const float = Math.sin(frame / 14) * 12;
  const glyphScale = interpolate(glyphIn, [0, 1], [0.4, 1]);

  const lines = scene.title.split("\n");

  return (
    <AbsoluteFill
      style={{ opacity }}
      className="items-center justify-center px-16 text-center"
    >
      {/* Focal glyph with an accent glow. */}
      <div
        style={{
          transform: `translateY(${float - (1 - glyphIn) * 60}px) scale(${glyphScale})`,
          opacity: glyphIn,
        }}
        className="relative mb-14"
      >
        <div
          style={{ backgroundColor: scene.accent }}
          className="absolute inset-0 -z-10 rounded-full opacity-40 blur-[80px]"
        />
        <span style={{ fontSize: 210, lineHeight: 1 }}>{scene.glyph}</span>
      </div>

      {/* Kicker pill. */}
      <div
        style={{
          transform: `translateY(${(1 - kickerIn) * 30}px)`,
          opacity: kickerIn,
          borderColor: `${scene.accent}66`,
          color: scene.accent,
        }}
        className="mb-8 rounded-full border-2 px-8 py-3 text-4xl font-bold uppercase tracking-[0.2em]"
      >
        {scene.kicker}
      </div>

      {/* Headline. */}
      <h1
        style={{
          transform: `translateY(${(1 - titleIn) * 40}px)`,
          opacity: titleIn,
        }}
        className="mb-10 text-[128px] font-black leading-[0.95] tracking-tight text-white"
      >
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </h1>

      {/* Subtitle. */}
      {scene.subtitle ? (
        <p
          style={{
            transform: `translateY(${(1 - subIn) * 24}px)`,
            opacity: subIn,
          }}
          className="max-w-[820px] text-5xl font-medium leading-tight text-white/70"
        >
          {scene.subtitle}
        </p>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Persistent brand handle at the bottom.
// ---------------------------------------------------------------------------

const Handle: React.FC<{ handle: string }> = ({ handle }) => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 18) * 0.03;
  return (
    <div className="absolute bottom-[90px] left-0 right-0 flex justify-center">
      <div
        style={{ transform: `scale(${pulse})` }}
        className="rounded-full bg-white/10 px-10 py-4 text-4xl font-bold tracking-wide text-white backdrop-blur-md"
      >
        {handle}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// The reel — composes background, scenes, progress bar and handle.
// ---------------------------------------------------------------------------

export const InstagramReel: React.FC<ReelProps> = ({ handle, scenes }) => {
  const accents = scenes.map((s) => s.accent);

  // Which scene is currently on screen (for the progress bar accent color).
  const frame = useCurrentFrame();
  let acc = 0;
  let currentAccent = scenes[0].accent;
  for (const s of scenes) {
    if (frame >= acc && frame < acc + s.durationInFrames) {
      currentAccent = s.accent;
      break;
    }
    acc += s.durationInFrames;
  }

  let start = 0;

  return (
    <AbsoluteFill className="font-sans">
      <Background accents={accents} />

      {scenes.map((scene, i) => {
        const from = start;
        start += scene.durationInFrames;
        return (
          <Sequence
            key={i}
            from={from}
            durationInFrames={scene.durationInFrames}
          >
            <SceneCard scene={scene} />
          </Sequence>
        );
      })}

      <ProgressBar scenes={scenes} accent={currentAccent} />
      <Handle handle={handle} />
    </AbsoluteFill>
  );
};

export const REEL_DURATION = REEL.scenes.reduce(
  (sum, s) => sum + s.durationInFrames,
  0,
);
