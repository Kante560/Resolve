"use client";
// ─── HowItWorksSection ───────────────────────────────────────────────────────
// Four-step state machine cards that stagger in on scroll via GSAP ScrollTrigger.
// Each card has a Framer Motion hover glow effect.

import { useRef } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { STEPS } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null!);

  useGSAP(
    () => {
      // Section label + heading slide in
      gsap.from(".hiw-header", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".hiw-header",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // Cards stagger in with ScrollTrigger.batch
      ScrollTrigger.batch(".step-card-item", {
        onEnter: (elements) => {
          gsap.from(elements, {
            opacity: 0,
            y: 50,
            rotateX: 8,
            stagger: 0.12,
            duration: 0.75,
            ease: "power3.out",
          });
        },
        start: "top 88%",
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="section-padding"
      style={{
        position: "relative",
        zIndex: 1,
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      {/* Section label + heading */}
      <div className="hiw-header" style={{ marginBottom: 72 }}>
        <div className="section-label">
          <span>HOW IT WORKS</span>
        </div>
        <h2
          style={{
            fontSize: "clamp(28px, 4vw, 52px)",
            fontWeight: 700,
            letterSpacing: "-0.025em",
            marginBottom: 16,
            color: "var(--color-text-primary)",
          }}
        >
          Four states.
          <br />
          <span style={{ color: "var(--color-blue)" }}>Zero trust required.</span>
        </h2>
        <p
          style={{
            color: "var(--color-text-secondary)",
            fontSize: 14,
            lineHeight: 1.7,
            maxWidth: 520,
          }}
        >
          Every Anchor job is a state machine. The contract enforces every
          transition.
        </p>
      </div>

      {/* Cards grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 1,
          background: "rgba(122,136,184,0.08)",
        }}
      >
        {STEPS.map((step, i) => (
          <motion.div
            key={step.num}
            id={`step-card-${i}`}
            className="step-card step-card-item"
            whileHover={{
              borderColor: `${step.color}60`,
              backgroundColor: `${step.color}08`,
            }}
            transition={{ duration: 0.25 }}
          >
            {/* Step number */}
            <div
              style={{
                fontSize: 11,
                color: "var(--color-text-muted)",
                letterSpacing: "0.18em",
                marginBottom: 20,
                fontWeight: 600,
              }}
            >
              {step.num}
            </div>

            {/* Title */}
            <motion.h3
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "var(--color-text-primary)",
                marginBottom: 14,
                letterSpacing: "-0.015em",
              }}
              whileHover={{ color: step.color }}
              transition={{ duration: 0.2 }}
            >
              {step.title}
            </motion.h3>

            {/* Description */}
            <p
              style={{
                fontSize: 13,
                color: "var(--color-text-secondary)",
                lineHeight: 1.75,
                marginBottom: 28,
              }}
            >
              {step.desc}
            </p>

            {/* Function tag */}
            <span className="tag">{step.tag}</span>

            {/* Bottom accent bar */}
            <motion.div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                height: 2,
                background: step.color,
                width: "0%",
              }}
              whileHover={{ width: "100%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
