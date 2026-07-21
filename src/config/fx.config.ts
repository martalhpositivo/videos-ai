import { automarketBrand } from "./brands/automarket-durango";
import type { BrandConfig } from "./types";

/**
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  EFECTOS SOBRE UN VIDEO — intro 3D, rótulos y "stickers" animados.    │
 * │  Composición `VideoWithFX`. Se aplica a cualquier video para hacerlo  │
 * │  más atractivo para reels. Edita solo este archivo.                   │
 * │                                                                       │
 * │  El video se pasa por la CLI:  npm run fx -- tu-video.mp4             │
 * └─────────────────────────────────────────────────────────────────────┘
 */
export interface FxChip {
  /** Texto del sticker (puedes empezar con un emoji). */
  text: string;
  /** Segundo en el que aparece. */
  atSeconds: number;
  /** Segundos que permanece en pantalla (por defecto 2.5). */
  durationSeconds?: number;
}

export interface FxConfig {
  fps: number;
  brand: BrandConfig;
  /** Ruta bajo public/ del video (la pone la CLI). Vacío = placeholder. */
  videoSrc: string;
  /** Intro 3D los primeros segundos. */
  intro3d: boolean;
  introTitle: string;
  introSubtitle: string;
  /** Rótulo (lower-third) que aparece tras la intro. */
  lowerThird: string;
  /** Stickers/keywords que van apareciendo sobre el video. */
  chips: FxChip[];
  /** Tarjeta de cierre. */
  outroTitle: string;
  outroCta: string;
}

export const fxConfig: FxConfig = {
  fps: 30,
  brand: automarketBrand,

  videoSrc: "", // ← lo rellena `npm run fx -- tu-video.mp4`

  intro3d: true,
  introTitle: "Papeles\ne impuestos",
  introSubtitle: "Todo lo que necesitas saber",

  lowerThird: "Comprar coche sin sustos",

  chips: [
    { text: "📄 Contrato de compraventa", atSeconds: 3 },
    { text: "🧾 Impuesto de transmisiones (ITP)", atSeconds: 6.5 },
    { text: "🔑 Cambio de titularidad", atSeconds: 10 },
    { text: "✅ Nosotros lo gestionamos", atSeconds: 13.5 },
  ],

  outroTitle: "¿Te lo gestionamos?",
  outroCta: "Escríbenos por DM",
};
