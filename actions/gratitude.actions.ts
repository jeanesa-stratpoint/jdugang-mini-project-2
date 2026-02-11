"use server";

import { db } from "@/lib/db";
import { gratitudeEntries } from "@/lib/db/schema"; 
import { eq, desc, asc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// CREATE ENTRIES 
export async function createGratitudeEntry(userId: string, content: string) {
  try {
    if (!content.trim()) {
      return { 
        success: false, 
        message: "Content cannot be empty" 
    };
    }

    if (content.length > 280) {
      return { 
        success: false, 
        message: "Maximum reached (280 characters only)" 
    };
    }

    await db.insert(gratitudeEntries).values({
      authorId: userId, 
      content: content.trim(),
    });

    revalidatePath("/wall");
    return { 
        success: true, 
        message: "Note posted to the wall!" 
    };
  } catch (error) {
    console.error(`Failed creating entry... ${error}`);
    return { 
        success: false, 
        message: "Failed to post entry" 
    };
  }
}

// GET ENTRIES
export async function getGratitudeEntries(sort: string = "newest", userId?: string) {
  try {
    let orderByClause = [desc(gratitudeEntries.createdAt)];
    let whereClause = undefined;

    if (sort === "oldest") {
      orderByClause = [asc(gratitudeEntries.createdAt)];
    }

    if (sort === "personal") {
      if (!userId) return []; 
      whereClause = eq(gratitudeEntries.authorId, userId);
    }

    const entries = await db.query.gratitudeEntries.findMany({
      where: whereClause, 
      orderBy: orderByClause,
      with: {
        author: true,
      },
    });

    return entries;
  } catch (error) {
    console.error(`Failed fetching entries... ${error}`);
    return [];
  }
}

// DELETE ENTRY
export async function deleteGratitudeEntry(entryId: string, userId: string) {
  try {
    await db.delete(gratitudeEntries).where(
      and(
        eq(gratitudeEntries.id, entryId),
        eq(gratitudeEntries.authorId, userId)
      )
    );

    revalidatePath("/wall");
    return { 
        success: true, 
        message: "Note removed." 
    };
  } catch (error) {
    console.error(`Failed to delete entry... ${error}`);
    return { 
        success: false, 
        message: "Failed to remove entry." 
    };
  }
}