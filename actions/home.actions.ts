"use server";

import { db } from "@/lib/db"; 
import { blogs, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";

// GET PROFILE STATS
export async function getUserStats(userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) return null;

  const userBlogs = await db.query.blogs.findMany({
    where: eq(blogs.authorId, userId),
    orderBy: [desc(blogs.createdAt)], 
    with: {
      likes: true,
      comments: true,
    },
  });

  const postCount = userBlogs.length;
  const totalLikes = userBlogs.reduce((acc, blog) => acc + blog.likes.length, 0);
  const totalComments = userBlogs.reduce((acc, blog) => acc + blog.comments.length, 0);

  return {
    ...user,
    blogs: userBlogs,
    stats: {
      posts: postCount,
      likes: totalLikes,
      comments: totalComments,
    },
  };
}

// UPDATE PROFILE PICTURE
const utapi = new UTApi();
export async function updateProfileImage(
  userId: string, 
  newImageUrl: string | null, 
  oldImageUrl?: string | null 
) {
  
  if (oldImageUrl) {
    try {
      const fileKey = oldImageUrl.split("/f/")[1];
      if (fileKey) {
        await utapi.deleteFiles(fileKey);
      }
    } catch (error) {
      console.error("Failed to delete old image:", error);
    }
  }

  await db.update(users)
    .set({ profileImg: newImageUrl })
    .where(eq(users.id, userId));
  
  revalidatePath("/home");
}

// CREATE BLOG POST
export async function createBlog(userId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const imageUrl = formData.get("imageUrl") as string; 

  if (!title || !content) {
    return { success: false, message: "Title and content are required" };
  }

  const slug = title.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();

  try {
    await db.insert(blogs).values({
      authorId: userId,
      title,
      content,
      slug,
      blogImg: imageUrl || null,
      isPublished: true,
      publishedAt: new Date(),
    });

    revalidatePath("/home");
    return { success: true, message: "Blog posted successfully!" };
  } catch (error) {
    console.error("Failed to create blog:", error);
    return { success: false, message: "Failed to create blog." };
  }
}