"use server";

import { db } from "@/lib/db"; 
import { blogs, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

// GET PROFILE STATS
export async function getUserStats(userId: string) {
  try {
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

    const stats = {
      posts: userBlogs.length,
      likes: userBlogs.reduce((acc, blog) => acc + blog.likes.length, 0),
      comments: userBlogs.reduce((acc, blog) => acc + blog.comments.length, 0),
    };

    return {
      ...user,
      blogs: userBlogs,
      stats,
    };
  } catch (error) {
    console.error(`Something went wrong... ${error}`);
    return null;
  }
}

// UPDATE PROFILE PICTURE
export async function updateProfileImage(
  userId: string,
  newImageUrl: string | null,
  oldImageUrl?: string | null
) {
  try {
    if (oldImageUrl && oldImageUrl !== newImageUrl) {
      const fileKey = oldImageUrl.split("/f/")[1];
      if (fileKey) {
         utapi.deleteFiles(fileKey).catch((err) => 
           console.error("Background image cleanup failed:", err)
         );
      }
    }

    await db.update(users)
      .set({ profileImg: newImageUrl })
      .where(eq(users.id, userId));

    revalidatePath("/home");
    return { success: true, message: "Profile image updated" };
    
  } catch (error) {
    console.error("Error updating profile image:", error);
    return { success: false, message: "Failed to update image" };
  }
}