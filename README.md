# videos-ai — Remotion

AI-powered video production with Remotion, set up for the
[remotion-superpowers](https://github.com/dojocodinglabs/remotion-superpowers)
Claude Code plugin.

## Compositions

- **`InstagramReel`** (`src/InstagramReel.tsx`) — a data-driven vertical reel
  template (1080×1920, 30s, 30fps). Edit the `REEL` object at the top of the
  file to change the copy, emoji, accent colors and per-scene timing without
  touching the animation code.

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
