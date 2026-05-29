"use client";
// ─── GlowCursor ─────────────────────────────────────────────────────────────
// Tracks mouse position and updates a CSS custom property for the radial glow.
// Also renders a subtle "ghost" dot that trails the cursor.

import { useEffect, useRef } from "react";

export default function GlowCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      // Update CSS vars so any element can tap into cursor position
      document.documentElement.style.setProperty("--cursor-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${e.clientY}px`);

      // Move the dot element
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`;
      }
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={dotRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 400,
        height: 400,
        background:
          "radial-gradient(circle, rgba(0,82,255,0.055) 0%, transparent 65%)",
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 9999,
        transition: "transform 0.12s ease-out",
        willChange: "transform",
      }}
    />
  );
}
