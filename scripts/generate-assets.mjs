import sharp from "sharp";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

/*
 * Builds every web image in public/images/ from the source artwork in assets/.
 *
 * The source art is two-tone: forest green behind acid yellow line work, the
 * palette of the logo. The site uses the 2026 flyer's palette instead — grey
 * green behind pale celery — so the art is recolored here rather than in an
 * image editor, which keeps assets/ as the untouched original and makes the
 * palette a one-line change.
 *
 * Run: node scripts/generate-assets.mjs
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const src = (file) => resolve(root, "assets", file);
const out = (file) => resolve(root, "public/images", file);

// What the source art is drawn in.
const FROM_BG = [0x3d, 0x51, 0x3f];
const FROM_FG = [0xdc, 0xd6, 0x41];
// What the site is drawn in — must match the tokens in src/app/globals.css.
const TO_BG = [0x58, 0x5b, 0x58];
const TO_FG = [0xe6, 0xe8, 0xb0];

const BG_HEX = "#585b58";

/*
 * Remaps the two-tone palette by measuring how far each pixel sits along the
 * line from the old background color to the old foreground color, then placing
 * it the same distance along the line between the new pair.
 *
 * A straight per-color substitution would only catch the two exact values and
 * leave every antialiased edge pixel its original green, ringing the artwork in
 * the old palette. Interpolating carries the soft edges across intact.
 */
async function recolor(file) {
  const { data, info } = await sharp(src(file))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const axis = FROM_FG.map((v, i) => v - FROM_BG[i]);
  const axisLengthSquared = axis.reduce((sum, v) => sum + v * v, 0);

  for (let i = 0; i < data.length; i += info.channels) {
    let dot = 0;
    for (let c = 0; c < 3; c++) dot += (data[i + c] - FROM_BG[c]) * axis[c];
    const t = Math.min(1, Math.max(0, dot / axisLengthSquared));
    for (let c = 0; c < 3; c++) {
      data[i + c] = Math.round(TO_BG[c] + t * (TO_FG[c] - TO_BG[c]));
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: info.channels },
  });
}

async function write(pipeline, file) {
  const info = await pipeline.png({ compressionLevel: 9 }).toFile(out(file));
  console.log(
    `Wrote public/images/${file} — ${info.width}x${info.height}, ${(info.size / 1024).toFixed(1)} KB`
  );
}

// Full-size art for the page itself.
await write(await recolor("townies-open-logo.png"), "townies-open-logo.png");
await write(await recolor("golf-ball-mascot.png"), "golf-ball-mascot.png");

// Share card: 1200x630 is the size every scraper crops toward. The logo is
// 2391x1344 (1.78:1), slightly taller than the card (1.90:1), so contain-on-
// background rather than a crop — a cover crop would shave the arched wordmark.
await write(
  (await recolor("townies-open-logo.png")).resize(1200, 630, {
    fit: "contain",
    background: BG_HEX,
  }),
  "og.png"
);

// The mascot sits centered in a 1080x1350 canvas with generous margins. These
// crops frame the artwork with enough breathing room for an icon; the apple
// icon gets extra padding because iOS rounds the corners off.
await write(
  (await recolor("golf-ball-mascot.png"))
    .extract({ left: 220, top: 355, width: 640, height: 640 })
    .resize(512, 512),
  "icon-512.png"
);

await write(
  (await recolor("golf-ball-mascot.png"))
    .extract({ left: 160, top: 295, width: 760, height: 760 })
    .resize(180, 180),
  "apple-icon.png"
);
