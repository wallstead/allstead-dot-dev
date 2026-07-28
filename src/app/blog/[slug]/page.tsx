import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPost, getPosts } from "@/posts";
import { AuthorCard } from "../../author-card";
import { SiteFooter } from "../../site-footer";
import { SiteHeader } from "../../site-header";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  { params }: Params,
): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Willis Allstead`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPost({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <div className="flex flex-1 justify-center px-6 py-10 sm:py-14">
      <main className="w-full max-w-2xl">
        <SiteHeader />

        <header className="mt-16">
          <h1 className="font-serif text-3xl leading-tight tracking-tight">
            {post.title}
          </h1>
          <time
            dateTime={post.date}
            className="mt-3 block text-[13px] tabular-nums text-subtle"
          >
            {formatDate(post.date)}
          </time>
        </header>

        <article className="mt-10 space-y-5 text-[17px] leading-relaxed text-foreground/90">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="underline decoration-border underline-offset-4 hover:decoration-foreground transition-colors"
                >
                  {children}
                </a>
              ),
              h2: ({ children }) => (
                <h2 className="mt-10 font-serif text-2xl tracking-tight">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="mt-8 font-serif text-xl tracking-tight">
                  {children}
                </h3>
              ),
              ul: ({ children }) => (
                <ul className="list-disc space-y-2 pl-6 marker:text-subtle">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal space-y-2 pl-6 marker:text-subtle">
                  {children}
                </ol>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-border pl-4 italic text-muted">
                  {children}
                </blockquote>
              ),
              code: ({ children, className }) => {
                const isBlock = className?.startsWith("language-");
                if (isBlock) {
                  return <code className={className}>{children}</code>;
                }
                return (
                  <code className="rounded bg-surface px-1.5 py-0.5 text-[0.9em]">
                    {children}
                  </code>
                );
              },
              pre: ({ children }) => (
                <pre className="overflow-x-auto rounded-lg border border-border bg-surface p-4 text-[14px] leading-relaxed">
                  {children}
                </pre>
              ),
              hr: () => <hr className="border-border" />,
            }}
          >
            {post.body}
          </ReactMarkdown>
        </article>

        <AuthorCard />

        <SiteFooter />
      </main>
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
