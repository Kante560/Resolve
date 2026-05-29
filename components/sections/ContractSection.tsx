"use client";
// ─── ContractSection ─────────────────────────────────────────────────────────
// Displays the smart contract ABI functions with animated scan line,
// copy address button, and hover highlighting on each function.

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import TiltedCard from "@/components/ui/TiltedCard";
import { CONTRACT_FUNCTIONS } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

export default function ContractSection() {
  const sectionRef = useRef<HTMLElement>(null!);
  const [copied, setCopied] = useState(false);
  const [hoveredFn, setHoveredFn] = useState<number | null>(null);

  const copyAddr = () => {
    navigator.clipboard
      .writeText("0x — deploy yours first")
      .catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useGSAP(
    () => {
      gsap.from(".contract-anim", {
        opacity: 0,
        y: 40,
        stagger: 0.15,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".contract-anim",
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });

      // Function rows stagger
      gsap.from(".fn-row", {
        opacity: 0,
        x: -20,
        stagger: 0.08,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".fn-row",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="protocol"
      ref={sectionRef}
      className="section-padding"
      style={{
        position: "relative",
        zIndex: 1,
        background: "rgba(0,82,255,0.015)",
        borderTop: "1px solid rgba(122,136,184,0.07)",
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {/* Label */}
        <div className="section-label" style={{ marginBottom: 48 }}>
          <span>THE CONTRACT</span>
        </div>

        <div style={{ display: "grid", gap: 32 }}>
          {/* Smart Contract Image */}
          <div className="contract-anim" style={{ zIndex: 10 }}>
            <TiltedCard
              imageSrc="/smart_contract.jpg"
              altText="Smart Contract"
              captionText="Smart Contract Logic"
              containerHeight="240px"
              containerWidth="100%"
              imageHeight="100%"
              imageWidth="100%"
              rotateAmplitude={12}
              scaleOnHover={1.02}
              showMobileWarning={false}
              showTooltip={true}
              displayOverlayContent={true}
              imageStyle={{ 
                opacity: 0.6, 
                borderRadius: 12, 
                border: "1px solid rgba(0,82,255,0.22)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)" 
              }}
              overlayContent={
                <div style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 12,
                  background: "linear-gradient(180deg, transparent 0%, #080f1e 100%)",
                  pointerEvents: "none"
                }} />
              }
            />
          </div>

          {/* Code block */}
          <div
            className="contract-anim"
            style={{
              background: "#080f1e",
              border: "1px solid rgba(0,82,255,0.22)",
              padding: "36px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Animated scan line */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background:
                  "linear-gradient(90deg, transparent, rgba(0,82,255,0.7), transparent)",
                animation: "scan 4s linear infinite",
              }}
            />

            {/* Header row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 28,
                flexWrap: "wrap",
                gap: 12,
              }}
            >
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--color-text-muted)",
                  letterSpacing: "0.14em",
                  marginBottom: 6,
                }}
              >
                DEPLOYED CONTRACT
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--color-blue-l)",
                  fontFamily: "monospace",
                }}
              >
                Anchor.sol · Base Sepolia
              </div>
            </div>

            <motion.button
              id="copy-address-btn"
              onClick={copyAddr}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{
                background: "rgba(0,82,255,0.12)",
                border: "1px solid rgba(0,82,255,0.28)",
                color: "var(--color-blue-l)",
                fontSize: 11,
                padding: "7px 16px",
                cursor: "pointer",
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.09em",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={copied ? "copied" : "copy"}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                >
                  {copied ? "✓ COPIED" : "COPY ADDRESS"}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Function rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {CONTRACT_FUNCTIONS.map((fn, i) => (
              <motion.div
                key={i}
                id={`fn-row-${i}`}
                className="fn-row"
                onHoverStart={() => setHoveredFn(i)}
                onHoverEnd={() => setHoveredFn(null)}
                animate={{
                  borderLeftColor:
                    hoveredFn === i ? "var(--color-blue)" : "rgba(0,82,255,0.28)",
                  background:
                    hoveredFn === i
                      ? "rgba(0,82,255,0.1)"
                      : "rgba(0,82,255,0.04)",
                }}
                transition={{ duration: 0.18 }}
                style={{
                  padding: "11px 18px",
                  borderLeft: "2px solid rgba(0,82,255,0.28)",
                  fontSize: 12,
                  color: "#A8D8A8",
                  fontFamily: "monospace",
                  letterSpacing: "0.02em",
                  cursor: "default",
                }}
              >
                <span style={{ color: "var(--color-blue-l)" }}>function</span>{" "}
                {fn.replace("function ", "")}
              </motion.div>
            ))}
          </div>

          {/* Verified badge */}
          <div
            style={{
              marginTop: 24,
              padding: "13px 18px",
              background: "rgba(0,200,150,0.05)",
              border: "1px solid rgba(0,200,150,0.16)",
              fontSize: 11,
              color: "var(--color-green)",
              letterSpacing: "0.09em",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--color-green)",
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            VERIFIED ON BASESCAN · NO ADMIN KEYS · OPEN SOURCE
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
