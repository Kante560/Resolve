"use client";
// ─── WhyBaseSection ──────────────────────────────────────────────────────────
// Four feature cards with icon, staggered entrance via GSAP batch,
// and Framer Motion hover depth effect.

import { useRef } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import TiltedCard from "@/components/ui/TiltedCard";
import { WHY_ITEMS } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

export default function WhyBaseSection() {
  const sectionRef = useRef<HTMLElement>(null!);

  useGSAP(
    () => {
      // Heading reveal
      gsap.from(".why-header", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".why-header",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // Cards & Image stagger
      ScrollTrigger.batch([".why-card-item", ".why-image-anim"], {
        onEnter: (elements) => {
          gsap.from(elements, {
            opacity: 0,
            y: 44,
            stagger: 0.13,
            duration: 0.7,
            ease: "power3.out",
          });
        },
        start: "top 88%",
        once: true,
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="why-base"
      ref={sectionRef}
      className="section-padding"
      style={{
        position: "relative",
        zIndex: 1,
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      {/* Heading */}
      <div className="why-header" style={{ marginBottom: 72 }}>
        <div className="section-label">
          <span>WHY BASE</span>
        </div>
        <h2
          style={{
            fontSize: "clamp(28px, 4vw, 52px)",
            fontWeight: 700,
            letterSpacing: "-0.025em",
            color: "var(--color-text-primary)",
          }}
        >
          Built where the{" "}
          <span style={{ color: "var(--color-blue)" }}>users are.</span>
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 48,
        }}
      >
        <div className="why-image-anim" style={{ zIndex: 10 }}>
          <TiltedCard
            imageSrc="/base_chain.jpg"
            altText="Base Chain"
            captionText="Base Chain Network"
            containerHeight="300px"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            rotateAmplitude={12}
            scaleOnHover={1.02}
            showMobileWarning={false}
            showTooltip={true}
            displayOverlayContent={true}
            imageStyle={{ 
              opacity: 0.8, 
              borderRadius: 12, 
              border: "1px solid rgba(122,136,184,0.15)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)" 
            }}
            overlayContent={
              <div style={{
                position: "absolute",
                inset: 0,
                borderRadius: 12,
                background: "linear-gradient(180deg, transparent 50%, rgba(4,8,18,0.9) 100%)",
                pointerEvents: "none"
              }} />
            }
          />
        </div>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
            gap: 16,
          }}
        >
          {WHY_ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              id={`why-card-${i}`}
              className="why-card why-card-item"
              whileHover={{ y: -6, borderColor: "rgba(0,82,255,0.4)" }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Icon with glow */}
              <motion.div
                style={{
                  fontSize: 32,
                  marginBottom: 20,
                  display: "inline-block",
                }}
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                {item.icon}
              </motion.div>

              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                  marginBottom: 12,
                  letterSpacing: "-0.01em",
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontSize: 15,
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.65,
                }}
              >
                {item.body}
              </p>

              {/* Corner accent */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 32,
                  height: 32,
                  borderTop: "1px solid rgba(0,82,255,0.3)",
                  borderRight: "1px solid rgba(0,82,255,0.3)",
                  opacity: 0,
                  transition: "opacity 0.3s",
                }}
                className="card-corner"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
