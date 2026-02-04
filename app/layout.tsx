import type { Metadata } from "next";
import { Merriweather, Italianno } from "next/font/google";
import "./globals.css";

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
  description: "Personal Gratitude Blog",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${merriweather.variable} ${italianno.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
