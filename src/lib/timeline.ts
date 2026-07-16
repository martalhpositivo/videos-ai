import type { ReelConfig, SceneConfig } from "../config/types";

const DEFAULT_TRANSITION_FRAMES = 15;

/** Frames a scene occupies before transition overlap. */
export const sceneFrames = (scene: SceneConfig, fps: number): number =>
  Math.round(scene.durationInSeconds * fps);

/** Frames the outgoing transition of a scene lasts (0 if none). */
export const transitionFrames = (scene: SceneConfig): number => {
  const t = scene.transition;
  if (!t || t.type === "none") {
    return 0;
  }
  return t.durationInFrames ?? DEFAULT_TRANSITION_FRAMES;
};

/**
 * Total composition duration. Transitions overlap their two neighbouring
 * scenes, so the timeline is shorter than the naive sum of scene durations.
 */
export const totalDuration = (config: ReelConfig): number => {
  const scenes = config.scenes;
  const sumScenes = scenes.reduce((s, sc) => s + sceneFrames(sc, config.fps), 0);
  const sumTransitions = scenes.reduce((s, sc) => s + transitionFrames(sc), 0);
  return sumScenes - sumTransitions;
};

/**
 * Non-overlapping segment lengths for the progress bar — each scene minus half
 * of each adjacent transition, so the segments exactly tile the timeline.
 */
export const progressSegments = (config: ReelConfig): number[] => {
  const { scenes, fps } = config;
  return scenes.map((scene, i) => {
    const leftHalf = i > 0 ? transitionFrames(scenes[i - 1]) / 2 : 0;
    const rightHalf = transitionFrames(scene) / 2;
    return sceneFrames(scene, fps) - leftHalf - rightHalf;
  });
};
