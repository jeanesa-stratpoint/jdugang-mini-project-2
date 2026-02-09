"use server";

import { db } from "@/lib/db"; // Adjust path to your db instance
import { blogs, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// --- 1. GET PROFILE STATS ---
export async function getUserStats(userId: string) {
  // Get user details
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) return null;

  // Get all blogs by this user
  const userBlogs = await db.query.blogs.findMany({
    where: eq(blogs.authorId, userId),
    with: {
      likes: true, // Fetch likes relations to count them
      comments: true, // Fetch comments relations to count them
    },
  });

  // Calculate aggregates
  const postCount = userBlogs.length;
  const totalLikes = userBlogs.reduce((acc, blog) => acc + blog.likes.length, 0);
  const totalComments = userBlogs.reduce((acc, blog) => acc + blog.comments.length, 0);

  return {
    ...user,
    stats: {
      posts: postCount,
      likes: totalLikes,
      comments: totalComments,
    },
  };
}

// --- 2. UPDATE PROFILE PICTURE ---
export async function updateProfileImage(userId: string, imageUrl: string) {
  await db.update(users)
    .set({ profileImg: imageUrl })
    .where(eq(users.id, userId));
  
  revalidatePath("/home");
}

// --- 3. CREATE BLOG POST ---
export async function createBlog(userId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const imageUrl = formData.get("imageUrl") as string; // We expect a URL from the upload service

  if (!title || !content) {
    return { success: false, message: "Title and content are required" };
  }

  // Create a simple slug (In production, ensure uniqueness)
  const slug = title.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();

  try {
    await db.insert(blogs).values({
      authorId: userId,
      title,
      content,
      slug,
      blogImg: imageUrl || null,
      isPublished: true, // Auto-publish for now
      publishedAt: new Date(),
    });

    revalidatePath("/home");
    return { success: true, message: "Blog posted successfully!" };
  } catch (error) {
    console.error("Failed to create blog:", error);
    return { success: false, message: "Failed to create blog." };
  }
}