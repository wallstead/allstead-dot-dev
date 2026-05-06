import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { PostMeta } from "./types";

export type Post = PostMeta & { body: string };

const POSTS_DIR = path.join(process.cwd(), "src/posts");

function toDateString(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value);
}

export function getPosts(): Post[] {
  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".md"));

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
      const { data, content } = matter(raw);
      return {
        slug: file.replace(/\.md$/, ""),
        title: String(data.title),
        date: toDateString(data.date),
        description: String(data.description),
        body: content,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}
