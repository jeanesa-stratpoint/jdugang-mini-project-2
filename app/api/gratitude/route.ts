import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { gratitudeEntries } from "@/lib/db/schema";
import { desc, asc, eq } from "drizzle-orm";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get('sort') || 'newest';
    
    let orderByClause = [desc(gratitudeEntries.createdAt)];
    let whereClause = undefined;

    if (sort === "oldest") {
      orderByClause = [asc(gratitudeEntries.createdAt)];
    }

    if (sort === "personal") {
      const session = await getSession();
      if (!session || !session.userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      whereClause = eq(gratitudeEntries.authorId, String(session.userId));
    }

    const entries = await db.query.gratitudeEntries.findMany({
      where: whereClause,
      orderBy: orderByClause,
      with: { author: true },
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.log(`Something went wrong... ${error}`);
    return NextResponse.json({ error: "Failed to fetch entries" }, { status: 500 });
  }
}