// Authored heist-cat cast — flat SVG silhouettes (side profile, running),
// rendered to <img> for canvas use. No photos anywhere in this project: the
// whole cast (player, guard, flock cat) plus obstacles/loot are drawn in code.

// Player — "THE HOOD": a cat in a hoodie with a bandana mask, mid-stride.
export function hoodCatSvg(coat: string, hoodie: string, bandana: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="120" viewBox="0 0 140 120">
    <!-- tail -->
    <path d="M28 78 C10 74 8 56 20 46" fill="none" stroke="${coat}" stroke-width="10" stroke-linecap="round"/>
    <!-- back leg -->
    <path d="M52 96 L46 116 M46 116 h12" stroke="${coat}" stroke-width="9" stroke-linecap="round" fill="none"/>
    <!-- front leg (extended, mid-run) -->
    <path d="M88 96 L100 114 M100 114 h12" stroke="${coat}" stroke-width="9" stroke-linecap="round" fill="none"/>
    <!-- body -->
    <path d="M34 92 C26 68 40 48 68 48 C92 48 104 62 106 82 C108 96 98 100 80 100 L44 100 C36 100 34 98 34 92Z" fill="${coat}"/>
    <!-- hoodie over head -->
    <path d="M64 26 C50 26 40 38 40 52 C40 62 46 70 58 72 L100 72 C108 72 110 64 106 56 C102 42 88 26 64 26Z" fill="${hoodie}"/>
    <!-- ears poking through hoodie -->
    <path d="M54 28 L48 14 L62 24Z" fill="${hoodie}"/>
    <path d="M84 26 L92 12 L94 28Z" fill="${hoodie}"/>
    <!-- face patch -->
    <ellipse cx="82" cy="56" rx="20" ry="16" fill="${coat}"/>
    <!-- bandana mask -->
    <path d="M62 46 L108 50 L106 62 L60 58Z" fill="${bandana}"/>
    <path d="M108 50 L118 44 L116 54 L108 58Z" fill="${bandana}"/>
    <!-- eyes -->
    <ellipse cx="88" cy="52" rx="3.4" ry="4.2" fill="#141418"/>
    <ellipse cx="100" cy="52" rx="3.4" ry="4.2" fill="#141418"/>
  </svg>`;
}

// Flock cat — small, unmasked, warm-coloured, no hoodie.
export function flockCatSvg(coat: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="110" height="100" viewBox="0 0 110 100">
    <path d="M24 70 C10 66 10 52 20 44" fill="none" stroke="${coat}" stroke-width="8" stroke-linecap="round"/>
    <path d="M30 80 C24 60 36 42 58 42 C78 42 88 54 90 70 C91 82 82 86 66 86 L38 86 C30 86 30 84 30 80Z" fill="${coat}"/>
    <path d="M40 32 L34 16 L48 28Z" fill="${coat}"/>
    <path d="M64 30 L74 14 L78 30Z" fill="${coat}"/>
    <ellipse cx="72" cy="44" rx="3" ry="3.6" fill="#141418"/>
    <ellipse cx="82" cy="44" rx="3" ry="3.6" fill="#141418"/>
    <path d="M70 52 q6 3 12 0" stroke="#141418" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  </svg>`;
}

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
  const mk = (svg: string) => {
    const i = new Image();
    proms.push(new Promise<void>((r) => { i.onload = () => r(); i.onerror = () => r(); }));
    i.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    return i;
  };
  const player = mk(hoodCatSvg("#c9a876", "#232733", "#f2c14e"));
  const guard = mk(guardSvg("#3a4356", "#ffe27a"));
  const flock = mk(flockCatSvg("#e8b98a"));
  const loot = mk(LOOT_BAG);
  const laser = mk(LASER);
  const camera = mk(CAMERA);
  return { player, guard, flock, loot, laser, camera, ready: Promise.all(proms).then(() => undefined) };
}
