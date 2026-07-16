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
