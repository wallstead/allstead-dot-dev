import Image from "next/image";
import { EmailLink } from "./email-link";
import { WordGlitch } from "./word-glitch";

export default function Home() {
  return (
    <div className="flex flex-1 justify-center px-6 py-16 sm:py-24">
      <main className="w-full max-w-2xl">
        <header className="flex items-center gap-5">
          <Image
            src="/headshot.jpg"
            alt="Willis Allstead"
            width={256}
            height={256}
            className="h-[72px] w-[72px] rounded-full border border-border object-cover"
            priority
          />
          <div className="flex flex-col gap-1">
            <h1 className="font-serif text-3xl leading-none tracking-tight">
              Willis Allstead
            </h1>
            <p className="text-[15px] text-muted">
              Director of Engineering at CharacterStrong.
            </p>
          </div>
        </header>

        <nav className="mt-6 flex items-center gap-5 text-[15px] text-muted">
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

        <section className="mt-12 space-y-4 text-[17px] leading-relaxed text-foreground/90">
          <p className="whitespace-nowrap">
            I&rsquo;m a <WordGlitch />.
          </p>
          <p>
            I lead two
            product engineering teams at{" "}
            <a
              href="https://characterstrong.com"
              className="underline decoration-border underline-offset-4 hover:decoration-foreground transition-colors"
            >
              CharacterStrong
            </a>
            , building the systems behind curriculum products used by schools
            across the country.
          </p>
          <p>
            On the side, I&rsquo;m building{" "}
            <a
              href="https://bonsave.app"
              className="underline decoration-border underline-offset-4 hover:decoration-foreground transition-colors"
            >
              Bonsave
            </a>
            , a personal finance app trying to make sense of money one small
            observation at a time.
          </p>
        </section>

        <section className="mt-16">
          <h2 className="font-serif text-sm uppercase tracking-[0.18em] text-subtle">
            Now
          </h2>

          <a
            href="https://bonsave.app"
            className="mt-5 block rounded-xl border border-border bg-surface p-6 transition-colors hover:border-foreground/30"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-serif text-2xl leading-none">Bonsave</h3>
              <span className="text-xs uppercase tracking-widest text-subtle">
                bonsave.app
              </span>
            </div>
            <p className="mt-3 font-serif text-xl italic text-foreground/80">
              Grow your money. Intentionally.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              A personal finance app built around one idea: attention compounds.
              Each morning Bonnie, the built-in AI, delivers a single focused
              observation about your accounts, spending, or goals. No
              dashboards full of noise. Syncs 12,000+ institutions via Plaid,
              tracks net worth, budgets, and subscriptions. iOS app shipping
              May 2026.
            </p>
          </a>
        </section>

        <section className="mt-16">
          <h2 className="font-serif text-sm uppercase tracking-[0.18em] text-subtle">
            Work
          </h2>

          <div className="mt-6 space-y-10">
            <article>
              <div className="flex items-baseline gap-2">
                <h3 className="font-serif text-xl">CharacterStrong</h3>
                <span className="text-[13px] tabular-nums text-subtle">
                  · {durationText({ y: 2022, m: 4 }, "present")}
                </span>
              </div>
              <div className="mt-4 space-y-5">
                <Role
                  title="Director of Curriculum Engineering"
                  range="Mar 2024 – Present"
                  body="I lead engineers across two product engineering teams building the systems and tools that power our learning products. Stack: TypeScript, AWS Lambda, DynamoDB, PostgreSQL, Elasticsearch, React. This work supports CharacterStrong's mission to create a more loving world through education."
                />
                <Role
                  title="Full Stack Developer"
                  range="Apr 2022 – Mar 2024"
                  body="Headed the Curriculum Development team. Built specialized, interactive curricula for schools nationwide in TypeScript and React, working closely with educators to ship what classrooms actually needed."
                />
              </div>
            </article>

            <article>
              <div className="flex items-baseline gap-2">
                <h3 className="font-serif text-xl">Noble Studios</h3>
                <span className="text-[13px] tabular-nums text-subtle">
                  · {durationText({ y: 2018, m: 5 }, { y: 2022, m: 4 })}
                </span>
              </div>
              <div className="mt-4 space-y-5">
                <Role
                  title="Senior Web Developer"
                  range="Jun 2019 – Apr 2022"
                  body="Hired full-time after graduating from UNR. Shipped large-scale client projects across a wide range of web technologies."
                />
                <Role
                  title="Web Developer, Part-time"
                  range="Aug 2018 – May 2019"
                  body="Kept contributing through senior year at UNR after my internship wrapped."
                />
                <Role
                  title="Intern Web Developer"
                  range="May 2018 – Aug 2018"
                  body="First summer at Noble. Got dropped into real production work and learned more than any classroom could teach."
                />
              </div>
            </article>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-serif text-sm uppercase tracking-[0.18em] text-subtle">
            Education
          </h2>

          <article className="mt-6">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-serif text-xl">University of Nevada, Reno</h3>
              <span className="text-[13px] tabular-nums text-subtle">
                2015 – 2019
              </span>
            </div>
            <p className="mt-1.5 text-[15px] leading-relaxed text-muted">
              B.S. in Computer Science &amp; Engineering.
            </p>
          </article>
        </section>

        <footer className="mt-24 border-t border-border pt-6 text-[13px] text-subtle">
          &copy; {new Date().getFullYear()}
          {" "}
          Willis Allstead &middot; Reno, Nevada
        </footer>
      </main>
    </div>
  );
}

function Role({
  title,
  range,
  body,
}: {
  title: string;
  range: string;
  body: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <h4 className="text-[15px] font-medium text-foreground">{title}</h4>
        <span className="text-[13px] tabular-nums text-subtle">{range}</span>
      </div>
      <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{body}</p>
    </div>
  );
}

type YM = { y: number; m: number };

function durationText(start: YM, end: YM | "present"): string {
  const now = new Date();
  const endY = end === "present" ? now.getFullYear() : end.y;
  const endM = end === "present" ? now.getMonth() + 1 : end.m;
  const months = (endY - start.y) * 12 + (endM - start.m) + 1;
  const yrs = Math.floor(months / 12);
  const mos = months % 12;
  const parts: string[] = [];
  if (yrs > 0) parts.push(`${yrs} ${yrs === 1 ? "yr" : "yrs"}`);
  if (mos > 0) parts.push(`${mos} ${mos === 1 ? "mo" : "mos"}`);
  return parts.join(" ") || "0 mos";
}
