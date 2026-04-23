"use client";

const ENCODED = "d2lsbGFsbHN0ZWFkQGljbG91ZC5jb20=";

export function EmailLink({ className }: { className?: string }) {
  return (
    <a
      href="#"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        window.location.href = `mailto:${atob(ENCODED)}`;
      }}
    >
      Email
    </a>
  );
}
