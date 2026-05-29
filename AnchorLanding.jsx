/* eslint-disable -- Legacy prototype file, not part of the Next.js app build */
import { useState, useEffect, useRef } from "react";

const SECTIONS = ["Protocol", "How It Works", "Stats", "Why Base", "Get Started"];

const STATS = [
  { value: "0%", label: "Middleman cut", sub: "code is the escrow" },
  { value: "~2s", label: "Finality", sub: "Base L2 speed" },
  { value: "$0.001", label: "Avg gas fee", sub: "on Base network" },
  { value: "∞", label: "Trustless", sub: "no admin keys" },
];

const STEPS = [
  {
    num: "01",
    title: "Lock",
    desc: "Client creates a job and locks ETH into Anchor's smart contract. Funds leave your wallet once — straight to the contract.",
    tag: "createJob(freelancer, deadline)",
    color: "#0052FF",
  },
  {
    num: "02",
    title: "Build",
    desc: "Freelancer sees the locked funds on-chain. No invoices. No promises. The ETH is already there, waiting.",
    tag: "Status: Active",
    color: "#00C896",
  },
  {
    num: "03",
    title: "Release",
    desc: "Client approves → freelancer paid instantly. No middleman. No 3-day hold. The contract executes.",
    tag: "approveWork(jobId)",
    color: "#0052FF",
  },
  {
    num: "04",
    title: "Safety net",
    desc: "Dispute? Funds freeze. Deadline missed? Client reclaims automatically. The contract handles every outcome.",
    tag: "raiseDispute() | claimRefund()",
    color: "#FF6B35",
  },
];

const WHY = [
  { icon: "⚡", title: "Base-native speed", body: "Sub-second UX, $0.001 gas fees. Built for real users, not just degens with money to burn on L1." },
  { icon: "🔑", title: "Coinbase Smart Wallet", body: "Create a wallet with a passkey. No seed phrase. No extension. Works on mobile. Onboards normies." },
  { icon: "🔒", title: "No admin keys", body: "The contract has no owner, no pause function, no upgrade proxy. What you see is what runs." },
  { icon: "📡", title: "Live event feed", body: "Every job creation, approval, and dispute emits an on-chain event. Watch it happen in real time." },
];

// Animated counter hook
function useCounter(target, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const num = parseFloat(target.replace(/[^0-9.]/g, ""));
    if (isNaN(num)) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * num));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

// Floating particle
function Particle({ style }) {
  return (
    <div
      style={{
        position: "absolute",
        width: 2,
        height: 2,
        borderRadius: "50%",
        background: "rgba(0,82,255,0.4)",
        animation: `float ${style.duration}s ease-in-out ${style.delay}s infinite alternate`,
        ...style,
      }}
    />
  );
}

export default function AnchorLanding() {
  const [activeSection, setActiveSection] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const [hoveredStep, setHoveredStep] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);
  const statsRef = useRef(null);

  const particles = Array.from({ length: 18 }, (_, i) => ({
    left: `${(i * 17 + 5) % 95}%`,
    top: `${(i * 23 + 10) % 90}%`,
    duration: 3 + (i % 3),
    delay: (i * 0.4) % 3,
    opacity: 0.2 + (i % 5) * 0.1,
  }));

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const handleMouse = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const copyAddr = () => {
    navigator.clipboard.writeText("0x — deploy yours first").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ fontFamily: "'IBM Plex Mono', 'Fira Code', monospace", background: "#040812", color: "#E8ECFF", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes float { from { transform: translateY(0px) translateX(0px); } to { transform: translateY(-12px) translateX(6px); } }
        @keyframes pulse-ring { 0%,100% { opacity: 0.15; transform: scale(1); } 50% { opacity: 0.35; transform: scale(1.05); } }
        @keyframes scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(400%); } }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .nav-link { color: #7A88B8; text-decoration: none; font-size: 12px; letter-spacing: 0.08em; cursor: pointer; transition: color 0.2s; }
        .nav-link:hover, .nav-link.active { color: #E8ECFF; }
        .btn-primary { background: #0052FF; color: white; border: none; padding: 14px 32px; font-family: inherit; font-size: 13px; font-weight: 600; letter-spacing: 0.1em; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden; }
        .btn-primary::after { content: ''; position: absolute; inset: 0; background: rgba(255,255,255,0.1); opacity: 0; transition: opacity 0.2s; }
        .btn-primary:hover::after { opacity: 1; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 30px rgba(0,82,255,0.4); }
        .btn-outline { background: transparent; color: #7A88B8; border: 1px solid rgba(122,136,184,0.3); padding: 14px 32px; font-family: inherit; font-size: 13px; letter-spacing: 0.1em; cursor: pointer; transition: all 0.2s; }
        .btn-outline:hover { color: #E8ECFF; border-color: rgba(122,136,184,0.7); }
        .step-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(122,136,184,0.1); padding: 32px; cursor: default; transition: all 0.3s; position: relative; overflow: hidden; }
        .step-card:hover { border-color: rgba(0,82,255,0.4); background: rgba(0,82,255,0.04); transform: translateY(-2px); }
        .step-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(0,82,255,0.6), transparent); opacity: 0; transition: opacity 0.3s; }
        .step-card:hover::before { opacity: 1; }
        .stat-card { text-align: center; padding: 40px 24px; border: 1px solid rgba(122,136,184,0.1); background: rgba(255,255,255,0.015); transition: all 0.3s; }
        .stat-card:hover { border-color: rgba(0,82,255,0.35); background: rgba(0,82,255,0.03); }
        .why-card { padding: 28px; border: 1px solid rgba(122,136,184,0.1); background: rgba(255,255,255,0.02); transition: all 0.25s; }
        .why-card:hover { border-color: rgba(0,82,255,0.3); background: rgba(0,82,255,0.04); }
        .tag { display: inline-block; background: rgba(0,82,255,0.12); border: 1px solid rgba(0,82,255,0.25); color: #6E9EFF; font-size: 11px; padding: 4px 10px; letter-spacing: 0.06em; font-family: 'IBM Plex Mono', monospace; }
        .grid-line { position: absolute; background: rgba(0,82,255,0.04); }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #040812; } ::-webkit-scrollbar-thumb { background: rgba(0,82,255,0.3); }
      `}</style>

      {/* Grid background */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="grid-line" style={{ left: `${12.5 * i}%`, top: 0, bottom: 0, width: 1 }} />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="grid-line" style={{ top: `${16.6 * i}%`, left: 0, right: 0, height: 1 }} />
        ))}
        {/* Radial glow */}
        <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, background: "radial-gradient(circle, rgba(0,82,255,0.08) 0%, transparent 70%)", borderRadius: "50%" }} />
        {/* Mouse follow glow */}
        <div style={{ position: "fixed", left: mousePos.x - 200, top: mousePos.y - 200, width: 400, height: 400, background: "radial-gradient(circle, rgba(0,82,255,0.04) 0%, transparent 60%)", borderRadius: "50%", pointerEvents: "none", transition: "left 0.3s ease, top 0.3s ease" }} />
      </div>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, borderBottom: "1px solid rgba(122,136,184,0.1)", background: "rgba(4,8,18,0.9)", backdropFilter: "blur(12px)", padding: "0 48px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 20 }}>⚓</div>
          <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.15em", color: "#E8ECFF" }}>ANCHOR</span>
          <div style={{ background: "rgba(0,82,255,0.15)", border: "1px solid rgba(0,82,255,0.3)", color: "#6E9EFF", fontSize: 9, padding: "2px 8px", letterSpacing: "0.12em", marginLeft: 4 }}>BASE</div>
        </div>
        <div style={{ display: "flex", gap: 36 }}>
          {SECTIONS.map((s, i) => (
            <span key={s} className={`nav-link${activeSection === i ? " active" : ""}`} onClick={() => setActiveSection(i)}>{s}</span>
          ))}
        </div>
        <button className="btn-primary" style={{ padding: "8px 20px", fontSize: 11 }}>Launch App</button>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "120px 48px 80px", position: "relative", zIndex: 1 }}>
        {/* Particles */}
        {particles.map((p, i) => <Particle key={i} style={p} />)}

        {/* Anchor icon */}
        <div style={{ position: "relative", marginBottom: 40 }}>
          <div style={{ fontSize: 64, lineHeight: 1, animation: "float 4s ease-in-out infinite alternate" }}>⚓</div>
          <div style={{ position: "absolute", inset: -20, borderRadius: "50%", border: "1px solid rgba(0,82,255,0.2)", animation: "pulse-ring 3s ease-in-out infinite" }} />
          <div style={{ position: "absolute", inset: -36, borderRadius: "50%", border: "1px solid rgba(0,82,255,0.08)", animation: "pulse-ring 3s ease-in-out 0.5s infinite" }} />
        </div>

        <div style={{ textAlign: "center", maxWidth: 780, animation: "fadeUp 0.8s ease both" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,200,150,0.08)", border: "1px solid rgba(0,200,150,0.2)", padding: "6px 16px", marginBottom: 28, color: "#00C896", fontSize: 11, letterSpacing: "0.12em" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00C896", display: "inline-block", animation: "blink 1.5s ease-in-out infinite" }} />
            LIVE ON BASE SEPOLIA
          </div>

          <h1 style={{ fontSize: "clamp(40px, 7vw, 76px)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 24 }}>
            <span style={{ color: "#E8ECFF" }}>Trustless escrow</span>
            <br />
            <span style={{ color: "#0052FF" }}>for onchain work.</span>
          </h1>

          <p style={{ fontSize: 16, color: "#7A88B8", lineHeight: 1.7, marginBottom: 40, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 300 }}>
            Lock ETH in a smart contract. Release on approval.<br />
            No middlemen. No invoices. No chasing payments.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" style={{ fontSize: 13 }}>Connect Wallet</button>
            <button className="btn-outline" style={{ fontSize: 13 }}>Read the Docs →</button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "#3A4870", fontSize: 10, letterSpacing: "0.12em" }}>
          <span>SCROLL</span>
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, rgba(0,82,255,0.6), transparent)" }} />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "100px 48px", position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 64 }}>
          <div style={{ width: 32, height: 1, background: "#0052FF" }} />
          <span style={{ color: "#0052FF", fontSize: 11, letterSpacing: "0.2em", fontWeight: 600 }}>HOW IT WORKS</span>
        </div>

        <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16, color: "#E8ECFF" }}>
          Four states.<br />Zero trust required.
        </h2>
        <p style={{ color: "#7A88B8", fontSize: 14, marginBottom: 60, lineHeight: 1.6 }}>
          Every Anchor job is a state machine. The contract enforces every transition.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 1, background: "rgba(122,136,184,0.1)" }}>
          {STEPS.map((step, i) => (
            <div key={i} className="step-card" onMouseEnter={() => setHoveredStep(i)} onMouseLeave={() => setHoveredStep(null)} style={{ background: hoveredStep === i ? "rgba(0,82,255,0.04)" : "rgba(4,8,18,0.95)" }}>
              <div style={{ fontSize: 11, color: "#3A4870", letterSpacing: "0.15em", marginBottom: 20, fontWeight: 600 }}>{step.num}</div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: hoveredStep === i ? step.color : "#E8ECFF", marginBottom: 16, transition: "color 0.3s", letterSpacing: "-0.01em" }}>{step.title}</h3>
              <p style={{ fontSize: 13, color: "#7A88B8", lineHeight: 1.7, marginBottom: 24 }}>{step.desc}</p>
              <span className="tag">{step.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section ref={statsRef} style={{ padding: "80px 48px", background: "rgba(0,82,255,0.03)", borderTop: "1px solid rgba(0,82,255,0.1)", borderBottom: "1px solid rgba(0,82,255,0.1)", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 1, background: "rgba(0,82,255,0.1)" }}>
          {STATS.map((s, i) => (
            <div key={i} className="stat-card" style={{ background: "#040812" }}>
              <div style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 700, color: "#0052FF", letterSpacing: "-0.03em", marginBottom: 8, fontVariantNumeric: "tabular-nums" }}>
                {s.value}
              </div>
              <div style={{ fontSize: 13, color: "#E8ECFF", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: "#3A4870", letterSpacing: "0.08em" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY BASE */}
      <section style={{ padding: "100px 48px", position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 64 }}>
          <div style={{ width: 32, height: 1, background: "#0052FF" }} />
          <span style={{ color: "#0052FF", fontSize: 11, letterSpacing: "0.2em", fontWeight: 600 }}>WHY BASE</span>
        </div>

        <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 60, color: "#E8ECFF" }}>
          Built where the users are.
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {WHY.map((w, i) => (
            <div key={i} className="why-card">
              <div style={{ fontSize: 28, marginBottom: 16 }}>{w.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#E8ECFF", marginBottom: 10, letterSpacing: "0.02em" }}>{w.title}</h3>
              <p style={{ fontSize: 13, color: "#7A88B8", lineHeight: 1.7 }}>{w.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTRACT SECTION */}
      <section style={{ padding: "80px 48px", background: "rgba(0,82,255,0.02)", borderTop: "1px solid rgba(122,136,184,0.08)", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 40 }}>
            <div style={{ width: 32, height: 1, background: "#0052FF" }} />
            <span style={{ color: "#0052FF", fontSize: 11, letterSpacing: "0.2em", fontWeight: 600 }}>THE CONTRACT</span>
          </div>

          <div style={{ background: "#0D1117", border: "1px solid rgba(0,82,255,0.2)", padding: "32px", position: "relative", overflow: "hidden" }}>
            {/* scan line effect */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, rgba(0,82,255,0.6), transparent)", animation: "scan 4s linear infinite" }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: "#3A4870", letterSpacing: "0.12em", marginBottom: 6 }}>DEPLOYED CONTRACT</div>
                <div style={{ fontSize: 13, color: "#6E9EFF", fontFamily: "monospace" }}>Anchor.sol · Base Sepolia</div>
              </div>
              <button onClick={copyAddr} style={{ background: "rgba(0,82,255,0.12)", border: "1px solid rgba(0,82,255,0.25)", color: "#6E9EFF", fontSize: 11, padding: "6px 14px", cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.08em", transition: "all 0.2s" }}>
                {copied ? "✓ COPIED" : "COPY ADDRESS"}
              </button>
            </div>

            {[
              "function createJob(address freelancer, uint256 deadline) payable",
              "function approveWork(uint256 jobId)",
              "function raiseDispute(uint256 jobId)",
              "function claimRefund(uint256 jobId)",
            ].map((fn, i) => (
              <div key={i} style={{ padding: "10px 16px", marginBottom: 6, background: "rgba(0,82,255,0.04)", borderLeft: "2px solid rgba(0,82,255,0.3)", fontSize: 12, color: "#A8D8A8", fontFamily: "monospace", letterSpacing: "0.02em", transition: "all 0.2s", cursor: "default" }}
                onMouseEnter={e => { e.currentTarget.style.borderLeftColor = "#0052FF"; e.currentTarget.style.background = "rgba(0,82,255,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderLeftColor = "rgba(0,82,255,0.3)"; e.currentTarget.style.background = "rgba(0,82,255,0.04)"; }}>
                <span style={{ color: "#6E9EFF" }}>function</span> {fn.replace("function ", "")}
              </div>
            ))}

            <div style={{ marginTop: 20, padding: "12px 16px", background: "rgba(0,200,150,0.05)", border: "1px solid rgba(0,200,150,0.15)", fontSize: 11, color: "#00C896", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00C896", display: "inline-block" }} />
              VERIFIED ON BASESCAN · NO ADMIN KEYS · OPEN SOURCE
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "120px 48px", position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 500, height: 500, background: "radial-gradient(circle, rgba(0,82,255,0.07) 0%, transparent 65%)", borderRadius: "50%", pointerEvents: "none" }} />

        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 48, marginBottom: 24 }}>⚓</div>
          <h2 style={{ fontSize: "clamp(28px, 5vw, 56px)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16, color: "#E8ECFF" }}>
            Drop the invoices.<br />
            <span style={{ color: "#0052FF" }}>Ship with Anchor.</span>
          </h2>
          <p style={{ color: "#7A88B8", fontSize: 15, marginBottom: 48, lineHeight: 1.6 }}>
            The contract doesn't care who you are.<br />It just runs.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" style={{ fontSize: 14, padding: "16px 40px" }}>Launch App</button>
            <button className="btn-outline" style={{ fontSize: 14, padding: "16px 40px" }}>View on GitHub →</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(122,136,184,0.1)", padding: "40px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>⚓</span>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", color: "#3A4870" }}>ANCHOR</span>
          <span style={{ fontSize: 11, color: "#3A4870", marginLeft: 8 }}>// Trustless escrow on Base</span>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Docs", "GitHub", "Basescan", "Discord"].map(l => (
            <span key={l} style={{ fontSize: 11, color: "#3A4870", cursor: "pointer", letterSpacing: "0.08em", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#7A88B8"}
              onMouseLeave={e => e.currentTarget.style.color = "#3A4870"}>
              {l}
            </span>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#1E2840", letterSpacing: "0.08em" }}>Built on Base · {new Date().getFullYear()}</div>
      </footer>
    </div>
  );
}
