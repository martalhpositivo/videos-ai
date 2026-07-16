import React from "react";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  OffthreadVideo,
  staticFile,
} from "remotion";
import { parseMedia } from "@remotion/media-parser";
import type { Caption } from "@remotion/captions";
import { BurnedCaptions } from "./components/BurnedCaptions";
import { captionsConfig } from "./config/captions.config";

export type VideoWithCaptionsProps = {
  /** File name under public/ of the source video (set by the subtitle script). */
  videoSrc: string;
  /** Word-level captions produced by Whisper. */
  captions: Caption[];
};

/**
 * Reads the source video's real dimensions, duration and fps so the output
 * matches the input exactly — works for any clip (vertical, square, landscape).
 */
export const calculateVideoWithCaptionsMetadata: CalculateMetadataFunction<
  VideoWithCaptionsProps
> = async ({ props }) => {
  if (!props.videoSrc) {
    return { durationInFrames: 150, fps: 30, width: 1080, height: 1920 };
  }

  const { dimensions, slowDurationInSeconds, fps } = await parseMedia({
    src: staticFile(props.videoSrc),
    fields: { dimensions: true, slowDurationInSeconds: true, fps: true },
    acknowledgeRemotionLicense: true,
  });

  const useFps = fps ?? 30;
  return {
    fps: useFps,
    durationInFrames: Math.max(1, Math.ceil(slowDurationInSeconds * useFps)),
    width: dimensions?.width ?? 1080,
    height: dimensions?.height ?? 1920,
  };
};

export const VideoWithCaptions: React.FC<VideoWithCaptionsProps> = ({
  videoSrc,
  captions,
}) => {
  if (!videoSrc) {
    // Shown in the Studio until you run the subtitle script with a real video.
    return (
      <AbsoluteFill
        style={{ backgroundColor: "#0b0b13", fontFamily: captionsConfig.fontFamily }}
        className="items-center justify-center px-20 text-center"
      >
        <p className="text-5xl font-bold leading-snug text-white/80">
          Ejecuta{" "}
          <span className="text-cyan-400">npm run subtitle -- tu-video.mov</span>{" "}
          para subtitular un video.
        </p>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo src={staticFile(videoSrc)} />
      <BurnedCaptions captions={captions} config={captionsConfig} />
    </AbsoluteFill>
  );
};
