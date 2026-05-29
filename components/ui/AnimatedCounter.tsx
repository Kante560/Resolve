"use client";
// ─── AnimatedCounter ────────────────────────────────────────────────────────
// Counts up from 0 to a target numeric value when `active` is true.

import { useState, useEffect } from "react";

interface Props {
  target: string;   // e.g. "0%", "~2s", "$0.001", "∞"
  active: boolean;
  duration?: number;
}

export default function AnimatedCounter({ target, active, duration = 1800 }: Props) {
  const [display, setDisplay] = useState<string>(() => {
    const match = target.match(/[\d.]+/);
    return match ? "0" : target;
  });

  useEffect(() => {
    if (!active) return;

    // Extract numeric part; if none (e.g. "∞"), just return as it's already set
    const match = target.match(/[\d.]+/);
    if (!match) return;

    const num = parseFloat(match[0]);
    const prefix = target.slice(0, match.index);
    const suffix = target.slice((match.index ?? 0) + match[0].length);

    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * num;

      // Format: preserve decimals if target has them
      const formatted =
        match[0].includes(".")
          ? current.toFixed(match[0].split(".")[1].length)
          : Math.floor(current).toString();

      setDisplay(`${prefix}${formatted}${suffix}`);

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [active, target, duration]);

  return <>{display}</>;
}
