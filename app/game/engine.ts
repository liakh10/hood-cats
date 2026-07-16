// Bit Cats — 3-lane heist runner. The world scrolls left at a
// growing speed; the player switches lanes to grab loot bags, avoid guards/
// lasers/cameras (one hit = busted), and cash in held loot at flock drops
// for a score bonus. All positions are normalized (0..1 across the stage).

export type EntityKind = "loot" | "obstacle" | "flock";
export type ObstacleKind = "guard" | "laser" | "camera";

export interface Entity {
  id: number;
  kind: EntityKind;
  obstacleKind?: ObstacleKind;
  lane: 0 | 1 | 2;
  x: number;
  resolved: boolean;
}

export type Phase = "idle" | "playing" | "over";

export const PLAYER_X = 0.16;
export const LANE_Y = [0.22, 0.5, 0.78];
const HIT_X = 0.05;
const BASE_SPEED = 0.34;
const MAX_SPEED = 0.78;
const SPEED_RAMP = 0.012; // units/sec^2
const SPAWN_GAP_MS = 620;
const DESPAWN_X = -0.08;
const LOOT_VALUE = 20;
const FLOCK_MULT = 12;
const OBSTACLE_KINDS: ObstacleKind[] = ["guard", "laser", "camera"];

let uid = 1;

export class Game {
  phase: Phase = "idle";
  score = 0;
  lootHeld = 0;
  flockCount = 0;
  busted = false;
  playerLane: 0 | 1 | 2 = 1;
  speed = BASE_SPEED;
  entities: Entity[] = [];

  private now = 0;
  private spawnAcc = 0;

  onLoot?: () => void;
  onFlock?: (bonus: number) => void;
  onBusted?: () => void;

  start() {
    this.phase = "playing";
    this.score = 0;
    this.lootHeld = 0;
    this.flockCount = 0;
    this.busted = false;
    this.playerLane = 1;
    this.speed = BASE_SPEED;
    this.entities = [];
    this.now = 0;
    this.spawnAcc = 0;
  }

  setLane(lane: 0 | 1 | 2) {
    if (this.phase !== "playing") return;
    this.playerLane = lane;
  }

  private spawn() {
    const lane = Math.floor(Math.random() * 3) as 0 | 1 | 2;
    const roll = Math.random();
    let kind: EntityKind;
    let obstacleKind: ObstacleKind | undefined;
    if (roll < 0.14) {
      kind = "flock";
    } else if (roll < 0.42) {
      kind = "obstacle";
      obstacleKind = OBSTACLE_KINDS[Math.floor(Math.random() * OBSTACLE_KINDS.length)];
    } else {
      kind = "loot";
    }
    this.entities.push({ id: uid++, kind, obstacleKind, lane, x: 1.08, resolved: false });
  }

  private resolve(e: Entity) {
    if (e.lane !== this.playerLane) return;
    if (Math.abs(e.x - PLAYER_X) > HIT_X) return;
    e.resolved = true;
    if (e.kind === "loot") {
      this.lootHeld++;
      this.score += LOOT_VALUE;
      this.onLoot?.();
    } else if (e.kind === "flock") {
      if (this.lootHeld > 0) {
        const bonus = this.lootHeld * FLOCK_MULT;
        this.score += bonus;
        this.flockCount++;
        this.lootHeld = 0;
        this.onFlock?.(bonus);
      }
    } else if (e.kind === "obstacle") {
      this.phase = "over";
      this.busted = true;
      this.onBusted?.();
    }
  }

  update(dtMs: number) {
    if (this.phase !== "playing") return;
    const dt = Math.min(0.05, dtMs / 1000);
    this.now += dtMs;
    this.speed = Math.min(MAX_SPEED, this.speed + SPEED_RAMP * dt);
    this.score += this.speed * dt * 40;

    this.spawnAcc += dtMs;
    const gap = Math.max(340, SPAWN_GAP_MS - (this.speed - BASE_SPEED) * 260);
    if (this.spawnAcc > gap) { this.spawnAcc = 0; this.spawn(); }

    for (const e of this.entities) {
      if (e.resolved) continue;
      e.x -= this.speed * dt;
      this.resolve(e);
      if (this.phase !== "playing") return;
    }
    this.entities = this.entities.filter((e) => e.x > DESPAWN_X && !e.resolved);
  }

  state() {
    return {
      phase: this.phase, score: this.score, lootHeld: this.lootHeld, flockCount: this.flockCount,
      busted: this.busted, playerLane: this.playerLane, speed: this.speed, entityCount: this.entities.length,
    };
  }

  // dev-only headless helpers, mirrored on window.__game
  debugAdvance(dtMs: number) { this.update(dtMs); }
  debugSwitchLane(lane: 0 | 1 | 2) { this.setLane(lane); }
  debugSpawnLoot(lane: 0 | 1 | 2) { this.entities.push({ id: uid++, kind: "loot", lane, x: PLAYER_X, resolved: false }); }
  debugSpawnGuard(lane: 0 | 1 | 2) { this.entities.push({ id: uid++, kind: "obstacle", obstacleKind: "guard", lane, x: PLAYER_X, resolved: false }); }
  debugSpawnFlock(lane: 0 | 1 | 2) { this.entities.push({ id: uid++, kind: "flock", lane, x: PLAYER_X, resolved: false }); }
  debugResolveAll() { for (const e of this.entities) if (!e.resolved) this.resolve(e); }
}
