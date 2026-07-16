import "./index.css";
import { Composition } from "remotion";
import { ProductivityReel } from "./ProductivityReel";
import { reelConfig } from "./config/reel.config";
import { totalDuration } from "./lib/timeline";
import {
  VideoWithCaptions,
  calculateVideoWithCaptionsMetadata,
} from "./VideoWithCaptions";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Plantilla de reel de productividad (100% desde reel.config.ts). */}
      <Composition
        id="ProductivityReel"
        component={ProductivityReel}
        durationInFrames={totalDuration(reelConfig)}
        fps={reelConfig.fps}
        width={reelConfig.width}
        height={reelConfig.height}
        defaultProps={{ config: reelConfig }}
      />

      {/* Subtítulos automáticos quemados sobre un video (via `npm run subtitle`). */}
      <Composition
        id="VideoWithCaptions"
        component={VideoWithCaptions}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoSrc: "", captions: [] }}
        calculateMetadata={calculateVideoWithCaptionsMetadata}
      />
    </>
  );
};
