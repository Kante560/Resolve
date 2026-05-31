"use client";
// ─── Footer ─────────────────────────────────────────────────────────────────

import { motion } from "framer-motion";
import Link from "next/link";


// motion.create(Link) is the modern Framer Motion v12+ API, replacing deprecated motion(Link)
const MotionLink = motion.create(Link);

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--color-border)",
        padding: "40px 48px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 16,
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 18 }}>⚓</span>
        <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.15em", color: "var(--color-text-primary)" }}>
          ANCHOR
        </span>
        {/* Tagline rendered as a string expression to avoid JSX comment-in-text lint error */}
        <span style={{ fontSize: 13, color: "var(--color-text-secondary)", marginLeft: 8 }}>
          {"// Trustless escrow on Base"}
        </span>
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: 28 }}>
        <MotionLink
          href="/docs"
          style={{
            fontSize: 13,
            color: "var(--color-text-secondary)",
            cursor: "pointer",
            letterSpacing: "0.08em",
            display: "block",
            textDecoration: "none",
          }}
          whileHover={{ color: "var(--color-text-primary)", y: -1 }}
          transition={{ duration: 0.15 }}
        >
          Docs
        </MotionLink>
        <a href="https://github.com/Kante560/Resolve" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          <motion.span
            style={{
              fontSize: 13,
              color: "var(--color-text-secondary)",
              cursor: "pointer",
              letterSpacing: "0.08em",
              display: "block",
            }}
            whileHover={{ color: "var(--color-text-primary)", y: -1 }}
            transition={{ duration: 0.15 }}
          >
            GitHub
          </motion.span>
        </a>
      </div>

      {/* Year */}
      <div style={{ fontSize: 12, color: "var(--color-text-secondary)", letterSpacing: "0.08em" }}>
        Built on Base &middot; {new Date().getFullYear()}
      </div>
    </footer>
  );
}
