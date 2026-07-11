// Local persistence: best score + best flock deliveries + audio pref. Device-local.
const SCORE_KEY = "hood_best_score";
const FLOCK_KEY = "hood_best_flock";
const MUTED_KEY = "hood_muted";

export function getBestScore(): number { try { return Number(localStorage.getItem(SCORE_KEY) || "0") || 0; } catch { return 0; } }
export function saveBestScore(v: number): boolean {
  if (v <= getBestScore()) return false;
  try { localStorage.setItem(SCORE_KEY, String(Math.round(v))); return true; } catch { return false; }
}

export function getBestFlock(): number { try { return Number(localStorage.getItem(FLOCK_KEY) || "0") || 0; } catch { return 0; } }
export function saveBestFlock(v: number): boolean {
  if (v <= getBestFlock()) return false;
  try { localStorage.setItem(FLOCK_KEY, String(v)); return true; } catch { return false; }
}

export function getMuted(): boolean { try { return localStorage.getItem(MUTED_KEY) === "1"; } catch { return false; } }
export function setMuted(v: boolean) { try { localStorage.setItem(MUTED_KEY, v ? "1" : "0"); } catch { /* */ } }
