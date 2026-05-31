"use client";
// ─── Navbar ─────────────────────────────────────────────────────────────────
// Fixed nav that hides on scroll-down and reveals on scroll-up.
// Mobile bottom drawer includes direct MetaMask & Phantom deep-link buttons
// so mobile users can connect without the RainbowKit modal.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { NAV_LINKS } from "@/lib/constants";

// Create an animated Link wrapper using motion.create() (Framer Motion v12+)
// to avoid the deprecated legacyBehavior prop while keeping Next.js prefetching.
const MotionLink = motion.create(Link);

// ── Wallet icon SVGs ──────────────────────────────────────────────────────────
const MetaMaskIcon = () => (
  <svg width="24" height="24" viewBox="0 0 318.6 318.6" xmlns="http://www.w3.org/2000/svg">
    <polygon fill="#e2761b" stroke="#e2761b" strokeLinecap="round" strokeLinejoin="round" points="274.1,35.5 174.6,109.4 193,65.8"/>
    <polygon fill="#e4761b" stroke="#e4761b" strokeLinecap="round" strokeLinejoin="round" points="44.4,35.5 143.1,110.1 125.6,65.8"/>
    <polygon fill="#e4761b" stroke="#e4761b" strokeLinecap="round" strokeLinejoin="round" points="238.3,206.8 211.8,247.4 268.5,263 284.8,207.7"/>
    <polygon fill="#e4761b" stroke="#e4761b" strokeLinecap="round" strokeLinejoin="round" points="33.9,207.7 50.1,263 106.8,247.4 80.3,206.8"/>
    <polygon fill="#e4761b" stroke="#e4761b" strokeLinecap="round" strokeLinejoin="round" points="103.6,138.2 87.8,162.1 144.1,164.6 142.1,104.1"/>
    <polygon fill="#e4761b" stroke="#e4761b" strokeLinecap="round" strokeLinejoin="round" points="214.9,138.2 175.9,103.4 174.6,164.6 230.8,162.1"/>
    <polygon fill="#e4761b" stroke="#e4761b" strokeLinecap="round" strokeLinejoin="round" points="106.8,247.4 140.6,230.9 111.4,208.1"/>
    <polygon fill="#e4761b" stroke="#e4761b" strokeLinecap="round" strokeLinejoin="round" points="177.9,230.9 211.8,247.4 207.1,208.1"/>
  </svg>
);

const PhantomIcon = () => (
  <svg width="24" height="24" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
    <circle cx="64" cy="64" r="64" fill="#ab9ff2"/>
    <path fill="#fff" d="M110.5 64c0-25.7-20.8-46.5-46.5-46.5S17.5 38.3 17.5 64c0 23.8 17.8 43.5 41 46.1v-12.7c-15.8-2.5-27.9-16.2-27.9-33.4 0-18.7 15.1-33.8 33.8-33.8a33.67 33.67 0 0 1 33.8 33.8c0 9.6-4 18.2-10.3 24.4h-12c7.3-5.5 12-14.1 12-23.8 0-16.5-13.4-29.9-29.9-29.9A29.9 29.9 0 0 0 28.1 88.4h13.2a16.7 16.7 0 0 1 16.6-15.5c9.3 0 16.8 7.5 16.8 16.8 0 9.3-7.5 16.8-16.8 16.8h-1.4v12.1c.5 0 .9.1 1.4.1 25.7 0 46.5-20.8 46.5-46.5z"/>
  </svg>
);

// ── Mobile wallet detection helpers ───────────────────────────────────────────
// These helpers are only called client-side (after mount) to avoid SSR/CSR
// hydration mismatches caused by typeof window checks during render.
function isMobileBrowser(): boolean {
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}

function isMetaMaskInstalled(): boolean {
  return !!(window.ethereum && (window.ethereum as { isMetaMask?: boolean }).isMetaMask);
}

function isPhantomInstalled(): boolean {
  return !!(window as { phantom?: { ethereum?: unknown } }).phantom?.ethereum;
}

// MetaMask mobile deep link: opens the Anchor dApp inside MetaMask's browser
function openMetaMaskMobile() {
  const dappUrl = window.location.href.replace(/^https?:\/\//, "");
  window.open(`https://metamask.app.link/dapp/${dappUrl}`, "_blank");
}

// Phantom mobile deep link: opens the dApp inside Phantom's browser
function openPhantomMobile() {
  const dappUrl = encodeURIComponent(window.location.href);
  window.open(`https://phantom.app/ul/browse/${dappUrl}?ref=${encodeURIComponent(window.location.origin)}`, "_blank");
}

export default function Navbar() {
  const [atTop, setAtTop] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { openConnectModal } = useConnectModal();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  // Initialise to false (matches SSR output) and resolve after mount to avoid
  // hydration mismatches from reading window/navigator during render.
  const [isMobile, setIsMobile] = useState(false);
  const [hasMetaMask, setHasMetaMask] = useState(false);
  const [hasPhantom, setHasPhantom] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setIsMobile(isMobileBrowser());
    setHasMetaMask(isMetaMaskInstalled());
    setHasPhantom(isPhantomInstalled());
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setAtTop(window.scrollY < 60);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const sectionIds = ["protocol", "how-it-works", "stats", "why-base", "get-started"];

  // Shortened address for display: 0x1234...abcd
  const shortAddress = address
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : null;

  return (
    <>
      <nav
        id="navbar"
        className="nav-padding"
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 100,
          borderBottom: atTop ? "1px solid transparent" : "1px solid rgba(122,136,184,0.1)",
          background: atTop
            ? "rgba(4,8,18,0)"
            : "rgba(4,8,18,0.88)",
          backdropFilter: atTop ? "none" : "blur(16px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
          transition: "background 0.3s, border-color 0.3s, backdrop-filter 0.3s",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <motion.span
            style={{ fontSize: 22 }}
            animate={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            ⚓
          </motion.span>
          <span style={{
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.18em",
            color: "var(--color-text-primary)",
          }}>
            ANCHOR
          </span>
          <div style={{
            background: "rgba(0,82,255,0.15)",
            border: "1px solid rgba(0,82,255,0.3)",
            color: "var(--color-blue-l)",
            fontSize: 9,
            padding: "2px 8px",
            letterSpacing: "0.12em",
            marginLeft: 4,
          }}>
            BASE
          </div>
        </div>

        {/* Links */}
        <div className="hide-on-mobile" style={{ display: "flex", gap: 36 }}>
          {NAV_LINKS.map((label, i) => (
            <button
              key={label}
              id={`nav-link-${i}`}
              onClick={() => scrollTo(sectionIds[i])}
              style={{
                background: "none",
                border: "none",
                color: "var(--color-text-secondary)",
                fontSize: 12,
                letterSpacing: "0.08em",
                cursor: "pointer",
                fontFamily: "var(--font-mono)",
                padding: 0,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-secondary)")}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Right side: CTA & Hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Replaced Link + legacyBehavior + motion.button with a single MotionLink for valid HTML and Next.js 13+ standards */}
          <MotionLink
            id="nav-launch-app"
            href="/dashboard"
            className="btn-primary hide-on-mobile"
            style={{ padding: "8px 20px", fontSize: 11, textDecoration: "none", display: "inline-block" }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Launch App
          </MotionLink>

          <button
            className="show-on-mobile"
            onClick={() => setIsDrawerOpen(true)}
            style={{
              background: "none",
              border: "none",
              color: "var(--color-text-primary)",
              fontSize: 24,
              cursor: "pointer",
              padding: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ☰
          </button>
        </div>
      </nav>

      {/* ── Mobile Bottom Drawer ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(4px)",
                zIndex: 200,
              }}
            />

            {/* Drawer panel */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                background: "#080f1e",
                borderTop: "1px solid rgba(0,82,255,0.2)",
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                padding: "32px 24px 40px",
                zIndex: 201,
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >
              {/* Drag handle */}
              <div style={{
                width: 40, height: 4,
                background: "rgba(122,136,184,0.3)",
                borderRadius: 2,
                margin: "-16px auto 0",
              }} />

              {/* Nav links */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {NAV_LINKS.map((label, i) => (
                  <button
                    key={label}
                    onClick={() => {
                      setIsDrawerOpen(false);
                      setTimeout(() => scrollTo(sectionIds[i]), 300);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--color-text-primary)",
                      fontSize: 16,
                      textAlign: "left",
                      padding: "10px 0",
                      letterSpacing: "0.05em",
                      fontFamily: "var(--font-mono)",
                      borderBottom: "1px solid rgba(122,136,184,0.08)",
                      cursor: "pointer",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* ── Wallet section ───────────────────────────────────────────── */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <p style={{
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  color: "var(--color-text-muted)",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}>
                  Connect Wallet
                </p>

                {isConnected && shortAddress ? (
                  // Already connected — show address + disconnect
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{
                      background: "rgba(0,82,255,0.08)",
                      border: "1px solid rgba(0,82,255,0.25)",
                      borderRadius: 12,
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 8, height: 8, borderRadius: "50%",
                          background: "var(--color-green)",
                          boxShadow: "0 0 8px var(--color-green)",
                        }} />
                        <span style={{ fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }}>
                          {shortAddress}
                        </span>
                      </div>
                      <button
                        onClick={() => disconnect()}
                        style={{
                          background: "none", border: "none",
                          color: "var(--color-text-muted)",
                          fontSize: 11, cursor: "pointer",
                          letterSpacing: "0.06em",
                        }}
                      >
                        Disconnect
                      </button>
                    </div>
                    {/* Replaced Link + legacyBehavior + motion.button with a single MotionLink for valid HTML and Next.js 13+ standards */}
                    <MotionLink
                      href="/dashboard"
                      className="btn-primary"
                      style={{ padding: "14px 20px", fontSize: 14, width: "100%", textDecoration: "none", display: "inline-block", textAlign: "center" }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setIsDrawerOpen(false)}
                    >
                      Launch App
                    </MotionLink>
                  </div>
                ) : isMobile ? (
                  // On mobile: show direct deep-link buttons for MetaMask & Phantom.
                  // isMobile is resolved client-side only (useEffect) so this branch
                  // never renders during SSR, preventing hydration mismatches.
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {/* MetaMask deep link */}
                    <motion.button
                      id="mobile-connect-metamask"
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        if (hasMetaMask) {
                          // Extension already injected (unlikely on mobile but some tablets)
                          openConnectModal?.();
                        } else {
                          openMetaMaskMobile();
                        }
                        setIsDrawerOpen(false);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        background: "rgba(226,118,27,0.08)",
                        border: "1px solid rgba(226,118,27,0.25)",
                        borderRadius: 12,
                        padding: "14px 18px",
                        cursor: "pointer",
                        width: "100%",
                        color: "white",
                        fontSize: 15,
                        fontWeight: 600,
                      }}
                    >
                      <MetaMaskIcon />
                      <span>{hasMetaMask ? "MetaMask" : "Open in MetaMask"}</span>
                      {!hasMetaMask && (
                        <span style={{ marginLeft: "auto", fontSize: 11, color: "rgba(226,118,27,0.7)" }}>↗</span>
                      )}
                    </motion.button>

                    {/* Phantom deep link */}
                    <motion.button
                      id="mobile-connect-phantom"
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        if (hasPhantom) {
                          openConnectModal?.();
                        } else {
                          openPhantomMobile();
                        }
                        setIsDrawerOpen(false);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        background: "rgba(171,159,242,0.08)",
                        border: "1px solid rgba(171,159,242,0.25)",
                        borderRadius: 12,
                        padding: "14px 18px",
                        cursor: "pointer",
                        width: "100%",
                        color: "white",
                        fontSize: 15,
                        fontWeight: 600,
                      }}
                    >
                      <PhantomIcon />
                      <span>{hasPhantom ? "Phantom" : "Open in Phantom"}</span>
                      {!hasPhantom && (
                        <span style={{ marginLeft: "auto", fontSize: 11, color: "rgba(171,159,242,0.7)" }}>↗</span>
                      )}
                    </motion.button>

                    {/* WalletConnect QR fallback */}
                    <button
                      id="mobile-connect-wc"
                      onClick={() => {
                        openConnectModal?.();
                        setIsDrawerOpen(false);
                      }}
                      style={{
                        background: "none",
                        border: "1px solid rgba(122,136,184,0.2)",
                        borderRadius: 12,
                        padding: "12px 18px",
                        cursor: "pointer",
                        color: "var(--color-text-secondary)",
                        fontSize: 13,
                        textAlign: "center",
                        marginTop: 4,
                      }}
                    >
                      More wallets (WalletConnect QR)
                    </button>
                  </div>
                ) : (
                  <MotionLink
                    href="/dashboard"
                    className="btn-primary"
                    style={{ padding: "14px 20px", fontSize: 14, width: "100%", textDecoration: "none", display: "inline-block", textAlign: "center" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    Launch App
                  </MotionLink>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
