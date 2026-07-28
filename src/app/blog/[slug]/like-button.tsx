"use client";

import { useEffect, useState } from "react";

export function LikeButton({ slug }: { slug: string }) {
  const [count, setCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(localStorage.getItem(`liked:${slug}`) === "1");
    fetch(`/api/likes/${slug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setCount(data.count);
      })
      .catch(() => {});
  }, [slug]);

  async function toggle() {
    const op = liked ? "unlike" : "like";
    setLiked(!liked);
    setCount((c) => (c ?? 0) + (liked ? -1 : 1));
    if (liked) {
      localStorage.removeItem(`liked:${slug}`);
    } else {
      localStorage.setItem(`liked:${slug}`, "1");
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
      className="group inline-flex items-center gap-2 text-[15px] text-muted hover:text-foreground transition-colors"
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-5 w-5 transition-transform group-active:scale-90 ${
          liked ? "fill-red-400 stroke-red-400" : "fill-none stroke-current"
        }`}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
      <span className="tabular-nums">{count ?? " "}</span>
    </button>
  );
}
