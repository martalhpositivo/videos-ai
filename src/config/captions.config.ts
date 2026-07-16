import { reelConfig } from "./reel.config";

/**
 * Estilo de los subtítulos que se QUEMAN sobre un video existente
 * (flujo `npm run subtitle`). Edita libremente — hereda los colores de marca
 * de reel.config.ts para mantener consistencia.
 */
export const captionsConfig = {
  fps: 30,

  fontFamily: reelConfig.brand.fontFamily,

  /** Color de la palabra que se está diciendo en ese instante. */
  activeColor: reelConfig.brand.colors.accent,
  /** Color del resto de palabras de la línea. */
  textColor: "#ffffff",
  /** Contorno para que se lean sobre cualquier fondo. */
  strokeColor: "#000000",
  strokeWidth: 12,

  fontSize: 92,
  uppercase: true,

  /** "bottom" | "center" — dónde se colocan los subtítulos. */
  position: "bottom" as "bottom" | "center",

  /**
   * Palabras cercanas (dentro de estos milisegundos) se agrupan en una misma
   * "página" de subtítulo, estilo TikTok. Súbelo para líneas más largas.
   */
  combineTokensWithinMilliseconds: 1200,
};

export type CaptionsConfig = typeof captionsConfig;
