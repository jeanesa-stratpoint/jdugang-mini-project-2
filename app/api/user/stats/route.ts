import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogs, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Verify Session (Protected API)
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.userId as string;

    // 2. Fetch User
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Fetch Blogs & Stats
    const userBlogs = await db.query.blogs.findMany({
      where: eq(blogs.authorId, userId),
      orderBy: [desc(blogs.createdAt)],
      with: {
        likes: true,
        comments: true,
      },
    });

    const stats = {
      posts: userBlogs.length,
      likes: userBlogs.reduce((acc, blog) => acc + blog.likes.length, 0),
      comments: userBlogs.reduce((acc, blog) => acc + blog.comments.length, 0),
    };

    return NextResponse.json({
      ...user,
      blogs: userBlogs,
      stats,
    });
  } catch (error) {
    console.error( `API Error in GET /api/user/stats:`, error);
    return NextResponse.json({ error: `Something went wrong` }, { status: 500 });
  }
}