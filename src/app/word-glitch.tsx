"use client";

import { useEffect, useState } from "react";

const WORDS = [
  "full-stack engineer",
  "builder",
  "product engineer",
  "prompt-writer",
  "snowboarder",
  "tinkerer",
  "software dev",
  "maker",
  "systems thinker",
  "music lover",
  "hacker",
  "context engineer",
  "meeting guy",
  "gardener",
  "problem-solver",
  "founder??",
  "hiker",
  "pragmatist",
  "TypeScript enjoyer",
  "React dev",
  "coffee lover",
  "bug-fixer",
  "runner",
  "cat AND dog person",
  "burrito enthusiast",
  "you're still reading this??",
];

const CHARS = "abcdefghijklmnopqrstuvwxyz-";

export function WordGlitch() {
  const [display, setDisplay] = useState(WORDS[0]);
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let i = 0;
    let rafId = 0;
    let timeoutId: number | undefined;
    let cancelled = false;

    const scrambleTo = (target: string) => {
      setGlitching(true);
      const start = performance.now();
      const duration = 700;
      const step = (now: number) => {
        if (cancelled) return;
        const t = Math.min(1, (now - start) / duration);
        const revealed = Math.floor(t * target.length);
        let next = target.slice(0, revealed);
        for (let j = revealed; j < target.length; j++) {
          const c = target[j];
          next +=
            c === " " || c === "-"
              ? c
              : CHARS[Math.floor(Math.random() * CHARS.length)];
        }
        setDisplay(next);
        if (t < 1) {
          rafId = requestAnimationFrame(step);
        } else {
          setDisplay(target);
          setGlitching(false);
        }
      };
      rafId = requestAnimationFrame(step);
    };

    const tick = () => {
      i = (i + 1) % WORDS.length;
      scrambleTo(WORDS[i]);
      timeoutId = window.setTimeout(tick, 2800);
    };

    timeoutId = window.setTimeout(tick, 2800);

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <span
      className={`inline-block font-medium ${glitching ? "is-glitching" : ""}`}
      aria-label="full-stack engineer"
    >
      {display}
    </span>
  );
}
