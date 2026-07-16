import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import {
  linearTiming,
  TransitionPresentation,
  TransitionSeries,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { flip } from "@remotion/transitions/flip";

import type { ReelConfig, TransitionConfig } from "./config/types";
import { reelConfig } from "./config/reel.config";
import { Scene } from "./components/Scene";
import { ProgressBar } from "./components/ProgressBar";
import { Watermark } from "./components/Watermark";
import { progressSegments, sceneFrames, transitionFrames } from "./lib/timeline";

/** Map a config transition to a Remotion presentation. */
const presentationFor = (
  t: TransitionConfig,
  width: number,
  height: number,
): TransitionPresentation<Record<string, unknown>> => {
  const direction = t.direction ?? "from-right";
  switch (t.type) {
    case "slide":
      return slide({ direction }) as never;
    case "wipe":
      return wipe({ direction }) as never;
    case "clockWipe":
      return clockWipe({ width, height }) as never;
    case "flip":
      return flip() as never;
    case "fade":
    default:
      return fade() as never;
  }
};

export const ProductivityReel: React.FC<{ config?: ReelConfig }> = ({
  config = reelConfig,
}) => {
  const { scenes, brand, captionStyle, width, height, music } = config;
  const segments = progressSegments(config);

  return (
    <AbsoluteFill style={{ backgroundColor: brand.colors.background }}>
      <TransitionSeries>
        {scenes.flatMap((scene, i) => {
          const nodes: React.ReactNode[] = [
            <TransitionSeries.Sequence
              key={`scene-${scene.id}`}
              durationInFrames={sceneFrames(scene, config.fps)}
            >
              <Scene
                scene={scene}
                brand={brand}
                captionStyle={captionStyle}
              />
            </TransitionSeries.Sequence>,
          ];

          const t = scene.transition;
          if (t && t.type !== "none" && i < scenes.length - 1) {
            nodes.push(
              <TransitionSeries.Transition
                key={`trans-${scene.id}`}
                presentation={presentationFor(t, width, height)}
                timing={linearTiming({ durationInFrames: transitionFrames(scene) })}
              />,
            );
          }
          return nodes;
        })}
      </TransitionSeries>

      {/* Persistent overlays on top of the transitioning scenes. */}
      {config.progressBar.enabled ? (
        <ProgressBar segments={segments} color={brand.colors.primary} />
      ) : null}
      {config.watermark?.enabled ? <Watermark brand={brand} /> : null}

      {/* Optional background music. */}
      {music.src ? (
        <Audio src={staticFile(music.src)} volume={() => music.volume} />
      ) : null}
    </AbsoluteFill>
  );
};
