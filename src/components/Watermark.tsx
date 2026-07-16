import React from "react";
import { useCurrentFrame } from "remotion";
import type { BrandConfig } from "../config/types";

/** Persistent brand handle pinned to the bottom of the reel. */
export const Watermark: React.FC<{ brand: BrandConfig }> = ({ brand }) => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 20) * 0.025;

  return (
    <div className="absolute bottom-[70px] left-0 right-0 flex justify-center">
      <div
        style={{
          transform: `scale(${pulse})`,
          backgroundColor: brand.colors.surface,
          color: brand.colors.text,
          fontFamily: brand.fontFamily,
        }}
        className="flex items-center gap-3 rounded-full px-9 py-4 text-4xl font-bold tracking-wide backdrop-blur-md"
      >
        <span>{brand.logoEmoji}</span>
        <span>{brand.handle}</span>
      </div>
    </div>
  );
};
