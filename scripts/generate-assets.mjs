import sharp from "sharp";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

/*
 * Builds the share card and favicons from the brand art in public/images/.
 *
 * The logo and mascot PNGs carry the site's own forest green as a baked-in
 * background, so every output pads with that exact green and the seams
 * disappear against the page.
 *
 * Run: node scripts/generate-assets.mjs
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const images = (file) => resolve(__dirname, "..", "public/images", file);

const FOREST = "#3D513F";

// The mascot sits centered in a 1080x1350 canvas with generous green margins.
// These crops frame the artwork with enough breathing room for an icon; the
// apple icon gets extra padding because iOS rounds the corners off.
const ICON_CROP = { left: 220, top: 355, width: 640, height: 640 };
const APPLE_CROP = { left: 160, top: 295, width: 760, height: 760 };

async function write(pipeline, file) {
  const info = await pipeline.png({ compressionLevel: 9 }).toFile(images(file));
  console.log(
    `Wrote public/images/${file} — ${info.width}x${info.height}, ${(info.size / 1024).toFixed(1)} KB`
  );
}

// Share card: 1200x630 is the size every scraper crops toward. The logo is
// 2391x1344 (1.78:1), slightly taller than the card (1.90:1), so contain-on-
// green rather than a crop — a cover crop would shave the arched wordmark.
await write(
  sharp(images("townies-open-logo.png")).resize(1200, 630, {
    fit: "contain",
    background: FOREST,
  }),
  "og.png"
);

await write(
  sharp(images("golf-ball-mascot.png")).extract(ICON_CROP).resize(512, 512),
  "icon-512.png"
);

await write(
  sharp(images("golf-ball-mascot.png")).extract(APPLE_CROP).resize(180, 180),
  "apple-icon.png"
);
