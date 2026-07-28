import Image from "next/image";

export function AuthorCard() {
  return (
    <aside className="mt-16 border-t border-border pt-8">
      <h2 className="font-serif text-sm uppercase tracking-[0.18em] text-subtle">
        About the author
      </h2>
      <div className="mt-5 flex items-start gap-4">
        <Image
          src="/headshot.jpg"
          alt="Willis Allstead"
          width={256}
          height={256}
          className="h-12 w-12 shrink-0 rounded-full border border-border object-cover"
        />
        <p className="text-[15px] leading-relaxed text-muted">
          I&rsquo;m Willis. I'm Director of Engineering at{" "}
          <a
            href="https://characterstrong.com"
            className="underline decoration-border underline-offset-4 hover:decoration-foreground transition-colors"
          >
            CharacterStrong
          </a>, and EdTech company,{" "}
          and I'm based out of Reno, Nevada. On the side I&rsquo;m building{" "}
          <a
            href="https://www.bonsave.app"
            className="underline decoration-border underline-offset-4 hover:decoration-foreground transition-colors"
          >
            Bonsave
          </a>
          , a personal finance app, and writing about money on{" "}
          <a
            href="https://willisallstead.substack.com"
            className="underline decoration-border underline-offset-4 hover:decoration-foreground transition-colors"
          >
            Substack
          </a>
          .
        </p>
      </div>
    </aside>
  );
}
