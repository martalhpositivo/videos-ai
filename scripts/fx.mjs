// @ts-check
/**
 * Añade efectos (intro 3D + rótulos + stickers + cierre) sobre un video.
 *
 *   npm run fx -- <video> [--out salida.mp4]
 *
 * Edita los textos/stickers en src/config/fx.config.ts.
 * Corre esto EN TU ORDENADOR (Windows/Mac/Linux), donde vive el video.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { selectComposition, renderMedia } from "@remotion/renderer";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const argv = process.argv.slice(2);
if (argv.length === 0 || argv[0].startsWith("-")) {
  console.error("Uso: npm run fx -- <video> [--out salida.mp4]");
  process.exit(1);
}
const input = path.resolve(argv[0]);
if (!fs.existsSync(input)) {
  console.error(`❌ No encuentro el video: ${input}`);
  process.exit(1);
}
const outIdx = argv.indexOf("--out");
const outPath = path.resolve(
  outIdx !== -1 && argv[outIdx + 1]
    ? argv[outIdx + 1]
    : path.join(path.dirname(input), `${path.parse(input).name}-fx.mp4`),
);

const publicName = `__fx_input${path.extname(input)}`;
const publicPath = path.join(ROOT, "public", publicName);

const cleanup = () => {
  if (fs.existsSync(publicPath)) fs.rmSync(publicPath);
};

const main = async () => {
  console.log(`✨ Añadiendo efectos a: ${path.basename(input)}`);
  fs.mkdirSync(path.join(ROOT, "public"), { recursive: true });
  fs.copyFileSync(input, publicPath);

  // Solo pasamos videoSrc (nivel superior); los textos/stickers salen de
  // fx.config.ts a través de los defaultProps de la composición.
  const inputProps = { videoSrc: publicName };
  const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE || null;

  console.log("📦 Preparando…");
  const serveUrl = await bundle({
    entryPoint: path.join(ROOT, "src", "index.ts"),
    publicDir: path.join(ROOT, "public"),
  });

  const composition = await selectComposition({
    serveUrl,
    id: "VideoWithFX",
    inputProps,
    browserExecutable,
  });

  console.log("🎬 Renderizando (con 3D)…");
  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    outputLocation: outPath,
    inputProps,
    browserExecutable,
    chromiumOptions: { gl: "angle" }, // necesario para Three.js en headless
    onProgress: ({ progress }) =>
      process.stdout.write(`\r   ${Math.round(progress * 100)}%   `),
  });

  process.stdout.write("\n");
  console.log(`✅ Listo: ${outPath}`);
};

main()
  .catch((err) => {
    console.error("\n❌ Error:", err?.message || err);
    process.exitCode = 1;
  })
  .finally(cleanup);
