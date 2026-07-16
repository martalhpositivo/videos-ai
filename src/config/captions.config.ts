import { automarketBrand, automarketColors } from "./brands/automarket-durango";

/**
 * Estilo de los subtítulos que se QUEMAN sobre un video existente
 * (flujo `npm run subtitle`). Actualmente usa la marca Automarket Durango.
 *
 * Para subtitular con otra marca, cambia el import de arriba por otra marca
 * de `./brands/` (o edita los valores directamente).
 */
export const captionsConfig = {
  fps: 30,

  fontFamily: automarketBrand.fontFamily,

  /** Palabra que se está diciendo: ámbar de Automarket (máximo contraste sobre video). */
  activeColor: automarketColors.amber,
  /** Resto de palabras de la línea. */
  textColor: "#ffffff",
  /** Contorno para que se lean sobre cualquier fondo. */
  strokeColor: "#000000",
  strokeWidth: 12,

  fontSize: 92,
  uppercase: true,

  /** Degradado sutil detrás de los subtítulos para que se lean sobre cualquier video. */
  scrim: true,

  /** "bottom" | "center" — dónde se colocan los subtítulos. */
  position: "bottom" as "bottom" | "center",

  /**
   * Palabras cercanas (dentro de estos milisegundos) se agrupan en una misma
   * "página" de subtítulo, estilo TikTok. Súbelo para líneas más largas.
   */
  combineTokensWithinMilliseconds: 1200,
};

export type CaptionsConfig = typeof captionsConfig;
