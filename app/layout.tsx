import type { Metadata } from "next";
import { Merriweather, Italianno } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
});

const italianno = Italianno({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-italianno",
});

export const metadata: Metadata = {
  title: "I Am Grateful For...",
  description: "Community Gratitude Blog",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  let user = null;

  if (session?.userId) {
    const fetchedUser = await db.query.users.findFirst({
      where: eq(users.id, String(session.userId)),
      columns: {
        name: true,
        id: true,
        username: true,
        email: true,
        profileImg: true,
      },
    });

    user = fetchedUser ?? null;
  }

  return (
    <html lang="en">
      <body
        className={`${merriweather.variable} ${italianno.variable} antialiased`}
      >
        <Navbar user={user} />
        {children}
      </body>
    </html>
  );
}
