"use client";

import { useEffect, useRef, useState } from "react";
import { Game, PLAYER_X, LANE_Y } from "./engine";
import { loadHeistSprites, type HeistSprites } from "../art/cats";
import { ScoreIcon, LootIcon, FlockIcon, TrophyIcon } from "../art/icons";
import { getSfx } from "../sfx";
import { getMusic } from "../music";
import { getBestScore, saveBestScore, saveBestFlock } from "../store";

interface Hud { phase: "idle" | "playing" | "over"; score: number; lootHeld: number; flockCount: number; busted: boolean; }
const IDLE_HUD: Hud = { phase: "idle", score: 0, lootHeld: 0, flockCount: 0, busted: false };

export default function GameCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);
  const spritesRef = useRef<HeistSprites | null>(null);
  const [hud, setHud] = useState<Hud>(IDLE_HUD);
  const [best, setBest] = useState(() => getBestScore());
  const [flash, setFlash] = useState<"loot" | "flock" | "busted" | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current, wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;

    const game = new Game(); gameRef.current = game;
    const sprites = loadHeistSprites(); spritesRef.current = sprites;
    const s = getSfx();
    game.onLoot = () => { s.grab(); setFlash("loot"); setTimeout(() => setFlash(null), 150); };
    game.onFlock = () => { s.flock(); setFlash("flock"); setTimeout(() => setFlash(null), 260); };
    game.onBusted = () => {
      s.busted();
      setFlash("busted");
      const newBest = saveBestScore(game.score);
      saveBestFlock(game.flockCount);
      if (newBest) setBest(game.score); else setBest(getBestScore());
      window.dispatchEvent(new Event("hood:update"));
    };

    if (process.env.NODE_ENV !== "production") (window as unknown as { __game?: Game }).__game = game;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let W = 0, H = 0;
    let visualLaneY = LANE_Y[1];

    const laneFromPointer = (clientY: number) => {
      const r = canvas.getBoundingClientRect();
      const frac = (clientY - r.top) / Math.max(1, r.height);
      if (frac < 0.34) return 0;
      if (frac > 0.66) return 2;
      return 1;
    };
    const down = (e: PointerEvent) => {
      if (gameRef.current?.phase !== "playing") return;
      gameRef.current.setLane(laneFromPointer(e.clientY) as 0 | 1 | 2);
    };
    canvas.addEventListener("pointerdown", down);
    const onKey = (e: KeyboardEvent) => {
      const g = gameRef.current; if (!g || g.phase !== "playing") return;
      if (e.key === "ArrowUp" || e.key === "w") g.setLane(Math.max(0, g.playerLane - 1) as 0 | 1 | 2);
      if (e.key === "ArrowDown" || e.key === "s") g.setLane(Math.min(2, g.playerLane + 1) as 0 | 1 | 2);
    };
    window.addEventListener("keydown", onKey);

    let last = "";
    const syncHud = () => {
      const st = game.state();
      const key = `${st.phase}|${Math.round(st.score)}|${st.lootHeld}|${st.flockCount}|${st.busted}`;
      if (key !== last) {
        last = key;
        setHud({ phase: st.phase, score: st.score, lootHeld: st.lootHeld, flockCount: st.flockCount, busted: st.busted });
      }
    };

    let raf = 0, prev = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(50, now - prev); prev = now;
      const r = wrap.getBoundingClientRect();
      W = r.width; H = r.height;
      const wantW = Math.round(W * dpr), wantH = Math.round(H * dpr);
      if (canvas.width !== wantW || canvas.height !== wantH) {
        canvas.width = wantW; canvas.height = wantH;
        canvas.style.width = W + "px"; canvas.style.height = H + "px";
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // street backdrop
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "#12141b"); grad.addColorStop(1, "#1b1f29");
      ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(242,193,78,0.08)"; ctx.lineWidth = 1;
      for (const ly of LANE_Y) { ctx.beginPath(); ctx.moveTo(0, ly * H); ctx.lineTo(W, ly * H); ctx.stroke(); }

      game.update(dt);
      const scale = Math.min(W, H) * 0.62;

      // entities
      for (const e of game.entities) {
        const px = e.x * W, py = LANE_Y[e.lane] * H;
        const img = e.kind === "loot" ? sprites.loot
          : e.kind === "flock" ? sprites.flock
          : e.obstacleKind === "guard" ? sprites.guard
          : e.obstacleKind === "camera" ? sprites.camera
          : sprites.laser;
        if (img.complete && img.naturalWidth > 0) {
          const isLaser = e.kind === "obstacle" && e.obstacleKind === "laser";
          const ih = scale * (isLaser ? 0.9 : e.kind === "flock" ? 0.5 : 0.42);
          const iw = ih * (img.naturalWidth / img.naturalHeight);
          ctx.drawImage(img, px - iw / 2, py - ih / 2, iw, ih);
        }
      }

      // player, tweened toward its lane
      const targetY = LANE_Y[game.playerLane] * H;
      visualLaneY += (targetY - visualLaneY) * Math.min(1, dt / 90);
      const p = sprites.player;
      if (p.complete && p.naturalWidth > 0) {
        const ih = scale * 0.6, iw = ih * (p.naturalWidth / p.naturalHeight);
        ctx.drawImage(p, PLAYER_X * W - iw / 2, visualLaneY - ih * 0.62, iw, ih);
      }

      syncHud();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", down);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const start = () => {
    getSfx().start();
    try { getMusic().play(); } catch { /* */ }
    gameRef.current?.start();
  };

  return (
    <div className="game">
      <div className="game-hud">
        <div className="hud-score"><ScoreIcon size={17} /> {Math.round(hud.score).toLocaleString()}</div>
        <div className="hud-loot"><LootIcon size={16} /> {hud.lootHeld}</div>
        <div className="hud-flock"><FlockIcon size={16} /> {hud.flockCount}</div>
        <div className="hud-best"><TrophyIcon size={14} /> best {Math.round(best).toLocaleString()}</div>
      </div>

      <div className="game-stage" ref={wrapRef}>
        <canvas ref={canvasRef} className="game-canvas" />
        {flash && <div className={`heist-flash flash-${flash}`} />}

        {hud.phase === "idle" && (
          <div className="game-overlay">
            <h3>Rob the rich. Feed the flock.</h3>
            <p>Tap top, middle, or bottom to switch lanes. Grab the bags, dodge the guards. One bust and the run&apos;s over.</p>
            <button className="btn btn-neon btn-lg" onClick={start}>Start the job</button>
          </div>
        )}
        {hud.phase === "over" && (
          <div className="game-overlay">
            <h3>{hud.busted ? "BUSTED." : "Job's done."}</h3>
            <div className="over-row"><span><ScoreIcon size={17} /> {Math.round(hud.score).toLocaleString()}</span><span><FlockIcon size={16} /> {hud.flockCount} fed</span></div>
            <p className="over-best">{hud.score >= best ? "new heist record!" : `best ${Math.round(best).toLocaleString()}`}</p>
            <button className="btn btn-neon btn-lg" onClick={start}>Run it back</button>
          </div>
        )}
      </div>
    </div>
  );
}
