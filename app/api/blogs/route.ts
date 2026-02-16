import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogs } from "@/lib/db/schema";
import { desc, eq, asc } from "drizzle-orm";

// This corresponds to getAllPublishedBlogs
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get('sort') || 'newest';

    let orderByClause = [desc(blogs.createdAt)];
    if (sort === "oldest") {
      orderByClause = [asc(blogs.createdAt)];
    }

    const allBlogs = await db.query.blogs.findMany({
      where: eq(blogs.isPublished, true),
      orderBy: orderByClause,
      with: {
        author: true,
        likes: true,
        comments: true,
      },
    });

    if (sort === "popular") {
      allBlogs.sort((a, b) => b.likes.length - a.likes.length);
    }

    return NextResponse.json(allBlogs);
  } catch (error) {
    console.error(`API Error in GET /api/blogs:`, error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}