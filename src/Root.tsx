import "./index.css";
import { Composition } from "remotion";
import { InstagramReel, REEL, REEL_DURATION } from "./InstagramReel";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="InstagramReel"
        component={InstagramReel}
        durationInFrames={REEL_DURATION}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={REEL}
      />
    </>
  );
};
