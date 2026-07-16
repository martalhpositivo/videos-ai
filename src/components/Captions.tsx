import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { CaptionStyle } from "../config/types";

/**
 * Automatic subtitles.
 *
 * Give it a line of text and it splits it into words, distributes them evenly
 * across the scene's duration, shows them in karaoke-style groups and
 * highlights the word that is "being spoken" at the current frame — no manual
 * timing needed. (When you wire real audio via the remotion-superpowers
 * /add-captions command, you can swap this even distribution for Whisper
 * word-level timestamps.)
 */

const POSITION_STYLE: Record<CaptionStyle["position"], React.CSSProperties> = {
  top: { top: "16%", bottom: "auto" },
  center: { top: "50%", bottom: "auto", transform: "translateY(-50%)" },
  bottom: { bottom: "16%", top: "auto" },
};

export const Captions: React.FC<{
  text: string;
  style: CaptionStyle;
  accent: string;
  /** Frames to wait before subtitles start within the scene. */
  startAt?: number;
  /** Total frames the subtitles should span. Defaults to full scene. */
  windowFrames?: number;
}> = ({ text, style, accent, startAt = 6, windowFrames }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const words = text.split(/\s+/).filter(Boolean);
  if (!style.enabled || words.length === 0) {
    return null;
  }

  const span = (windowFrames ?? durationInFrames) - startAt;
  const perWord = span / words.length;
  const local = frame - startAt;

  // Which word is "active" right now.
  const active = Math.max(
    0,
    Math.min(words.length - 1, Math.floor(local / perWord)),
  );

  // Karaoke chunking: show the group the active word belongs to.
  const group = Math.floor(active / style.wordsPerGroup);
  const groupStart = group * style.wordsPerGroup;
  const groupWords = words.slice(groupStart, groupStart + style.wordsPerGroup);

  // The caption block fades in ONCE at the start of the scene; after that,
  // groups cut instantly (like real captions) so there is no per-group blink.
  const blockIn = spring({
    frame: frame - startAt,
    fps,
    config: { damping: 200, mass: 0.5 },
  });

  const highlight = style.highlightColor ?? accent;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        ...POSITION_STYLE[style.position],
        opacity: blockIn,
      }}
      className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-16 text-center"
    >
      {groupWords.map((word, i) => {
        const globalIndex = groupStart + i;
        const isActive = globalIndex === active;
        const isSpoken = globalIndex <= active;

        // Little pop on the active word.
        const pop = isActive
          ? spring({
              frame: frame - (startAt + globalIndex * perWord),
              fps,
              config: { damping: 12, mass: 0.4 },
            })
          : 1;
        const scale = interpolate(pop, [0, 1], [0.85, 1]);

        return (
          <span
            key={`${group}-${i}`}
            style={{
              fontSize: style.fontSize,
              lineHeight: 1.1,
              fontWeight: 900,
              color: isActive ? highlight : style.textColor,
              opacity: isSpoken ? 1 : 0.55,
              transform: `scale(${isActive ? scale : 1})`,
              textShadow: "0 4px 24px rgba(0,0,0,0.55)",
              letterSpacing: "-0.01em",
              display: "inline-block",
            }}
          >
            {style.uppercase ? word.toUpperCase() : word}
          </span>
        );
      })}
    </div>
  );
};
