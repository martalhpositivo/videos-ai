/* eslint-disable @remotion/non-pure-animation -- plain data file; `transition`
   keys are config, not runtime animations. */
import type { BrandConfig, ReelConfig } from "../types";

/**
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  MARCA: AUTOMARKET DURANGO (compraventa de coches, Durango-Bizkaia)   │
 * │                                                                       │
 * │  Identidad visual extraída de su propio plan de social media:         │
 * │  rojo #EB2026 como color principal, fondo casi negro #0D0D0F,         │
 * │  ámbar #FCB900 de acento, tipografía Inter en pesos altos.            │
 * └─────────────────────────────────────────────────────────────────────┘
 */

// Paleta oficial (de su design system CSS).
export const automarketColors = {
  red: "#EB2026",
  redDark: "#C91A1F",
  redLight: "#FF3B41",
  bg: "#0D0D0F",
  dark: "#1A1A1C",
  amber: "#FCB900",
  green: "#00D084",
  gray400: "#9A9A9C",
  white: "#FFFFFF",
} as const;

// Inter primero (su tipografía); cae a fuentes de sistema si no está instalada.
const INTER_STACK =
  '"Inter", "SF Pro Display", "Segoe UI", system-ui, -apple-system, sans-serif';

export const automarketBrand: BrandConfig = {
  name: "Automarket Durango",
  handle: "@automarketdurango",
  logoEmoji: "🚗",
  colors: {
    primary: automarketColors.red, // rojo de marca
    secondary: automarketColors.redLight, // segundo tono del degradado
    accent: automarketColors.red, // acento (kickers, glow, barra)
    background: automarketColors.bg, // fondo casi negro
    surface: "#ffffff14", // píldoras (blanco translúcido)
    text: automarketColors.white,
    muted: automarketColors.gray400,
  },
  fontFamily: INTER_STACK,
};

/**
 * Reel de marca listo para renderizar (composición "AutomarketReel").
 * Contenido basado en sus pilares: producto, taller/transparencia,
 * financiación y cierre. Edítalo libremente igual que reel.config.ts.
 */
export const automarketReelConfig: ReelConfig = {
  fps: 30,
  width: 1080,
  height: 1920,
  brand: automarketBrand,
  music: { src: null, volume: 0.35 },
  captionStyle: {
    enabled: true,
    position: "bottom",
    fontSize: 62,
    wordsPerGroup: 3,
    highlightColor: automarketColors.amber, // palabra activa en ámbar (contrasta)
    textColor: "#ffffff",
    uppercase: true,
  },
  progressBar: { enabled: true },
  scenes: [
    {
      id: "hook",
      durationInSeconds: 4,
      emoji: "🚗",
      kicker: "¿Buscas coche?",
      title: "Tu próximo\ncoche te espera.",
      accent: automarketColors.red,
      captions: "Buscas un coche de segunda mano en el que puedas confiar",
      transition: { type: "slide", direction: "from-right", durationInFrames: 15 },
    },
    {
      id: "taller",
      durationInSeconds: 4.5,
      emoji: "🔧",
      kicker: "Nuestro taller",
      title: "Revisado\npieza a pieza.",
      accent: automarketColors.amber,
      captions: "Revisamos cada coche en nuestro taller antes de venderlo",
      transition: { type: "wipe", direction: "from-bottom", durationInFrames: 15 },
    },
    {
      id: "transparencia",
      durationInSeconds: 4.5,
      emoji: "✅",
      kicker: "Transparencia",
      title: "Sin letra\npequeña.",
      accent: automarketColors.red,
      captions: "Te contamos el estado real del coche sin sorpresas ni sustos",
      transition: { type: "clockWipe", durationInFrames: 18 },
    },
    {
      id: "financiacion",
      durationInSeconds: 4.5,
      emoji: "💰",
      kicker: "Financiación",
      title: "A tu\nmedida.",
      accent: automarketColors.amber,
      captions: "Financiación flexible adaptada a lo que tú necesitas",
      transition: { type: "flip", durationInFrames: 18 },
    },
    {
      id: "cta",
      durationInSeconds: 4.5,
      emoji: "📍",
      kicker: "Te esperamos",
      title: "Ven a\nvernos.",
      accent: automarketColors.red,
      captions: "Pásate por Automarket Durango y encuentra tu coche ideal",
      transition: { type: "none" },
    },
  ],
};
