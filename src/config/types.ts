/**
 * Type definitions for the reel template.
 *
 * You normally don't need to touch this file — edit `reel.config.ts` instead.
 * These types just describe the shape of the config and power autocompletion.
 */

export type TransitionType =
  | "fade"
  | "slide"
  | "wipe"
  | "clockWipe"
  | "flip"
  | "none";

export type Direction =
  | "from-left"
  | "from-right"
  | "from-top"
  | "from-bottom";

export type CaptionPosition = "top" | "center" | "bottom";

export interface BrandColors {
  /** Main brand color — used for kickers, glows and the progress bar. */
  primary: string;
  /** Secondary brand color — used in the background gradient. */
  secondary: string;
  /** Highlight color for the active subtitle word. */
  accent: string;
  /** Page background (darkest). */
  background: string;
  /** Card / pill surfaces. */
  surface: string;
  /** Primary text. */
  text: string;
  /** Muted / secondary text. */
  muted: string;
}

export interface BrandConfig {
  name: string;
  /** Shown as the persistent watermark, e.g. "@tu.marca". */
  handle: string;
  /** Emoji shown next to the handle. */
  logoEmoji: string;
  colors: BrandColors;
  /** CSS font-family stack. */
  fontFamily: string;
}

export interface TransitionConfig {
  type: TransitionType;
  /** Only used by slide / wipe. */
  direction?: Direction;
  /** Transition length in frames. */
  durationInFrames?: number;
}

export interface SceneConfig {
  id: string;
  /** How long the scene stays on screen (before transition overlap). */
  durationInSeconds: number;
  /** Big focal emoji. */
  emoji: string;
  /** Small uppercase label above the headline. */
  kicker: string;
  /** Headline. Use \n for manual line breaks. */
  title: string;
  /** Optional per-scene accent that overrides the brand accent. */
  accent?: string;
  /**
   * The spoken line for this scene. Subtitles are generated and timed
   * automatically from this text — just write what's being said.
   * Leave empty ("") to hide subtitles for the scene.
   */
  captions: string;
  /** How this scene transitions INTO the next one. */
  transition?: TransitionConfig;
}

export interface CaptionStyle {
  enabled: boolean;
  position: CaptionPosition;
  fontSize: number;
  /** How many words are visible at once (karaoke-style chunking). */
  wordsPerGroup: number;
  /** Active-word color. Defaults to the scene accent when omitted. */
  highlightColor?: string;
  textColor: string;
  uppercase: boolean;
}

export interface MusicConfig {
  /** Path under public/, e.g. "music/track.mp3". null = no music. */
  src: string | null;
  /** 0–1. */
  volume: number;
}

export interface ReelConfig {
  fps: number;
  width: number;
  height: number;
  brand: BrandConfig;
  music: MusicConfig;
  captionStyle: CaptionStyle;
  progressBar: { enabled: boolean };
  scenes: SceneConfig[];
}
