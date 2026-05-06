import Link from "next/link";
import type { Metadata } from "next";
import { getPosts } from "@/posts";
import { SiteHeader } from "../site-header";

export const metadata: Metadata = {
  title: "Writing — Willis Allstead",
  description: "Notes and essays by Willis Allstead.",
};

export default function BlogIndex() {
  const posts = getPosts();
  return (
    <div className="flex flex-1 justify-center px-6 py-10 sm:py-14">
      <main className="w-full max-w-2xl">
        <SiteHeader />

        <section className="mt-16">
          <h1 className="font-serif text-3xl tracking-tight">Writing</h1>
          <p className="mt-3 text-[17px] leading-relaxed text-muted">
            My thoughts on engineering, building products, and whatever
            else is on my mind.
          </p>
        </section>

        <ul className="mt-12 space-y-8">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="font-serif text-xl group-hover:underline decoration-border underline-offset-4 group-hover:decoration-foreground transition-colors">
                    {post.title}
                  </h2>
                  <time
                    dateTime={post.date}
                    className="shrink-0 whitespace-nowrap text-[13px] tabular-nums text-subtle"
                  >
                    {formatDate(post.date)}
                  </time>
                </div>
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted">
                  {post.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
