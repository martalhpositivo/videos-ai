import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  createTikTokStyleCaptions,
  type Caption,
} from "@remotion/captions";
import type { CaptionsConfig } from "../config/captions.config";

/**
 * TikTok-style animated captions burned over a video.
 *
 * Takes word-level `Caption[]` (produced by Whisper via the `subtitle` script),
 * groups them into "pages" with @remotion/captions, and highlights each word
 * exactly when it's spoken — driven purely off useCurrentFrame() so it never
 * flickers and renders deterministically.
 */
export const BurnedCaptions: React.FC<{
  captions: Caption[];
  config: CaptionsConfig;
}> = ({ captions, config }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nowMs = (frame / fps) * 1000;

  const { pages } = createTikTokStyleCaptions({
    captions,
    combineTokensWithinMilliseconds: config.combineTokensWithinMilliseconds,
  });

  // The page currently on screen.
  const page = pages.find(
    (p) => nowMs >= p.startMs && nowMs < p.startMs + p.durationMs,
  );
  if (!page) {
    return null;
  }

  // Whole-page entrance pop.
  const appear = spring({
    frame: frame - (page.startMs / 1000) * fps,
    fps,
    config: { damping: 200, mass: 0.5 },
  });
  const enterY = interpolate(appear, [0, 1], [40, 0]);

  const anchor =
    config.position === "center"
      ? { top: "50%", transform: "translateY(-50%)" }
      : { bottom: "18%" };

  const stroke = `${config.strokeWidth}px ${config.strokeColor}`;

  const scrimGradient =
    config.position === "center"
      ? "radial-gradient(60% 30% at 50% 50%, rgba(0,0,0,0.55), transparent 70%)"
      : "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.35) 18%, transparent 40%)";

  return (
    <AbsoluteFill style={{ fontFamily: config.fontFamily }}>
      {config.scrim ? (
        <AbsoluteFill style={{ background: scrimGradient, opacity: appear }} />
      ) : null}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          ...anchor,
          opacity: appear,
        }}
        className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 px-16 text-center"
      >
        {page.tokens.map((token, i) => {
          const isActive = nowMs >= token.fromMs && nowMs < token.toMs;
          const isSpoken = nowMs >= token.fromMs;

          const pop = isActive
            ? spring({
                frame: frame - (token.fromMs / 1000) * fps,
                fps,
                config: { damping: 12, mass: 0.4 },
              })
            : 1;
          const scale = interpolate(pop, [0, 1], [0.8, 1]);

          const text = config.uppercase
            ? token.text.toUpperCase()
            : token.text;

          return (
            <span
              key={i}
              style={{
                fontSize: config.fontSize,
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
                color: isActive ? config.activeColor : config.textColor,
                opacity: isSpoken ? 1 : 0.6,
                transform: `translateY(${isActive ? enterY : 0}px) scale(${isActive ? scale : 1})`,
                WebkitTextStroke: stroke,
                paintOrder: "stroke fill",
                display: "inline-block",
              }}
            >
              {text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
