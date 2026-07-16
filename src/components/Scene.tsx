import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { BrandConfig, CaptionStyle, SceneConfig } from "../config/types";
import { Background } from "./Background";
import { Captions } from "./Captions";

/**
 * A single reel scene: brand background, focal emoji with an accent glow,
 * kicker pill, headline and auto-timed subtitles. All entrances use spring
 * physics and stagger in for a polished, professional feel.
 */
export const Scene: React.FC<{
  scene: SceneConfig;
  brand: BrandConfig;
  captionStyle: CaptionStyle;
}> = ({ scene, brand, captionStyle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const accent = scene.accent ?? brand.colors.accent;

  const enter = (delay: number) =>
    spring({ frame: frame - delay, fps, config: { damping: 200, mass: 0.6 } });

  const emojiIn = enter(2);
  const kickerIn = enter(8);
  const titleIn = enter(12);

  const float = Math.sin(frame / 16) * 10;
  const emojiScale = interpolate(emojiIn, [0, 1], [0.5, 1]);

  const lines = scene.title.split("\n");

  return (
    <AbsoluteFill style={{ fontFamily: brand.fontFamily }}>
      <Background colors={brand.colors} accent={accent} />

      <AbsoluteFill className="items-center justify-center px-16 text-center">
        {/* Focal emoji with accent glow. */}
        <div
          style={{
            transform: `translateY(${float - (1 - emojiIn) * 50}px) scale(${emojiScale})`,
            opacity: emojiIn,
          }}
          className="relative mb-12"
        >
          <div
            style={{ backgroundColor: accent }}
            className="absolute inset-0 -z-10 rounded-full opacity-40 blur-[90px]"
          />
          <span style={{ fontSize: 190, lineHeight: 1 }}>{scene.emoji}</span>
        </div>

        {/* Kicker pill. */}
        <div
          style={{
            transform: `translateY(${(1 - kickerIn) * 28}px)`,
            opacity: kickerIn,
            borderColor: `${accent}80`,
            color: accent,
            backgroundColor: brand.colors.surface,
          }}
          className="mb-7 rounded-full border-2 px-8 py-3 text-4xl font-extrabold uppercase tracking-[0.18em] backdrop-blur-sm"
        >
          {scene.kicker}
        </div>

        {/* Headline. */}
        <h1
          style={{
            transform: `translateY(${(1 - titleIn) * 36}px)`,
            opacity: titleIn,
            color: brand.colors.text,
          }}
          className="text-[118px] font-black leading-[0.95] tracking-tight"
        >
          {lines.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </h1>
      </AbsoluteFill>

      {/* Automatic subtitles. */}
      <Captions text={scene.captions} style={captionStyle} accent={accent} />
    </AbsoluteFill>
  );
};
