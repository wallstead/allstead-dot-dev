import Image from "next/image";
import Link from "next/link";
import { EmailLink } from "./email-link";

export function SiteHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
      <Link
        href="/"
        className="group flex items-center gap-3 transition-opacity hover:opacity-70"
      >
        <Image
          src="/headshot.jpg"
          alt="Willis Allstead"
          width={256}
          height={256}
          className="h-7 w-7 rounded-full border border-border object-cover"
        />
        <span className="font-serif text-lg tracking-tight">
          Willis Allstead
        </span>
      </Link>
      <nav className="flex flex-wrap items-center gap-5 text-[15px] text-muted">
        <Link
          href="/blog"
          className="hover:text-foreground transition-colors"
        >
          Writing
        </Link>
        <span className="text-border">/</span>
        <EmailLink className="hover:text-foreground transition-colors" />
        <span className="text-border">/</span>
        <a
          href="https://github.com/wallstead"
          className="hover:text-foreground transition-colors"
        >
          GitHub
        </a>
        <span className="text-border">/</span>
        <a
          href="https://www.linkedin.com/in/willallstead/"
          className="hover:text-foreground transition-colors"
        >
          LinkedIn
        </a>
      </nav>
    </header>
  );
}
