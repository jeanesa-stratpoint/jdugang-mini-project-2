"use server";

import { db } from "@/lib/db"; 
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

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