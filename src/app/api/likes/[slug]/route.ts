import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { getPost } from "@/posts";

let _redis: Redis | null = null;

function getRedis() {
  if (!_redis) {
    _redis = new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    });
  }
  return _redis;
}

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;
  if (!getPost(slug)) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const count = (await getRedis().get<number>(`likes:${slug}`)) ?? 0;
  return NextResponse.json({ count });
}

export async function POST(request: Request, { params }: Params) {
  const { slug } = await params;
  if (!getPost(slug)) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  let unlike = false;
  try {
    const body = await request.json();
    unlike = body?.op === "unlike";
  } catch {
    // no body — treat as a like
  }

  const key = `likes:${slug}`;
  const redis = getRedis();
  let count: number;
  if (unlike) {
    count = await redis.decr(key);
    if (count < 0) {
      await redis.set(key, 0);
      count = 0;
    }
  } else {
    count = await redis.incr(key);
  }
  return NextResponse.json({ count });
}
