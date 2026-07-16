/* eslint-disable @remotion/non-pure-animation -- this is a plain data file; the
   `transition` keys are config, not runtime animations. */
import type { ReelConfig } from "./types";

/**
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  CONFIGURACIÓN DEL REEL — edita SOLO este archivo.                    │
 * │                                                                       │
 * │  • Cambia colores de marca en `brand.colors`.                         │
 * │  • Cambia el @usuario y el emoji del logo en `brand`.                 │
 * │  • Edita, agrega o quita escenas en `scenes` (texto, emoji, tiempo).  │
 * │  • Los subtítulos se generan y sincronizan solos desde `captions`.    │
 * │  • Elige la transición entre escenas en `scene.transition`.           │
 * │                                                                       │
 * │  No necesitas tocar ningún otro archivo. Guarda y el video se         │
 * │  actualiza en el preview (npm run dev).                               │
 * └─────────────────────────────────────────────────────────────────────┘
 */
export const reelConfig: ReelConfig = {
  // ── Formato (vertical 9:16 para Reels / TikTok / Shorts) ──────────────
  fps: 30,
  width: 1080,
  height: 1920,

  // ── Marca ─────────────────────────────────────────────────────────────
  brand: {
    name: "Productividad Real",
    handle: "@productividad.real",
    logoEmoji: "⚡",
    colors: {
      primary: "#6366f1", // índigo — color principal de marca
      secondary: "#a855f7", // violeta — segundo tono del degradado
      accent: "#22d3ee", // cian — resalta la palabra activa del subtítulo
      background: "#0b0b13", // fondo (el más oscuro)
      surface: "#ffffff14", // superficies tipo píldora (blanco translúcido)
      text: "#ffffff",
      muted: "#ffffffb3",
    },
    fontFamily:
      '"Inter", "SF Pro Display", "Segoe UI", system-ui, -apple-system, sans-serif',
  },

  // ── Música de fondo (opcional) ────────────────────────────────────────
  // Coloca un archivo en public/music/ y pon aquí su ruta, p.ej.
  //   src: "music/lofi.mp3"
  // Con el plugin remotion-superpowers puedes generarla con /add-music.
  music: {
    src: null,
    volume: 0.35,
  },

  // ── Estilo de subtítulos automáticos ──────────────────────────────────
  captionStyle: {
    enabled: true,
    position: "bottom", // "top" | "center" | "bottom"
    fontSize: 62,
    wordsPerGroup: 3, // cuántas palabras se ven a la vez (estilo karaoke)
    // highlightColor: se omite → usa el acento de cada escena
    textColor: "#ffffff",
    uppercase: true,
  },

  // ── Barra de progreso segmentada (una por escena) ─────────────────────
  progressBar: { enabled: true },

  // ── Escenas ───────────────────────────────────────────────────────────
  // Duración total ≈ suma de durationInSeconds (las transiciones solapan
  // ~0.5s cada una). Con estos valores el reel dura ~30s.
  scenes: [
    {
      id: "hook",
      durationInSeconds: 4,
      emoji: "😵‍💫",
      kicker: "¿Te pasa?",
      title: "Haces mil cosas\ny no avanzas.",
      accent: "#f43f5e", // rosa/rojo para enganchar
      captions: "Trabajas todo el día pero sientes que no avanzas nada",
      transition: { type: "slide", direction: "from-right", durationInFrames: 15 },
    },
    {
      id: "tip-1",
      durationInSeconds: 4.5,
      emoji: "🎯",
      kicker: "Tip 1",
      title: "Enfócate en\nuna sola tarea.",
      accent: "#6366f1",
      captions: "Elige la tarea más importante y hazla antes que nada",
      transition: { type: "wipe", direction: "from-bottom", durationInFrames: 15 },
    },
    {
      id: "tip-2",
      durationInSeconds: 4.5,
      emoji: "⏰",
      kicker: "Tip 2",
      title: "Bloquea\ntu tiempo.",
      accent: "#a855f7",
      captions: "Agenda bloques de tiempo sin interrupciones para avanzar de verdad",
      transition: { type: "clockWipe", durationInFrames: 18 },
    },
    {
      id: "tip-3",
      durationInSeconds: 4.5,
      emoji: "🔕",
      kicker: "Tip 3",
      title: "Elimina las\ndistracciones.",
      accent: "#f59e0b",
      captions: "Silencia el celular y cierra las pestañas que no necesitas",
      transition: { type: "flip", durationInFrames: 18 },
    },
    {
      id: "tip-4",
      durationInSeconds: 4.5,
      emoji: "🧘",
      kicker: "Tip 4",
      title: "Descansa\nde verdad.",
      accent: "#22c55e",
      captions: "Tu cerebro rinde más cuando descansas sin pantallas",
      transition: { type: "fade", durationInFrames: 20 },
    },
    {
      id: "cta",
      durationInSeconds: 4.5,
      emoji: "🚀",
      kicker: "Tu turno",
      title: "Empieza\nhoy mismo.",
      accent: "#6366f1",
      captions: "Guarda este reel y aplica un tip hoy. Sígueme para más",
      // Última escena: sin transición de salida.
      transition: { type: "none" },
    },
  ],
};
