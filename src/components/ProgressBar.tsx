import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

/**
 * Instagram-story-style segmented progress bar — one segment per scene,
 * filling in real time. Sits on top of everything as a persistent overlay.
 */
export const ProgressBar: React.FC<{
  segments: number[]; // duration of each scene in frames
  color: string;
}> = ({ segments, color }) => {
  const frame = useCurrentFrame();
  let elapsed = 0;

  return (
    <div className="absolute left-0 right-0 top-[64px] flex gap-2 px-10">
      {segments.map((dur, i) => {
        const start = elapsed;
        elapsed += dur;
        const fill = interpolate(frame, [start, start + dur], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/25"
          >
            <div
              style={{ width: `${fill * 100}%`, backgroundColor: color }}
              className="h-full rounded-full"
            />
          </div>
        );
      })}
    </div>
  );
};
