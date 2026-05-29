"use client";
// ─── StatsSection ────────────────────────────────────────────────────────────
// Protocol stats with animated counters. Counters start when the section
// enters the viewport (IntersectionObserver + AnimatedCounter).

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { STATS } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null!);
  const [active, setActive] = useState(false);

  // Trigger counters via IntersectionObserver
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  // GSAP: slide section in from left
  useGSAP(
    () => {
      gsap.from(".stat-card-item", {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="stats"
      ref={sectionRef}
      className="section-padding"
      style={{
        background: "rgba(0,82,255,0.025)",
        borderTop: "1px solid rgba(0,82,255,0.1)",
        borderBottom: "1px solid rgba(0,82,255,0.1)",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Background pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(0,82,255,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Label */}
        <div className="section-label" style={{ marginBottom: 56 }}>
          <span>PROTOCOL STATS</span>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 1,
            background: "rgba(0,82,255,0.1)",
          }}
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              id={`stat-card-${i}`}
              className="stat-card stat-card-item"
              whileHover={{ borderColor: "rgba(0,82,255,0.4)" }}
            >
              {/* Value */}
              <div
                style={{
                  fontSize: "clamp(36px, 5vw, 58px)",
                  fontWeight: 700,
                  color: "var(--color-blue)",
                  letterSpacing: "-0.035em",
                  marginBottom: 10,
                  fontVariantNumeric: "tabular-nums",
                  lineHeight: 1,
                }}
              >
                <AnimatedCounter target={stat.value} active={active} />
              </div>

              {/* Label */}
              <div
                style={{
                  fontSize: 13,
                  color: "var(--color-text-primary)",
                  fontWeight: 600,
                  letterSpacing: "0.07em",
                  marginBottom: 6,
                }}
              >
                {stat.label}
              </div>

              {/* Sub */}
              <div
                style={{
                  fontSize: 11,
                  color: "var(--color-text-muted)",
                  letterSpacing: "0.09em",
                }}
              >
                {stat.sub}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
