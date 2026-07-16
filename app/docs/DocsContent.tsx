"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CA, TICKER, PUMP_URL, DEX_URL, isRealCA } from "../config";

const SECTIONS = [
  { id: "overview", label: "What is Bit Cats?" },
  { id: "controls", label: "Gameplay & Controls" },
  { id: "street", label: "The Street" },
  { id: "scoring", label: "Loot & Flock Bonus" },
  { id: "token", label: `${TICKER} Token` },
  { id: "local", label: "Local & Free" },
  { id: "roadmap", label: "Roadmap" },
  { id: "faq", label: "FAQ" },
];

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="docs-row">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export default function DocsContent() {
  const [active, setActive] = useState("overview");
  const refs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => { for (const e of entries) if (e.isIntersecting) setActive(e.target.id); },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );
    for (const s of SECTIONS) { const el = refs.current[s.id]; if (el) io.observe(el); }
    return () => io.disconnect();
  }, []);

  const real = isRealCA();

  return (
    <>
      <header className="nav">
        <Link href="/#top" className="brand"><Image src="/cats/cat2.png" alt="" width={26} height={51} className="brand-mascot" /> <b>Bit Cats</b> <span className="brand-ticker">{TICKER}</span></Link>
        <nav className="nav-links">
          <Link href="/#play">Rob</Link>
          <Link href="/#how">How</Link>
          <Link href="/#roster">Crew</Link>
          <span className="docs-nav-crumb">Docs</span>
        </nav>
        <div className="nav-actions">
          <Link href="/#play" className="btn btn-neon btn-sm">Rob</Link>
        </div>
      </header>

      <div className="docs-shell">
        <aside className="docs-side">
          <span className="docs-kicker">Field Manual</span>
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={`docs-nav-link ${active === s.id ? "active" : ""}`}>{s.label}</a>
          ))}
        </aside>

        <main className="docs-main">
          <div className="docs-hero">
            <h1>Bit Cats Docs</h1>
            <p>Everything about the heist runner, the crew, and {TICKER} — in one page.</p>
          </div>

          <section id="overview" ref={(el) => { refs.current.overview = el; }} className="docs-section">
            <h2>What is Bit Cats?</h2>
            <p>
              Bit Cats is a 3-lane heist runner, playable instantly in the browser — no download,
              no signup. The street scrolls toward you at a growing speed; switch lanes to grab loot and
              dodge guards, lasers, and cameras.
            </p>
            <div className="docs-table">
              <Row label="Ticker">{TICKER} (Solana, fair launch)</Row>
              <Row label="Format">Single-player 3-lane runner, one-hit-and-you&apos;re-busted</Row>
              <Row label="Cost to play">Free, unlimited, no wallet required</Row>
            </div>
          </section>

          <section id="controls" ref={(el) => { refs.current.controls = el; }} className="docs-section">
            <h2>Gameplay & Controls</h2>
            <p>Three lanes, one wrong move ends the job.</p>
            <div className="docs-table">
              <Row label="Switch lanes">Tap the top, middle, or bottom third of the street — or use the arrow keys on desktop</Row>
              <Row label="Grab loot">Loot bags in your lane fill your pockets automatically as you cross them</Row>
              <Row label="Busted">Touching a guard, laser, or camera in your lane ends the run immediately</Row>
              <Row label="Speed">Rises automatically the longer a run lasts</Row>
            </div>
          </section>

          <section id="street" ref={(el) => { refs.current.street = el; }} className="docs-section">
            <h2>The Street</h2>
            <p>Three kinds of things spawn ahead of you, one per lane at a time.</p>
            <div className="docs-table">
              <Row label="Loot bag">Adds to your pocket and your score — the most common spawn</Row>
              <Row label="Obstacle">Guard, laser, or camera — touching any of them busts the run</Row>
              <Row label="Flock cat">Cash in whatever loot you&apos;re holding for a bonus — the rarest spawn</Row>
            </div>
          </section>

          <section id="scoring" ref={(el) => { refs.current.scoring = el; }} className="docs-section">
            <h2>Loot & Flock Bonus</h2>
            <p>Loot alone is worth something, but delivering it to the flock is worth a lot more.</p>
            <div className="docs-table">
              <Row label="Loot value">Each bag grabbed adds a fixed amount to your score and your held count</Row>
              <Row label="Flock delivery">Passing a flock cat while holding loot cashes it all in at a large multiplier, then empties your pockets</Row>
              <Row label="Wasted loot">Getting busted while holding loot loses it — nothing is banked until it&apos;s delivered</Row>
              <Row label="Best heist / best fed">Best score and best flock-deliveries-in-a-run, both saved locally</Row>
            </div>
          </section>

          <section id="token" ref={(el) => { refs.current.token = el; }} className="docs-section">
            <h2>{TICKER} Token</h2>
            <p>The game has no in-game currency or shop — {TICKER} is a separate community token that doesn&apos;t affect gameplay, spawn rates, or scoring in any way.</p>
            <div className="docs-table">
              <Row label="Chain">Solana</Row>
              <Row label="Contract">{real ? <code className="mono">{CA}</code> : "SOON — not launched yet"}</Row>
              <Row label="Launch style">Fair launch on Pump Fun, no presale, no team allocation</Row>
              <Row label="Buy links">
                <a href={real ? PUMP_URL + CA : PUMP_URL} target="_blank" rel="noreferrer">Pump Fun</a>
                {" · "}
                <a href={real ? DEX_URL + CA : DEX_URL} target="_blank" rel="noreferrer">DexScreener</a>
              </Row>
            </div>
          </section>

          <section id="local" ref={(el) => { refs.current.local = el; }} className="docs-section">
            <h2>Local & Free</h2>
            <p>No backend, no account, no wallet gate on the game itself. Your records live only in this browser.</p>
            <div className="docs-table">
              <Row label="Storage">Best heist score and best flock deliveries saved to this browser&apos;s localStorage</Row>
              <Row label="Device-local">Clearing site data or switching browsers/devices resets your records</Row>
              <Row label="No leaderboard">Scores aren&apos;t submitted anywhere — the Hall of Fame is a personal record only</Row>
            </div>
            <p className="docs-note">Cross-device syncing, shared leaderboards, and any real-money mechanic are not built — see Roadmap below.</p>
          </section>

          <section id="roadmap" ref={(el) => { refs.current.roadmap = el; }} className="docs-section">
            <h2>Roadmap</h2>
            <div className="docs-table">
              <Row label="Live">3-lane heist runner, loot/obstacle/flock spawns, local best heist & best fed</Row>
              <Row label="Planned">New obstacle types, alternate streets/backdrops</Row>
              <Row label="Token">{TICKER} fair launch — CA appears here and on the buy links the moment it&apos;s live</Row>
            </div>
          </section>

          <section id="faq" ref={(el) => { refs.current.faq = el; }} className="docs-section">
            <h2>FAQ</h2>
            <dl className="docs-faq">
              <dt>Do I need a wallet to play?</dt>
              <dd>No. Bit Cats is fully playable free, with no connection of any kind.</dd>
              <dt>Is {TICKER} live yet?</dt>
              <dd>Not yet. The contract address on this page reads &quot;SOON&quot; until it launches.</dd>
              <dt>What happens to loot I&apos;m holding when I get busted?</dt>
              <dd>It&apos;s lost — only loot delivered to a flock cat before the run ends counts toward your score.</dd>
            </dl>
          </section>
        </main>
      </div>
    </>
  );
}
