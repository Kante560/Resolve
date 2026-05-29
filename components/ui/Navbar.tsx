"use client";
// ─── Navbar ─────────────────────────────────────────────────────────────────
// Fixed nav that hides on scroll-down and reveals on scroll-up.
// Uses Framer Motion for the slide animation.

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "@/lib/constants";

export default function Navbar() {
  const [atTop, setAtTop] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
            <Link href="/dashboard" passHref legacyBehavior>
              <motion.button
                id="nav-launch-app"
                className="btn-primary hide-on-mobile"
                style={{ padding: "8px 20px", fontSize: 11 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Launch App
              </motion.button>
            </Link>

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

      {/* Bottom Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
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
                padding: "32px 24px",
                zIndex: 201,
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
                      padding: "8px 0",
                      letterSpacing: "0.05em",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <Link href="/dashboard" passHref legacyBehavior>
                <motion.button
                  className="btn-primary"
                  style={{ padding: "14px 20px", fontSize: 14, width: "100%" }}
                  whileTap={{ scale: 0.97 }}
                >
                  Launch App
                </motion.button>
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
