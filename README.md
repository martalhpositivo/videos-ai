# videos-ai — Remotion

AI-powered video production with Remotion, set up for the
[remotion-superpowers](https://github.com/dojocodinglabs/remotion-superpowers)
Claude Code plugin.

## Compositions

- **`ProductivityReel`** — plantilla profesional de reels verticales
  (1080×1920, 9:16) para Instagram / TikTok / Shorts, en español y sobre
  productividad. Es **totalmente config-driven**: subtítulos automáticos,
  transiciones dinámicas, emojis y colores de marca.

### Editar la plantilla

Todo se edita en **un solo archivo**: `src/config/reel.config.ts`.

- **Colores de marca** → `brand.colors` (primary, secondary, accent, etc.)
- **@usuario y logo** → `brand.handle`, `brand.logoEmoji`
- **Escenas** → array `scenes`: cada una tiene `emoji`, `kicker`, `title`,
  `accent` (opcional) y `durationInSeconds`.
- **Subtítulos automáticos** → escribe la frase hablada en `scene.captions`;
  las palabras se sincronizan solas en estilo karaoke (resaltando la activa).
  Ajusta tamaño, posición y agrupación en `captionStyle`.
- **Transiciones dinámicas** → `scene.transition.type`: `slide`, `wipe`,
  `clockWipe`, `flip`, `fade` o `none` (con `direction` y `durationInFrames`).
- **Música** → coloca un archivo en `public/music/` y ponlo en `music.src`
  (o genérala con el comando `/add-music` del plugin remotion-superpowers).

Guarda el archivo y el preview (`npm run dev`) se actualiza solo. La duración
total del video y las dimensiones se calculan automáticamente desde el config.

> Los subtítulos usan un reparto de tiempo uniforme por palabra (funciona sin
> audio). Cuando agregues voz en off, puedes sustituirlo por timestamps reales
> de Whisper con el comando `/add-captions` del plugin.

### Marca: Automarket Durango

Identidad visual real del concesionario (rojo `#EB2026`, fondo `#0D0D0F`, ámbar
`#FCB900`, Inter), en `src/config/brands/automarket-durango.ts`. La usan:

- **`AutomarketReel`** — reel de marca con sus pilares (taller, transparencia,
  financiación). Edita `automarketReelConfig`.
- **`AutomarketCar`** — ficha **"Coche de la semana"**: foto + modelo + precio +
  specs + CTA, animada. Edita `src/config/car.config.ts` (pon la foto en
  `public/cars/` y su ruta en `photo`).
- Los **subtítulos quemados** (`npm run subtitle`) salen con su marca: palabra
  activa en ámbar y scrim para legibilidad sobre cualquier metraje.

- **`VideoWithCaptions`** — quema **subtítulos animados estilo TikTok** sobre un
  video existente, transcribiendo el audio automáticamente con **Whisper**
  (local, en español, sin API key). Detecta solas las dimensiones, duración y
  fps del video de entrada.

## Subtitular un video automáticamente

Un solo comando, sin API keys. Corre esto **en tu ordenador** (Windows, Mac o
Linux), donde vive el video y tienes internet abierto para bajar Whisper la
primera vez:

```console
npm run subtitle -- mi-video.mov
```

### Windows — modo fácil (arrastrar y soltar) ⭐

1. Instala **Node.js LTS** desde https://nodejs.org (siguiente-siguiente-fin).
   Solo hay que hacerlo una vez.
2. Descarga este proyecto (botón verde **Code → Download ZIP** en GitHub) y
   descomprímelo.
3. **Arrastra tu video encima del archivo `Subtitular-video.bat`** y suéltalo.

Eso es todo: la primera vez instala lo necesario y descarga Whisper solo; al
terminar tienes `tu-video-subtitulado.mp4` junto al original.

### Windows — por terminal (equivalente)

```powershell
npm install
npm run subtitle -- IMG_9323.mov
```
La primera vez descarga Whisper (binario precompilado, sin compilar nada).

Opciones:

```console
npm run subtitle -- clips/anuncio.mp4 --lang es --model medium --out anuncio-final.mp4
```

- `--lang`  idioma del audio (por defecto `es`).
- `--model` calidad de Whisper: `tiny` · `base` · `small` · `medium` (por
  defecto) · `large-v3`. Más grande = más preciso pero más lento.
- `--out`   ruta del MP4 de salida.

Qué hace por dentro:
1. Extrae el audio del video a 16 kHz con ffmpeg.
2. Transcribe con **Whisper.cpp** local → texto con tiempos por palabra
   (descarga el modelo solo la primera vez).
3. Quema los subtítulos animados sobre el video (composición
   `VideoWithCaptions`) y renderiza el MP4 final.

También te deja un `mi-video.captions.json` editable: si quieres corregir una
palabra o un tiempo, lo editas y vuelves a renderizar desde el Studio.

Personaliza el estilo (color activo, tamaño, contorno, posición) en
`src/config/captions.config.ts`.

> **Nota sobre este entorno:** en Claude Code on the web la red está restringida
> y no se pueden bajar los modelos de Whisper ni traer videos grandes de Drive,
> por eso este comando está pensado para tu ordenador local. La parte de quemado
> y render sí quedó verificada aquí; la transcripción corre en tu PC.

## Rendering in Claude Code on the web

The network policy blocks Remotion from downloading its bundled Chromium, so
point it at the pre-installed headless shell:

```console
npx remotion render InstagramReel out/reel.mp4 \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
```

Use the full-Chrome binary and you'll hit the "old headless mode removed"
error — the `headless_shell` build is the one Remotion needs.



<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.apng">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Welcome to your Remotion project!

## Commands

**Install Dependencies**

```console
npm i
```

**Start Preview**

```console
npm run dev
```

**Render video**

```console
npx remotion render
```

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
