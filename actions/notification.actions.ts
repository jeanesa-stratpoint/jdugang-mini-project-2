"use server";

import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getNotifications(userId: string) {
  if (!userId) return [];

  try {
    console.log("Fetching notifications for User ID:", userId);

    const data = await db.query.notifications.findMany({
      where: eq(notifications.recipientId, userId),
      orderBy: [desc(notifications.createdAt)],
      with: {
        sender: true, 
        blog: true,  
      },
      limit: 10,
    });

    console.log("Notifications found:", data.length);
    
    return data;
  } catch (error) {
    console.error("GET NOTIFICATIONS ERROR:", error);
    return [];
  }
}

export async function markNotificationRead(notificationId: string, isRead: boolean) {
  try {
    await db
      .update(notifications)
      .set({ isRead: isRead })
      .where(eq(notifications.id, notificationId));
      
    revalidatePath("/home"); 
    return { 
      success: true 
    };
  } catch (error) {
    console.error(`Error making read... ${error}`);
    return { 
      success: false 
    };
  }
}