"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { CA, TICKER, X_URL, PUMP_URL, DEX_URL, isRealCA } from "./config";
import { XIcon, FlockIcon, TrophyIcon } from "./art/icons";
import { getSfx } from "./sfx";
import { getMusic } from "./music";
import { getBestScore, getBestFlock } from "./store";
import Enter from "./Enter";

const GameCanvas = dynamic(() => import("./game/GameCanvas"), { ssr: false });

const NAV = [
  { href: "#play", label: "Rob" },
  { href: "#how", label: "How" },
  { href: "#roster", label: "Crew" },
  { href: "/docs", label: "Docs" },
];

const CREW = [
  { img: "cat2", name: "THE HOOD", w: 285, h: 560 },
  { img: "cat3", name: "THE WHEELMAN", w: 342, h: 560 },
  { img: "cat5", name: "THE SAFECRACKER", w: 508, h: 560 },
  { img: "cat4", name: "THE LOOKOUT", w: 284, h: 420 },
  { img: "cat1", name: "THE MUSCLE", w: 336, h: 330 },
];

const HOW = [
  ["Switch lanes", "Tap the top, middle, or bottom of the street to move — or use the arrow keys on desktop."],
  ["Grab the bags", "Loot bags fill your pockets and add to your score. Guards, cameras, and lasers end the job on contact."],
  ["Feed the flock", "Run your loot past a flock cat to cash it in for a bonus. Hold too much too long and it's wasted if you get busted."],
];

const NOTES = [
  { h: "wtf is this", b: "One green cat, three lanes, and a whole street of guards between you and the bag." },
  { h: "the chain", b: "Built for Solana — fast blocks, cheap fees, a fair launch. $BITCATS runs with that." },
  { h: "the flock", b: "Rob the rich, feed the flock. Skip the deliveries and your loot never counts for anything." },
];

function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function CABlock() {
  const [copied, setCopied] = useState(false);
  const real = isRealCA();
  const copy = () => navigator.clipboard?.writeText(CA).then(() => { setCopied(true); getSfx().click(); setTimeout(() => setCopied(false), 1400); }).catch(() => {});
  return (
    <div className="ca">
      <span className="ca-label">CA</span>
      <code className="ca-value">{real ? CA : "SOON"}</code>
      {real && <button className="ca-copy" onClick={copy}>{copied ? "copied" : "copy"}</button>}
    </div>
  );
}

function BuyLinks({ small }: { small?: boolean }) {
  const cls = small ? "btn btn-sm" : "btn";
  return (
    <div className="buy">
      <a className={`${cls} btn-neon`} href={isRealCA() ? PUMP_URL + CA : PUMP_URL} target="_blank" rel="noreferrer">Pump Fun</a>
      <a className={`${cls} btn-ghost`} href={isRealCA() ? DEX_URL + CA : DEX_URL} target="_blank" rel="noreferrer">DexScreener</a>
    </div>
  );
}

function HallOfFame() {
  const [score, setScore] = useState(0);
  const [flock, setFlock] = useState(0);
  useEffect(() => {
    const refresh = () => { setScore(getBestScore()); setFlock(getBestFlock()); };
    refresh();
    window.addEventListener("hood:update", refresh);
    window.addEventListener("hood:awake", refresh);
    window.addEventListener("focus", refresh);
    return () => { window.removeEventListener("hood:update", refresh); window.removeEventListener("hood:awake", refresh); window.removeEventListener("focus", refresh); };
  }, []);
  return (
    <div className="records">
      <div className="record-card reveal"><TrophyIcon size={26} /><b>{score.toLocaleString()}</b><span>best heist</span></div>
      <div className="record-card reveal"><FlockIcon size={22} /><b>{flock}</b><span>best fed</span></div>
    </div>
  );
}

export default function Home() {
  useReveal();
  const [muted, setMutedState] = useState(false);
  useEffect(() => {
    const onAwake = () => setMutedState(getMusic().muted);
    window.addEventListener("hood:awake", onAwake);
    return () => window.removeEventListener("hood:awake", onAwake);
  }, []);
  const toggleMute = () => { const m = !muted; setMutedState(m); getMusic().setMuted(m); getSfx().setEnabled(!m); if (!m) getMusic().play(); };

  return (
    <>
      <Enter />
      <main>
        <header className="nav">
          <a href="#top" className="brand"><Image src="/x-avatar.png" alt="" width={26} height={26} style={{ borderRadius: "50%", objectFit: "cover" }} /> <b>Bit Cats</b> <span className="brand-ticker">{TICKER}</span></a>
          <nav className="nav-links">{NAV.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}</nav>
          <div className="nav-actions">
            <button className="icon-btn" onClick={toggleMute} title="sound">{muted ? "off" : "on"}</button>
            <a href={X_URL} target="_blank" rel="noreferrer" className="icon-btn" aria-label="X"><XIcon size={15} /></a>
            <a href="#play" className="btn btn-neon btn-sm">Rob</a>
          </div>
        </header>

        <section id="top" className="hero">
          <span className="pill reveal">heist runner · on Solana</span>
          <h1 className="hero-title reveal">BIT CATS</h1>
          <p className="hero-sub reveal">Rob the rich. Feed the flock. Don&apos;t get busted.</p>
          <div id="play" className="reveal"><GameCanvas /></div>
          <div className="hero-token reveal"><CABlock /><BuyLinks small /></div>
        </section>

        <section id="how" className="section">
          <div className="section-head reveal"><span className="pill">How to Rob</span><h2 className="section-title">Dodge. Grab. Deliver.</h2></div>
          <div className="how">
            {HOW.map(([h, b], i) => (
              <div className="how-item reveal" key={h}><span className="how-n">{i + 1}</span><h3>{h}</h3><p>{b}</p></div>
            ))}
          </div>
        </section>

        <section id="roster" className="section section-roster">
          <div className="section-head reveal"><span className="pill">Hall of Fame</span><h2 className="section-title">Your best job · the crew</h2><p className="section-lead">Records saved on your device. The rest of the crew waits outside.</p></div>
          <HallOfFame />
          <div className="roster reveal">
            {CREW.map((c) => (
              <div className="crew" key={c.name}>
                <div className="crew-pic"><Image src={`/cats/${c.img}.png`} alt={c.name} width={c.w} height={c.h} /></div>
                <span className="crew-name">{c.name}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="notes" className="section">
          <div className="section-head reveal"><span className="pill">Notes</span><h2 className="section-title">Crew notes</h2></div>
          <div className="notes-wall">
            {NOTES.map((n, i) => <article className={`note note-${i % 3} reveal`} key={n.h}><h3>{n.h}</h3><p>{n.b}</p></article>)}
          </div>
        </section>

        <footer className="footer">
          <div className="footer-top reveal">
            <a href="#top" className="brand"><Image src="/x-avatar.png" alt="" width={26} height={26} style={{ borderRadius: "50%", objectFit: "cover" }} /> <b>Bit Cats</b></a>
            <div className="footer-links"><a href="#play">Rob</a><a href="#how">How</a><a href="#roster">Crew</a><a href="/docs">Docs</a><a href={X_URL} target="_blank" rel="noreferrer" className="footer-x" aria-label="X"><XIcon size={14} /></a></div>
          </div>
          <div className="footer-buy reveal"><CABlock /><BuyLinks small /></div>
          <p className="footer-bottom">© {new Date().getFullYear()} {TICKER} · rob responsibly</p>
        </footer>
      </main>
    </>
  );
}
