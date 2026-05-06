import type { MetadataRoute } from "next";
import { getPosts } from "@/posts";

const BASE_URL = "https://allstead.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts();
  const latestPost = posts[0]?.date;

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: latestPost ? new Date(latestPost) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
