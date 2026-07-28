"use client";

import { useEffect, useRef, useState } from "react";

const SPARKLE_ANGLES = [0, 60, 120, 180, 240, 300];

export function LikeButton({ slug }: { slug: string }) {
  const [count, setCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [bursting, setBursting] = useState(false);
  const burstTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLiked(localStorage.getItem(`liked:${slug}`) === "1");
    fetch(`/api/likes/${slug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setCount(data.count);
      })
      .catch(() => {});
    return () => {
      if (burstTimer.current) clearTimeout(burstTimer.current);
    };
  }, [slug]);

  async function toggle() {
    const op = liked ? "unlike" : "like";
    setLiked(!liked);
    setCount((c) => (c ?? 0) + (liked ? -1 : 1));
    if (liked) {
      localStorage.removeItem(`liked:${slug}`);
      setBursting(false);
    } else {
      localStorage.setItem(`liked:${slug}`, "1");
      setBursting(true);
      if (burstTimer.current) clearTimeout(burstTimer.current);
      burstTimer.current = setTimeout(() => setBursting(false), 600);
    }
    try {
      const res = await fetch(`/api/likes/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ op }),
      });
      if (res.ok) {
        const data = await res.json();
        setCount(data.count);
      }
    } catch {
      // leave the optimistic value; it self-corrects on next load
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={liked}
      aria-label={liked ? "Unlike this post" : "Like this post"}
      className={`group inline-flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-[15px] transition-all active:scale-95 ${
        liked
          ? "border-red-400/40 bg-red-400/10 text-foreground"
          : "border-border bg-surface text-muted hover:border-red-400/40 hover:text-foreground"
      }`}
    >
      <span className="relative inline-flex h-5 w-5 items-center justify-center">
        {bursting && (
          <>
            <span className="heart-burst absolute inset-0 rounded-full border-2 border-red-400" />
            {SPARKLE_ANGLES.map((angle) => (
              <span
                key={angle}
                className="heart-sparkle absolute h-1 w-1 rounded-full bg-red-400"
                style={{ "--angle": `${angle}deg` } as React.CSSProperties}
              />
            ))}
          </>
        )}
        <svg
          viewBox="0 0 24 24"
          className={`h-5 w-5 transition-colors ${
            bursting ? "heart-pop" : ""
          } ${
            liked
              ? "fill-red-400 stroke-red-400"
              : "fill-none stroke-current group-hover:stroke-red-400"
          }`}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      </span>
      <span className="tabular-nums">
        {count ?? " "}
      </span>
      <span className="text-subtle">
        {count === 1 ? "like" : "likes"}
      </span>
    </button>
  );
}
