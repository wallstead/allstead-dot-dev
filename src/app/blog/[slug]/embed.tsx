import type { Element } from "hast";
import { getTweet } from "react-tweet/api";

type EmbedTarget =
  | { kind: "tweet"; id: string }
  | { kind: "youtube"; id: string; start?: number }
  | { kind: "bluesky"; handle: string; rkey: string };

type FoundEmbed = { target: EmbedTarget; href: string };

/** What every card shows, whatever platform it came from. */
type CardData = {
  platform: "x" | "bluesky" | "youtube";
  author: string;
  handle?: string;
  avatar?: string;
  text?: string;
  media?: { src: string; alt: string; video: boolean };
  date?: string;
  note?: string;
};

/**
 * Turns a bare URL on its own line in a post into an embed.
 * Returns null for URLs we don't know how to embed.
 */
export function parseEmbed(href: string): EmbedTarget | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www\.|m\.|mobile\.)/, "");

  if (host === "x.com" || host === "twitter.com") {
    const m = url.pathname.match(/^\/[^/]+\/status\/(\d+)/);
    return m ? { kind: "tweet", id: m[1] } : null;
  }

  if (host === "youtube.com" || host === "youtu.be") {
    const id =
      host === "youtu.be"
        ? url.pathname.slice(1)
        : url.pathname.startsWith("/shorts/")
          ? url.pathname.split("/")[2]
          : url.searchParams.get("v");
    if (!id) return null;
    return { kind: "youtube", id, start: parseStart(url.searchParams.get("t")) };
  }

  if (host === "bsky.app") {
    const m = url.pathname.match(/^\/profile\/([^/]+)\/post\/([^/]+)/);
    return m ? { kind: "bluesky", handle: m[1], rkey: m[2] } : null;
  }

  return null;
}

/**
 * If a paragraph holds nothing but bare, embeddable URLs (separated by
 * whitespace or line breaks), returns them. Otherwise returns null.
 */
export function embedsIn(p: Element): FoundEmbed[] | null {
  const found: FoundEmbed[] = [];
  for (const child of p.children) {
    if (child.type === "text" && child.value.trim() === "") continue;
    if (child.type === "element" && child.tagName === "br") continue;
    if (child.type !== "element" || child.tagName !== "a") return null;
    const href = String(child.properties.href ?? "");
    const text = child.children[0];
    if (child.children.length !== 1 || text?.type !== "text" || text.value !== href) {
      return null;
    }
    const target = parseEmbed(href);
    if (!target) return null;
    found.push({ target, href });
  }
  return found.length ? found : null;
}

/**
 * Several embeds shown together, alternating left/right in the order
 * written so each column reads top to bottom (a reply can sit under its
 * parent). On wide screens it breaks out of the text column a little.
 */
export function EmbedGallery({ embeds }: { embeds: FoundEmbed[] }) {
  return (
    <div className="relative left-1/2 w-[min(56rem,calc(100vw-3rem))] -translate-x-1/2 py-2">
      <div className="grid items-start gap-4 md:grid-cols-2">
        {[0, 1].map((col) => (
          <div key={col} className="space-y-4">
            {embeds
              .filter((_, i) => i % 2 === col)
              .map((e) => (
                <Embed key={e.href} target={e.target} href={e.href} />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export async function Embed({ target, href }: { target: EmbedTarget; href: string }) {
  const data = await load(target);
  if (!data) {
    return (
      <p>
        <a href={href} className="underline decoration-border underline-offset-4">
          {href}
        </a>
      </p>
    );
  }
  return <Card data={data} href={href} />;
}

function Card({ data, href }: { data: CardData; href: string }) {
  const platformName = { x: "X", bluesky: "Bluesky", youtube: "YouTube" }[data.platform];

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-xl border border-border bg-surface text-[15px] leading-normal no-underline transition-colors hover:border-subtle"
    >
      {/* Only videos show media; posts are text-only. */}
      {data.platform === "youtube" && data.media && <Media media={data.media} />}

      <div className="p-4">
        <div className="flex items-center gap-3">
          {data.avatar && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.avatar} alt="" className="h-9 w-9 shrink-0 rounded-full" />
          )}
          <div className="min-w-0 leading-tight">
            <div className="truncate font-medium text-foreground">{data.author}</div>
            <div className="truncate text-[13px] text-subtle">
              {[data.handle && `@${data.handle}`, data.date].filter(Boolean).join(" · ")}
            </div>
          </div>
          <PlatformIcon platform={data.platform} />
        </div>

        {data.text && (
          <p className="mt-3 whitespace-pre-line text-foreground/90">{data.text}</p>
        )}

        <div className="mt-3 flex items-center justify-between text-[13px] text-subtle">
          <span>{data.note}</span>
          <span className="transition-colors group-hover:text-foreground">
            View on {platformName} &rarr;
          </span>
        </div>
      </div>
    </a>
  );
}

function Media({ media }: { media: NonNullable<CardData["media"]> }) {
  return (
    <div className="relative aspect-video bg-border">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={media.src} alt={media.alt} loading="lazy" className="h-full w-full object-cover" />
      {media.video && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-transform group-hover:scale-110">
            <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-current" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </div>
      )}
    </div>
  );
}

function PlatformIcon({ platform }: { platform: CardData["platform"] }) {
  const cls = "ml-auto h-4 w-4 shrink-0 fill-subtle";
  if (platform === "x") {
    return (
      <svg viewBox="0 0 24 24" aria-label="X" className={cls}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  if (platform === "bluesky") {
    return (
      <svg viewBox="0 0 600 530" aria-label="Bluesky" className={cls}>
        <path d="M135.72 44.03C202.216 93.951 273.74 195.17 300 249.49c26.262-54.316 97.782-155.54 164.28-205.46C512.26 8.009 590-19.862 590 68.825c0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.38-3.69-10.832-3.708-7.896-.017-2.936-1.193.516-3.707 7.896-13.714 40.255-67.233 197.36-189.63 71.766-64.444-66.128-34.605-132.26 82.697-152.22-67.108 11.421-142.55-7.45-163.25-81.433C20.15 217.613 9.997 86.535 9.997 68.825c0-88.687 77.742-60.816 125.72-24.795z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-label="YouTube" className={cls}>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6z" />
    </svg>
  );
}

// ---- Loading each platform's data at build time ----

function load(target: EmbedTarget): Promise<CardData | null> {
  switch (target.kind) {
    case "tweet":
      return loadTweet(target.id);
    case "bluesky":
      return loadBluesky(target.handle, target.rkey);
    case "youtube":
      return loadYouTube(target.id, target.start);
  }
}

async function loadTweet(id: string): Promise<CardData | null> {
  try {
    const tweet = await getTweet(id);
    if (!tweet) return null;

    // Drop the trailing t.co media link and show real URLs instead of t.co.
    const [start, end] = tweet.display_text_range;
    let text = Array.from(tweet.text).slice(start, end).join("");
    for (const u of tweet.entities?.urls ?? []) {
      text = text.replace(u.url, u.display_url);
    }

    const m = tweet.mediaDetails?.[0];
    return {
      platform: "x",
      author: tweet.user.name,
      handle: tweet.user.screen_name,
      avatar: tweet.user.profile_image_url_https.replace("_normal", "_bigger"),
      text: decodeEntities(text).trim(),
      media: m && {
        src: m.media_url_https,
        alt: "ext_alt_text" in m ? (m.ext_alt_text ?? "") : "",
        video: m.type !== "photo",
      },
      date: formatDate(tweet.created_at),
    };
  } catch {
    return null;
  }
}

type BskyPost = {
  author: { handle: string; displayName?: string; avatar?: string };
  record: { text: string; createdAt: string; reply?: unknown };
  embed?: {
    images?: { thumb: string; alt: string }[];
    thumbnail?: string;
    media?: { images?: { thumb: string; alt: string }[] };
  };
};

const BSKY_API = "https://public.api.bsky.app/xrpc";

async function loadBluesky(handle: string, rkey: string): Promise<CardData | null> {
  try {
    let did = handle;
    if (!handle.startsWith("did:")) {
      const res = await fetch(
        `${BSKY_API}/com.atproto.identity.resolveHandle?handle=${encodeURIComponent(handle)}`,
      );
      if (!res.ok) return null;
      did = (await res.json()).did;
    }
    const uri = `at://${did}/app.bsky.feed.post/${rkey}`;
    const res = await fetch(`${BSKY_API}/app.bsky.feed.getPosts?uris=${encodeURIComponent(uri)}`);
    if (!res.ok) return null;
    const post: BskyPost | undefined = (await res.json()).posts?.[0];
    if (!post) return null;

    const image = post.embed?.images?.[0] ?? post.embed?.media?.images?.[0];
    const thumb = post.embed?.thumbnail;
    return {
      platform: "bluesky",
      author: post.author.displayName || post.author.handle,
      handle: post.author.handle,
      avatar: post.author.avatar,
      text: post.record.text,
      media: image
        ? { src: image.thumb, alt: image.alt, video: false }
        : thumb
          ? { src: thumb, alt: "", video: true }
          : undefined,
      date: formatDate(post.record.createdAt),
      note: post.record.reply ? "Reply" : undefined,
    };
  } catch {
    return null;
  }
}

async function loadYouTube(id: string, start?: number): Promise<CardData | null> {
  try {
    const watch = `https://www.youtube.com/watch?v=${id}`;
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(watch)}&format=json`,
    );
    if (!res.ok) return null;
    const o: { title: string; author_name: string } = await res.json();
    return {
      platform: "youtube",
      author: o.author_name,
      text: o.title,
      media: { src: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, alt: o.title, video: true },
      note: start ? `From ${formatTime(start)}` : undefined,
    };
  } catch {
    return null;
  }
}

// ---- Helpers ----

function parseStart(t: string | null): number | undefined {
  if (!t) return undefined;
  if (/^\d+$/.test(t)) return Number(t);
  const m = t.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
  if (!m) return undefined;
  return Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0);
}

function formatTime(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
