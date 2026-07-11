// Cutout for the one new photo the user sent that isn't already in the hub
// (the lying-down green cat). The other four green cats are the same ones from
// alien-cats and are copied straight from those cleaned cutouts. Border
// flood-fill keeps light paws intact on the white background.
import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { mkdirSync } from "fs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const DL = "/Users/artem/Downloads";

const JOBS = [
  { src: `${DL}/bc969689c308960c5871278e0c71b9c6.jpg`, out: "cat1.png", tol: 34, bg: [255, 255, 255] }, // lying green cat
];

function keyOut(data, W, H, ch, bg, tol) {
  const clear = new Uint8Array(W * H);
  const stack = [];
  const idx = (x, y) => y * W + x;
  const isBg = (x, y) => {
    const p = idx(x, y) * ch;
    return Math.max(Math.abs(data[p] - bg[0]), Math.abs(data[p + 1] - bg[1]), Math.abs(data[p + 2] - bg[2])) < tol;
  };
  for (let x = 0; x < W; x++) { stack.push([x, 0]); stack.push([x, H - 1]); }
  for (let y = 0; y < H; y++) { stack.push([0, y]); stack.push([W - 1, y]); }
  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || y < 0 || x >= W || y >= H) continue;
    const i = idx(x, y);
    if (clear[i] || !isBg(x, y)) continue;
    clear[i] = 1;
    stack.push([x + 1, y]); stack.push([x - 1, y]); stack.push([x, y + 1]); stack.push([x, y - 1]);
  }
  return clear;
}

async function processOne(job) {
  const { data, info } = await sharp(job.src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: ch } = info;
  const bg = job.bg;
  const clear = keyOut(data, W, H, ch, bg, job.tol);
  const out = Buffer.from(data);
  for (let i = 0; i < W * H; i++) if (clear[i]) out[i * ch + 3] = 0;
  await sharp(out, { raw: { width: W, height: H, channels: ch } })
    .png().trim({ threshold: 1 }).resize({ height: 480, withoutEnlargement: true })
    .png({ compressionLevel: 9 }).toFile(join(root, "public/cats", job.out));
  const m = await sharp(join(root, "public/cats", job.out)).metadata();
  console.log(job.out, "→", m.width + "x" + m.height);
}

async function main() {
  mkdirSync(join(root, "public/cats"), { recursive: true });
  for (const j of JOBS) await processOne(j);
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); });
