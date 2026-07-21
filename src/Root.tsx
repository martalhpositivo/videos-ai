import "./index.css";
import { Composition } from "remotion";
import { ProductivityReel } from "./ProductivityReel";
import { reelConfig } from "./config/reel.config";
import { automarketReelConfig } from "./config/brands/automarket-durango";
import { AutomarketCar } from "./AutomarketCar";
import { carConfig } from "./config/car.config";
import { Scene3D } from "./Scene3D";
import { VideoWithFX, calculateVideoWithFxMetadata } from "./VideoWithFX";
import { fxConfig } from "./config/fx.config";
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

      {/* Reel de marca Automarket Durango (identidad visual real). */}
      <Composition
        id="AutomarketReel"
        component={ProductivityReel}
        durationInFrames={totalDuration(automarketReelConfig)}
        fps={automarketReelConfig.fps}
        width={automarketReelConfig.width}
        height={automarketReelConfig.height}
        defaultProps={{ config: automarketReelConfig }}
      />

      {/* Ficha "Coche de la semana" (100% desde car.config.ts). */}
      <Composition
        id="AutomarketCar"
        component={AutomarketCar}
        durationInFrames={carConfig.durationInSeconds * carConfig.fps}
        fps={carConfig.fps}
        width={carConfig.width}
        height={carConfig.height}
        defaultProps={{ config: carConfig }}
      />

      {/* Intro 3D de marca (Three.js). */}
      <Composition
        id="Scene3D"
        component={Scene3D}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Efectos (intro 3D + rótulos + stickers) sobre un video (via `npm run fx`). */}
      <Composition
        id="VideoWithFX"
        component={VideoWithFX}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ config: fxConfig }}
        calculateMetadata={calculateVideoWithFxMetadata}
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
