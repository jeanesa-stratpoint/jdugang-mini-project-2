import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  
  if (!session || !session.userId) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, String(session.userId)),
      columns: { lastPasswordReset: true }, 
    });

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    if (user.lastPasswordReset && session.iat) {
      const issuedAtTime = new Date(Number(session.iat) * 1000).getTime();
      const resetTime = new Date(user.lastPasswordReset).getTime();

      if (issuedAtTime < resetTime) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
      }
    }

    return NextResponse.json({ authenticated: true }, { status: 200 });

  } catch (error) {
    console.log(`Error checking auth status: ${error}`);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}