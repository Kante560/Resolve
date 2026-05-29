"use client";
// ─── CtaSection ──────────────────────────────────────────────────────────────
// Final CTA with large anchor icon, animated radial glow, and Framer Motion
// entrance + button hover effects.

import { useRef } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CtaSection() {
  const sectionRef = useRef<HTMLElement>(null!);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
        defaults: { ease: "power3.out" },
      });

      tl.from(".cta-icon",    { scale: 0.4, opacity: 0, duration: 0.7 })
        .from(".cta-heading", { y: 40, opacity: 0, duration: 0.7 }, "-=0.4")
        .from(".cta-sub",     { y: 24, opacity: 0, duration: 0.6 }, "-=0.45")
        .from(".cta-buttons > *", { y: 20, opacity: 0, stagger: 0.12, duration: 0.5 }, "-=0.35");
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="get-started"
      ref={sectionRef}
      className="section-padding"
      style={{
        position: "relative",
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        background: "rgba(0,82,255,0.02)",
        borderTop: "1px solid rgba(122,136,184,0.1)",
        overflow: "hidden",
      }}
    >
      {/* Large background glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700,
          height: 700,
          background:
            "radial-gradient(circle, rgba(0,82,255,0.09) 0%, transparent 65%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      {/* Grid lines accent */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${20 * i}%`,
            top: 0,
            bottom: 0,
            width: 1,
            background: "rgba(0,82,255,0.03)",
            pointerEvents: "none",
          }}
        />
      ))}

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Anchor icon */}
        <motion.div
          className="cta-icon"
          style={{ fontSize: 56, marginBottom: 28, display: "inline-block" }}
          animate={{
            y: [0, -10, 0],
            rotate: [0, -4, 4, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          ⚓
        </motion.div>

        {/* Heading */}
        <h2
          className="cta-heading"
          style={{
            fontSize: "clamp(32px, 5.5vw, 64px)",
            fontWeight: 700,
            letterSpacing: "-0.025em",
            marginBottom: 20,
            color: "var(--color-text-primary)",
            lineHeight: 1.1,
          }}
        >
          Drop the invoices.
          <br />
          <span style={{ color: "var(--color-blue)" }}>Ship with Anchor.</span>
        </h2>

        {/* Subtext */}
        <p
          className="cta-sub"
          style={{
            color: "var(--color-text-secondary)",
            fontSize: 15,
            marginBottom: 52,
            lineHeight: 1.75,
            fontWeight: 300,
          }}
        >
          The contract doesn&apos;t care who you are.
          <br />
          It just runs.
        </p>

        {/* Buttons */}
        <div
          className="cta-buttons"
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <motion.button
            id="cta-launch-app"
            className="btn-primary"
            style={{ fontSize: 14, padding: "16px 44px" }}
            whileHover={{ scale: 1.05, boxShadow: "0 12px 40px rgba(0,82,255,0.5)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            Launch App
          </motion.button>
          <motion.button
            id="cta-github"
            className="btn-outline"
            style={{ fontSize: 14, padding: "16px 44px" }}
            whileHover={{ scale: 1.04, borderColor: "rgba(122,136,184,0.6)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            View on GitHub →
          </motion.button>
        </div>

        {/* Tagline */}
        <p
          style={{
            marginTop: 48,
            fontSize: 11,
            color: "var(--color-text-muted)",
            letterSpacing: "0.14em",
          }}
        >
          OPEN SOURCE · BASE NETWORK · NO ADMIN KEYS
        </p>
      </div>
    </section>
  );
}
