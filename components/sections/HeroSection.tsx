"use client";
import { useRef } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const wordVariants: import("framer-motion").Variants = {
  hidden: { opacity: 0, y: 40, skewY: 4 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    skewY: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null!);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-badge",    { opacity: 0, y: -20, duration: 0.6 }, 0.2)
        .from(".hero-sub",      { opacity: 0, y: 20,  duration: 0.7 }, 0.55)
        .from(".hero-buttons > *", { opacity: 0, y: 20, stagger: 0.12, duration: 0.5 }, 0.8);
    },
    { scope: containerRef }
  );

  return (
    <section
      id="hero"
      ref={containerRef}
      className="section-padding"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: 1,
        overflow: "hidden",
        background: "transparent",
      }}
    >
      {/* Background radial glow */}
      <div
        style={{
          position: "absolute",
          top: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 700,
          height: 700,
          background: "radial-gradient(circle, rgba(0,82,255,0.09) 0%, transparent 68%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      {/* Content layer */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          maxWidth: 820,
        }}
      >
        {/* Live badge */}
        <div
          className="hero-badge"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(0,200,150,0.08)",
            border: "1px solid rgba(0,200,150,0.22)",
            padding: "6px 18px",
            marginBottom: 36,
            color: "var(--color-green)",
            fontSize: 11,
            letterSpacing: "0.14em",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--color-green)",
              display: "inline-block",
              animation: "blink 1.5s ease-in-out infinite",
            }}
          />
          LIVE ON BASE SEPOLIA
        </div>

        {/* Animated headline */}
        <h1
          style={{
            fontFamily: "var(--font-bricolage), sans-serif",
            fontSize: "clamp(48px, 9vw, 100px)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
            marginBottom: 24,
            color: "#FFFFFF",
            textShadow: "0 4px 32px rgba(0, 82, 255, 0.4)",
          }}
        >
          {["Trustless", "escrow"].map((word, i) => (
            <motion.span
              key={word}
              custom={i}
              variants={wordVariants}
              initial="hidden"
              animate="visible"
              style={{
                display: "inline-block",
                marginRight: "0.28em",
              }}
            >
              {word}
            </motion.span>
          ))}
          <br />
          {["for", "onchain", "work."].map((word, i) => (
            <motion.span
              key={word}
              custom={i + 2}
              variants={wordVariants}
              initial="hidden"
              animate="visible"
              style={{
                display: "inline-block",
                marginRight: "0.28em",
                color: i === 2 ? "var(--color-blue-l)" : "inherit",
              }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Sub text */}
        <p
          className="hero-sub"
          style={{
            fontSize: 16,
            color: "var(--color-text-secondary)",
            lineHeight: 1.75,
            marginBottom: 48,
            fontWeight: 300,
          }}
        >
          Lock ETH in a smart contract. Release on approval.
          <br />
          No middlemen. No invoices. No chasing payments.
        </p>

        {/* CTA Buttons */}
        <div
          className="hero-buttons flex-col-mobile"
          style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
        >
          <motion.button
            id="hero-connect-wallet"
            className="btn-primary"
            style={{ fontSize: 13 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            Connect Wallet
          </motion.button>
          <motion.button
            id="hero-read-docs"
            className="btn-outline"
            style={{ fontSize: 13 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Read the Docs →
          </motion.button>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          color: "var(--color-text-muted)",
          fontSize: 10,
          letterSpacing: "0.14em",
          zIndex: 2,
        }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <span>SCROLL</span>
        <div
          style={{
            width: 1,
            height: 44,
            background: "linear-gradient(to bottom, rgba(0,82,255,0.7), transparent)",
          }}
        />
      </motion.div>
    </section>
  );
}
