import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogs, comments } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const blog = await db.query.blogs.findFirst({
      where: eq(blogs.slug, slug),
      with: {
        author: true,
        likes: true,
        comments: {
          with: {
            user: true,
          },
          orderBy: desc(comments.createdAt),
        },
      },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error(`API Error in GET /api/blogs/[slug]:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}