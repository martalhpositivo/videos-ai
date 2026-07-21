---
name: video-studio
description: >-
  Produce vertical brand videos with this Remotion project — config-driven reels
  (Instagram/TikTok/Shorts), a "coche de la semana" car card, a 3D intro
  (Three.js) and automatic burned-in subtitles via Whisper. Use whenever the
  user wants to create, edit, brand, subtitle, add 3D to, or render a
  video/reel here (especially for Automarket Durango).
---

# Video Studio (Remotion)

A config-driven video studio for vertical social content. Everything is edited
from config files — no need to touch animation code for normal changes.

## When to use

- "haz / edita un reel", "otro video de marca", "cámbiale los textos/colores"
- "ficha de un coche", "coche de la semana"
- "ponle una intro 3D", "algo en 3D"
- "súbtitula este video", "ponle subtítulos automáticos"
- "renderiza / exporta el video"

## Project map

Compositions (registered in `src/Root.tsx`):

| ID | Componente | Config editable | Para qué |
|----|-----------|-----------------|----------|
| `ProductivityReel` | `src/ProductivityReel.tsx` | `src/config/reel.config.ts` | Reel genérico multi-escena |
| `AutomarketReel` | reusa `ProductivityReel` | `src/config/brands/automarket-durango.ts` (`automarketReelConfig`) | Reel de marca del concesionario |
| `AutomarketCar` | `src/AutomarketCar.tsx` | `src/config/car.config.ts` | Ficha "Coche de la semana" |
| `Scene3D` | `src/Scene3D.tsx` | (código) | Intro 3D con Three.js |
| `VideoWithCaptions` | `src/VideoWithCaptions.tsx` | `src/config/captions.config.ts` | Subtítulos quemados sobre un video |

Shared: `src/components/` (Scene, Captions, BurnedCaptions, Background,
ProgressBar, Watermark), `src/lib/timeline.ts` (duración/transiciones),
`src/config/types.ts` (tipos).

## Workflows

### 1. Crear / editar un reel

Edita el objeto de config (no el componente):

- Genérico → `src/config/reel.config.ts` (`reelConfig`).
- Marca Automarket → `automarketReelConfig` en
  `src/config/brands/automarket-durango.ts`.

Cada escena: `emoji`, `kicker`, `title` (usa `\n` para saltos), `accent`
opcional, `durationInSeconds`, `captions` (subtítulo auto-sincronizado) y
`transition` (`slide` | `wipe` | `clockWipe` | `flip` | `fade` | `none`, con
`direction` y `durationInFrames`). La duración total y las dimensiones se
calculan solas desde la config. El watermark es opcional (`watermark:
{ enabled: true }`), desactivado por defecto.

### 2. Ficha "Coche de la semana"

Edita `src/config/car.config.ts`: `photo` (pon la imagen en `public/cars/` y su
ruta aquí, o `null` para el marcador), `model`, `details`, `price`, `specs[]`,
`cta`. Detecta el resto solo.

### 3. Intro 3D

`src/Scene3D.tsx` usa `@remotion/three` (Three.js). Anima SIEMPRE con
`useCurrentFrame()` (render determinista, sin `Math.random`/`Date.now`). Evita
`@react-three/drei` `Text`/`Environment`: intentan descargar fuentes/HDR de la
red. Para texto, superpón HTML 2D encima del `<ThreeCanvas>`.
**Renderizar 3D requiere `--gl=angle`** (ver más abajo).

### 4. Subtitular un video (Whisper, sin API key)

```
npm run subtitle -- <video> [--lang es] [--model medium] [--out salida.mp4]
```

`scripts/subtitle.mjs`: extrae audio con ffmpeg → transcribe con **Whisper.cpp
local** (`@remotion/install-whisper-cpp`, baja binario precompilado + modelo la
1ª vez) → `@remotion/captions` (estilo TikTok) → quema los subtítulos con la
composición `VideoWithCaptions` y renderiza. Deja también un `*.captions.json`
editable. Estilo en `src/config/captions.config.ts`. En Windows hay un lanzador
de arrastrar y soltar: `Subtitular-video.bat`.

## Renderizar

```
npm run dev                                   # Remotion Studio (preview)
npx remotion render <CompID> out/video.mp4    # exportar
npx remotion render Scene3D out/i.mp4 --gl=angle   # 3D necesita --gl=angle
```

**En entornos con red restringida** (p.ej. Claude Code on the web), Remotion no
puede descargar su Chromium. Usa el navegador preinstalado:

```
--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
```

Usa el binario `headless_shell`, no el `chrome` completo (da "old headless mode
removed"). Verifica cambios con `npm run lint` (eslint + tsc) antes de dar algo
por hecho, y con un still (`npx remotion still ...`) para revisar el resultado.

## Identidad de marca — Automarket Durango

Compraventa de coches (Durango, Bizkaia). Paleta oficial (en
`src/config/brands/automarket-durango.ts`): rojo `#EB2026` (principal), fondo
`#0D0D0F`, ámbar `#FCB900` (acento), grises, tipografía **Inter** (pesos altos).
Para subtitular, la palabra activa va en ámbar con contorno + scrim para
legibilidad.

## Límites del entorno (importante)

Este toolkit es local-first. Dentro de un entorno de red restringida NO se puede:

- **Transcribir**: los modelos de Whisper (HuggingFace) y las APIs
  (ElevenLabs/KIE/TwelveLabs) están bloqueados por la allowlist → corre
  `npm run subtitle` en la máquina del usuario, o pídele que abra un entorno con
  red permisiva (o añada `huggingface.co` a la allowlist).
- **Traer videos grandes de Drive**: el conector devuelve el archivo como base64
  en la respuesta; solo caben archivos de <~0.5 MB. Los videos reales se
  procesan en la máquina del usuario.

Editar, crear reels/fichas y renderizar 2D/3D **sí** funciona en el entorno
restringido (con `--browser-executable` y, para 3D, `--gl=angle`).
