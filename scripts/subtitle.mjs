// @ts-check
/**
 * Subtitula un video automáticamente con subtítulos animados estilo TikTok.
 *
 *   npm run subtitle -- <video> [opciones]
 *
 * Ejemplo:
 *   npm run subtitle -- IMG_9323.mov
 *   npm run subtitle -- clips/ad.mp4 --lang es --model medium --out ad-subtitulado.mp4
 *
 * Qué hace, sin API keys:
 *   1. Extrae el audio del video (ffmpeg de Remotion) a 16 kHz.
 *   2. Transcribe con Whisper.cpp localmente (descarga el modelo la 1ª vez).
 *   3. Quema los subtítulos animados sobre el video (composición VideoWithCaptions).
 *
 * Requisitos: Node 18+ e internet la primera vez (para bajar Whisper y el modelo).
 * Corre esto EN TU MÁQUINA, donde vive el video y la red está abierta.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import {
  installWhisperCpp,
  downloadWhisperModel,
  transcribe,
  toCaptions,
} from "@remotion/install-whisper-cpp";
import { bundle } from "@remotion/bundler";
import { selectComposition, renderMedia } from "@remotion/renderer";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const WHISPER_DIR = path.join(ROOT, "whisper.cpp");
const WHISPER_VERSION = "1.7.4";

// ── Parseo de argumentos ────────────────────────────────────────────────────
const argv = process.argv.slice(2);
if (argv.length === 0 || argv[0].startsWith("-")) {
  console.error(
    "Uso: npm run subtitle -- <video> [--lang es] [--model medium] [--out salida.mp4]",
  );
  process.exit(1);
}
const input = path.resolve(argv[0]);
const opt = (name, def) => {
  const i = argv.indexOf(`--${name}`);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : def;
};
const language = opt("lang", "es");
const model = opt("model", "medium"); // tiny | base | small | medium | large-v3
const outPath = path.resolve(
  opt(
    "out",
    path.join(
      path.dirname(input),
      `${path.parse(input).name}-subtitulado.mp4`,
    ),
  ),
);

if (!fs.existsSync(input)) {
  console.error(`❌ No encuentro el video: ${input}`);
  process.exit(1);
}

const publicName = `__subtitle_input${path.extname(input)}`;
const publicPath = path.join(ROOT, "public", publicName);
const wavPath = path.join(ROOT, "public", "__subtitle_audio.wav");

// Ruta al CLI de Remotion como .js, para invocarlo con `node` (evita el shim
// remotion.cmd, que falla en Windows con Node reciente). Funciona en todas las
// plataformas y trae ffmpeg incluido.
const require = createRequire(import.meta.url);
const remotionCli = path.join(
  path.dirname(require.resolve("@remotion/cli/package.json")),
  "remotion-cli.js",
);

const cleanup = () => {
  for (const f of [publicPath, wavPath]) {
    if (fs.existsSync(f)) fs.rmSync(f);
  }
};

const main = async () => {
  console.log(`🎬 Subtitulando: ${path.basename(input)}`);
  console.log(`   idioma=${language}  modelo=${model}`);

  // 1) Instalar Whisper.cpp + modelo (idempotente; sólo baja la 1ª vez).
  console.log("⬇️  Preparando Whisper.cpp y el modelo…");
  await installWhisperCpp({ to: WHISPER_DIR, version: WHISPER_VERSION });
  await downloadWhisperModel({ model, folder: WHISPER_DIR });

  // 2) Extraer audio a 16 kHz mono WAV (lo que Whisper.cpp necesita).
  console.log("🎧 Extrayendo audio…");
  fs.mkdirSync(path.dirname(wavPath), { recursive: true });
  execFileSync(
    process.execPath,
    [remotionCli, "ffmpeg", "-y", "-i", input, "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", wavPath],
    { stdio: "ignore" },
  );

  // 3) Transcribir con timestamps por palabra.
  console.log("📝 Transcribiendo (puede tardar según el modelo)…");
  const whisperCppOutput = await transcribe({
    inputPath: wavPath,
    whisperPath: WHISPER_DIR,
    whisperCppVersion: WHISPER_VERSION,
    model,
    modelFolder: WHISPER_DIR,
    tokenLevelTimestamps: true,
    language: /** @type {any} */ (language),
    printOutput: false,
  });
  const { captions } = toCaptions({ whisperCppOutput });
  console.log(`   ${captions.length} palabras detectadas.`);

  // Guardar los subtítulos por si quieres editarlos a mano y re-renderizar.
  const captionsJson = path.join(
    path.dirname(outPath),
    `${path.parse(input).name}.captions.json`,
  );
  fs.writeFileSync(captionsJson, JSON.stringify(captions, null, 2));

  // 4) Quemar los subtítulos sobre el video.
  console.log("🔥 Quemando subtítulos y renderizando…");
  fs.copyFileSync(input, publicPath);

  const serveUrl = await bundle({
    entryPoint: path.join(ROOT, "src", "index.ts"),
    publicDir: path.join(ROOT, "public"),
  });
  const inputProps = { videoSrc: publicName, captions };
  const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE || null;

  const composition = await selectComposition({
    serveUrl,
    id: "VideoWithCaptions",
    inputProps,
    browserExecutable,
  });

  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    outputLocation: outPath,
    inputProps,
    browserExecutable,
    onProgress: ({ progress }) =>
      process.stdout.write(`\r   ${Math.round(progress * 100)}%   `),
  });

  process.stdout.write("\n");
  console.log(`✅ Listo: ${outPath}`);
  console.log(`   Subtítulos editables en: ${captionsJson}`);
};

main()
  .catch((err) => {
    console.error("\n❌ Error:", err?.message || err);
    process.exitCode = 1;
  })
  .finally(cleanup);
