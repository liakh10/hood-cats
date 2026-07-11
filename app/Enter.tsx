"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getMusic } from "./music";
import { getSfx } from "./sfx";
import { hoodCatSvg } from "./art/cats";

const BOOT_LINES = ["casing the vault", "cutting the cameras", "recruiting the crew", "checking for snitches"];

type Phase = "boot" | "wake" | "gone";

export default function Enter() {
  const [phase, setPhase] = useState<Phase>("boot");
  const [pct, setPct] = useState(0);
  const [lines, setLines] = useState<string[]>([]);
  const [leaving, setLeaving] = useState(false);
  const done = useRef(false);
  const mascotSrc = useMemo(
    () => "data:image/svg+xml;charset=utf-8," + encodeURIComponent(hoodCatSvg("#c9a876", "#232733", "#f2c14e")),
    []
  );

  useEffect(() => {
    if (phase !== "gone") document.body.style.overflow = "hidden"; else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [phase]);

  useEffect(() => {
    if (phase !== "boot") return;
    let p = 0;
    const id = window.setInterval(() => {
      p = Math.min(100, p + 4 + Math.random() * 7);
      setPct(Math.round(p));
      const have = Math.min(BOOT_LINES.length, Math.ceil((p / 100) * BOOT_LINES.length));
      setLines((prev) => (prev.length < have ? BOOT_LINES.slice(0, have) : prev));
      if (p >= 100) { clearInterval(id); setTimeout(() => setPhase("wake"), 360); }
    }, 130);
    return () => clearInterval(id);
  }, [phase]);

  const wake = () => {
    if (done.current) return;
    done.current = true;
    try { getMusic().play(); } catch { /* */ }
    getSfx().start();
    setLeaving(true);
    window.dispatchEvent(new Event("hood:awake"));
    setTimeout(() => setPhase("gone"), 620);
  };

  if (phase === "gone") return null;

  return (
    <div className={`enter ${leaving ? "enter-leaving" : ""}`}>
      {phase === "boot" && (
        <div className="boot">
          <p className="boot-title">HOOD CATS ONLINE</p>
          <div className="boot-bar"><span className="boot-fill" style={{ width: `${pct}%` }} /></div>
          <p className="boot-pct">{pct}%</p>
          <ul className="boot-log">{lines.map((l, i) => <li key={i}><span className="boot-ok">›</span> {l}…</li>)}</ul>
        </div>
      )}
      {phase === "wake" && (
        <button className="wake" onClick={wake} aria-label="Tap to rob">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="wake-img" src={mascotSrc} alt="" width={220} height={188} />
          <span className="wake-cta">tap to rob</span>
          <span className="wake-sub">sound on · dodge the guards, grab the bags</span>
        </button>
      )}
    </div>
  );
}
