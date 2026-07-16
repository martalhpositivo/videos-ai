import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { BrandColors } from "../config/types";

/**
 * Full-bleed animated brand background for a single scene. Blends the brand
 * gradient with the scene's accent and drifts two soft glows so the frame
 * never feels static.
 */
export const Background: React.FC<{
  colors: BrandColors;
  accent: string;
}> = ({ colors, accent }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const angle = interpolate(frame, [0, durationInFrames], [130, 210]);
  const drift = interpolate(frame, [0, durationInFrames], [0, 25]);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <AbsoluteFill
        style={{
          background: `linear-gradient(${angle}deg, ${colors.primary}22, ${colors.background} 55%, ${colors.secondary}1f)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 45% at ${28 + drift}% 22%, ${accent}44, transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(55% 45% at ${74 - drift}% 82%, ${colors.secondary}3a, transparent 70%)`,
        }}
      />
      {/* Fine grain vignette for depth + contrast. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 42%, transparent 42%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
