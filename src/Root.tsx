import "./index.css";
import { Composition } from "remotion";
import { ProductivityReel } from "./ProductivityReel";
import { reelConfig } from "./config/reel.config";
import { totalDuration } from "./lib/timeline";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ProductivityReel"
        component={ProductivityReel}
        durationInFrames={totalDuration(reelConfig)}
        fps={reelConfig.fps}
        width={reelConfig.width}
        height={reelConfig.height}
        defaultProps={{ config: reelConfig }}
      />
    </>
  );
};
