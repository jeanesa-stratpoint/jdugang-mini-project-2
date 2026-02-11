"use server";

import { db } from "@/lib/db";
import { blogs, likes, comments, notifications } from "@/lib/db/schema";
import { eq, and, desc, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

// LIKE
export async function toggleLike(blogId: string, userId: string) {
  try {
    const existingLike = await db.query.likes.findFirst({
      where: and(eq(likes.blogId, blogId), eq(likes.userId, userId)),
    });
    
    const blog = await db.query.blogs.findFirst({
      where: eq(blogs.id, blogId),
      columns: { authorId: true },
    });

    if (!blog) return { success: false, message: "Blog not found" };

    if (existingLike) {
      // Unlike
      await db.delete(likes).where(
        and(eq(likes.blogId, blogId), eq(likes.userId, userId))
      );

      if (blog.authorId !== userId) {
        await db.delete(notifications).where(
          and(
            eq(notifications.recipientId, blog.authorId),
            eq(notifications.senderId, userId),
            eq(notifications.type, "LIKE"),
            eq(notifications.blogId, blogId)
          )
        );
      }
      
      revalidatePath(`/journal/[slug]`); 
      return { 
        success: true, 
        isLiked: false 
      };
    } else {
      // Like
      await db.insert(likes).values({
        blogId,
        userId,
      });

      if (blog.authorId !== userId) {
        // Check if notification already exists to avoid duplicates 
        const existingNote = await db.query.notifications.findFirst({
            where: and(
                eq(notifications.recipientId, blog.authorId),
                eq(notifications.senderId, userId),
                eq(notifications.type, "LIKE"),
                eq(notifications.blogId, blogId)
            )
        });

        if (!existingNote) {
            await db.insert(notifications).values({
                recipientId: blog.authorId,
                senderId: userId,
                type: "LIKE",
                blogId: blogId,
            });
        }
      }

      revalidatePath(`/journal/[slug]`);
      return { 
        success: true, 
        isLiked: true 
      };
    }
  } catch (error) {
    console.error(`Error toggling like... ${error}`);
    return { 
      success: false, 
      message: "Failed to like post." 
    };
  }
}

// ADD COMMENT 
export async function addComment(blogId: string, userId: string, content: string) {
  try {
    if (!content.trim()) 
      return { 
        success: false, 
        message: "Comment cannot be empty" 
      };
    
    const blog = await db.query.blogs.findFirst({
      where: eq(blogs.id, blogId),
    });

    if (!blog) 
      return { 
        success: false, 
        message: "Blog not found" 
      };

    if (blog.authorId !== userId) {
      await db.insert(notifications).values({
        recipientId: blog.authorId,
        senderId: userId,
        type: "COMMENT",
        blogId: blogId,
      });
    }
  
    await db.insert(comments).values({
      blogId,
      userId,
      content,
    });

    revalidatePath(`/journal/[slug]`); 
    return { 
      success: true, 
      message: "Comment added" 
    };
  } catch (error) {
    console.error(`Failed adding comment... ${error}`);
    return { 
      success: false, 
      message: "Failed to add comment." 
    };
  }
}

// UPDATE COMMENT
export async function updateComment(
  commentId: string,
  userId: string,
  newContent: string
) {
  try {
    if (!newContent.trim()) {
      return { 
        success: false, 
        message: "Comment cannot be empty" 
      };
    }

    await db
      .update(comments)
      .set({
        content: newContent,
        isEdited: true,
        updatedAt: new Date(),
      })
      .where(and(eq(comments.id, commentId), eq(comments.userId, userId)));

    revalidatePath(`/journal/[slug]`);
    return { 
      success: true, 
      message: "Comment updated" 
    };
  } catch (error) {
    console.error(`Failed to update comment... ${error}`);
    return { 
      success: false, 
      message: "Failed to update comment." 
    };
  }
}

// DELETE COMMENT
export async function deleteComment(commentId: string, userId: string) {
  try {
    await db.delete(comments).where(
      and(eq(comments.id, commentId), eq(comments.userId, userId))
    );

    revalidatePath(`/journal/[slug]`);
    return { 
      success: true, 
      message: "Comment deleted" };
  } catch (error) {
    console.error(`Failed to delete comment... ${error}`);
    return { 
      success: false, 
      message: "Failed to delete comment." };
  }
}
// DELETE BLOG
export async function deleteBlog(blogId: string, userId: string) {
  try {

    const blogToDelete = await db.query.blogs.findFirst({
      where: and(eq(blogs.id, blogId), eq(blogs.authorId, userId)),
    });

    if (!blogToDelete) {
      return { 
        success: false, 
        message: "Blog not found or unauthorized" 
      };
    }

    if (blogToDelete.blogImg) {
      const fileKey = blogToDelete.blogImg.split("/f/")[1];
      if (fileKey) {
        utapi.deleteFiles(fileKey).catch(error => 
          console.error(`Failed to delete image file... ${error}`)
        );
      }
    }

    await db.delete(blogs).where(eq(blogs.id, blogId));

    revalidatePath("/home");
    revalidatePath("/journal");
    return { 
      success: true, 
      message: "Story deleted" 
    };

  } catch (error) {
    console.error(`Error deleting blog... ${error}`);
    return { 
      success: false, 
      message: "Failed to delete story." 
    };
  }
}
// TOGGLE PUBLISH STATUS 
export async function toggleBlogPublish(blogId: string, userId: string, currentStatus: boolean) {
  try {
    await db.update(blogs)
      .set({ isPublished: !currentStatus })
      .where(and(eq(blogs.id, blogId), eq(blogs.authorId, userId)));

    revalidatePath("/home");
    
    return { 
      success: true, 
      message: currentStatus ? "Unpublished" : "Published"
    };
  } catch (error) {
    console.error(`Error toggling publish status... ${error}`);
    return { 
      success: false, 
      message: "Failed to update status." 
    };
  }
}

// CREATE BLOG POST
export async function createBlog(userId: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const imageUrl = formData.get("imageUrl") as string;

    if (!title || !content) {
      return { success: false, message: "Title and content are required" };
    }

    const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-") + "-" + Date.now();

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
    return { 
      success: true, 
      message: "Blog published successfully!" 
    };

  } catch (error) {
    console.error(`Failed to create blog... ${error}`);
    return { 
      success: false, 
      message: "Failed to publish blog." 
    };
  }
}

// GET BLOG BY SLUG
export async function getBlogBySlug(slug: string) {
  try {
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

    return blog || null;
  } catch (error) {
    console.error(`Error fetching blog... ${error}`);
    return null;
  }
}

// UPDATE BLOG
export async function updateBlog(
  blogId: string,
  userId: string,
  formData: FormData
) {
  try {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const imageUrl = formData.get("imageUrl") as string;

    if (!title || !content) {
      return { 
        success: false, 
        message: "Title and content are required" 
      };
    }

    const currentBlog = await db.query.blogs.findFirst({
      where: and(eq(blogs.id, blogId), eq(blogs.authorId, userId)),
    });

    if (!currentBlog) {
      return { 
        success: false, 
        message: "Story not found or unauthorized." 
      };
    }

    const oldImage = currentBlog.blogImg;
    const newImage = imageUrl || null;

    if (oldImage && oldImage !== newImage) {
      const fileKey = oldImage.split("/f/")[1];
      if (fileKey) {

        await utapi.deleteFiles(fileKey).catch((error) => 
            console.error(`Background image cleanup failed... ${error}`)
        );
      }
    }

    await db.update(blogs)
      .set({
        title,
        content,
        blogImg: newImage,
        updatedAt: new Date(),
      })
      .where(and(eq(blogs.id, blogId), eq(blogs.authorId, userId)));

    revalidatePath("/home");
    revalidatePath(`/journal/${currentBlog.slug}`); 
    revalidatePath("/journal");

    return { 
      success: true, 
      message: "Story updated successfully!" 
    };

  } catch (error) {
    console.error(`Error updating blog... ${error}`);
    return { 
      success: false, 
      message: "Failed to update story." 
    };
  }
}

// GET ALL PUBLISHED BLOGS
export async function getAllPublishedBlogs(sortBy: string = "newest") {
  try {
    let orderByClause = [desc(blogs.createdAt)]; 
    if (sortBy === "oldest") {
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

    if (sortBy === "popular") {
      return allBlogs.sort((a, b) => b.likes.length - a.likes.length);
    }

    return allBlogs;
  } catch (error) {
    console.error( `Failed to fetch all blogs... ${error}`);
    return [];
  }
}