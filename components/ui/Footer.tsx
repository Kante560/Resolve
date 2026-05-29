"use client";
// ─── Footer ─────────────────────────────────────────────────────────────────

import { motion } from "framer-motion";
import { FOOTER_LINKS } from "@/lib/constants";

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
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", color: "var(--color-text-muted)" }}>
          ANCHOR
        </span>
        {/* Tagline rendered as a string expression to avoid JSX comment-in-text lint error */}
        <span style={{ fontSize: 11, color: "var(--color-text-muted)", marginLeft: 8 }}>
          {"// Trustless escrow on Base"}
        </span>
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: 28 }}>
        {FOOTER_LINKS.map((link) => (
          <motion.span
            key={link}
            style={{
              fontSize: 11,
              color: "var(--color-text-muted)",
              cursor: "pointer",
              letterSpacing: "0.08em",
              display: "block",
            }}
            whileHover={{ color: "var(--color-text-secondary)", y: -1 }}
            transition={{ duration: 0.15 }}
          >
            {link}
          </motion.span>
        ))}
      </div>

      {/* Year */}
      <div style={{ fontSize: 11, color: "#1E2840", letterSpacing: "0.08em" }}>
        Built on Base &middot; {new Date().getFullYear()}
      </div>
    </footer>
  );
}
