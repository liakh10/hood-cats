// Heist props. The cats themselves are the user's own photos (green cats,
// cut out to transparent PNGs in /public/cats). Only the non-cat props —
// guard, loot bag, laser, camera — are authored SVG.

// Guard — a human silhouette in uniform, cap, flashlight beam.
export function guardSvg(uniform: string, beam: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
    <path d="M20 118 L36 60 L18 62 L28 40 L96 40 L88 118Z" fill="${beam}" opacity="0.16"/>
    <circle cx="56" cy="34" r="18" fill="${uniform}"/>
    <path d="M38 28 a18 12 0 0 1 36 0 L40 30Z" fill="#0c0e12"/>
    <path d="M40 48 L72 48 L80 108 L32 108Z" fill="${uniform}"/>
    <rect x="66" y="58" width="22" height="8" rx="2" fill="#0c0e12" transform="rotate(18 66 58)"/>
    <circle cx="90" cy="66" r="4" fill="${beam}"/>
    <rect x="30" y="108" width="14" height="10" fill="#0c0e12"/>
    <rect x="68" y="108" width="14" height="10" fill="#0c0e12"/>
  </svg>`;
}

export const LOOT_BAG = `<svg xmlns="http://www.w3.org/2000/svg" width="90" height="90" viewBox="0 0 90 90">
  <path d="M45 18 C38 18 34 26 36 32 C22 38 16 54 20 68 C23 78 32 82 45 82 C58 82 67 78 70 68 C74 54 68 38 54 32 C56 26 52 18 45 18Z" fill="#c98a3a" stroke="#8a5a20" stroke-width="2.5"/>
  <path d="M40 30 q5 -6 10 0" stroke="#8a5a20" stroke-width="3" fill="none" stroke-linecap="round"/>
  <text x="45" y="62" text-anchor="middle" font-family="Arial Black, sans-serif" font-weight="900" font-size="26" fill="#f2c14e">$</text>
</svg>`;

export const LASER = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="120" viewBox="0 0 16 120">
  <rect x="6" y="0" width="4" height="120" fill="#ff4444"/>
  <rect x="0" y="0" width="16" height="120" fill="#ff4444" opacity="0.16"/>
</svg>`;

export const CAMERA = `<svg xmlns="http://www.w3.org/2000/svg" width="90" height="70" viewBox="0 0 90 70">
  <rect x="10" y="18" width="52" height="30" rx="6" fill="#2a2f3a" stroke="#454c5c" stroke-width="2.5"/>
  <path d="M62 24 L82 14 L82 52 L62 42Z" fill="#2a2f3a" stroke="#454c5c" stroke-width="2.5"/>
  <circle cx="30" cy="33" r="10" fill="#141820"/>
  <circle cx="30" cy="33" r="5" fill="#ff4444"/>
  <rect x="24" y="6" width="12" height="14" rx="2" fill="#454c5c"/>
</svg>`;

// The user's own green cats — player runner + the flock cat you deliver to.
export const PLAYER_CAT = "/cats/cat2.png";
export const FLOCK_CAT = "/cats/cat4.png";

export interface HeistSprites {
  player: HTMLImageElement;
  guard: HTMLImageElement;
  flock: HTMLImageElement;
  loot: HTMLImageElement;
  laser: HTMLImageElement;
  camera: HTMLImageElement;
  ready: Promise<void>;
}

export function loadHeistSprites(): HeistSprites {
  const proms: Promise<void>[] = [];
  const wire = (i: HTMLImageElement) => { proms.push(new Promise<void>((r) => { i.onload = () => r(); i.onerror = () => r(); })); return i; };
  const mk = (svg: string) => { const i = new Image(); i.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg); return wire(i); };
  const mkFile = (src: string) => { const i = new Image(); i.src = src; return wire(i); };

  const player = mkFile(PLAYER_CAT);
  const flock = mkFile(FLOCK_CAT);
  const guard = mk(guardSvg("#3a4356", "#ffe27a"));
  const loot = mk(LOOT_BAG);
  const laser = mk(LASER);
  const camera = mk(CAMERA);
  return { player, guard, flock, loot, laser, camera, ready: Promise.all(proms).then(() => undefined) };
}
