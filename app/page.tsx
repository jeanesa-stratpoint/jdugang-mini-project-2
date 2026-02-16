import { getGratitudeEntries } from "@/actions/gratitude.actions";
import { BlogCard, type BlogProps } from "@/components/BlogCard";
import GratitudeCard from "@/components/GratitudeCard";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import LandingPageActions from "@/components/LandingPageActions";

export const dynamic = "force-dynamic";

async function getBlogsFromAPI(): Promise<BlogProps[]> {
  const apiUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  try {
    // Fetch newest by default
    const res = await fetch(`${apiUrl}/api/blogs?sort=newest`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return [];
  }
}

export default async function LandingPage() {
  const session = await getSession();

  if (session?.userId) {
    redirect("/home");
  }

  const allBlogs = await getBlogsFromAPI();
  const blogs = allBlogs.slice(0, 7);

  const allGratitude = await getGratitudeEntries("newest");
  const gratitudeEntries = allGratitude.slice(0, 7);

  return (
    <main className="w-full bg-[#F5F3EF] min-h-screen pb-20">
      {/* Hero Section*/}
      <div className="w-full bg-[#F5F3EF] pt-20 pb-12 text-center border-b border-[#1F4F46]/5">
        <div className="w-full px-6 py-16">
          <h1 className="text-[#1F4F46] text-5xl sm:text-6xl lg:text-8xl leading-[1.1] tracking-tight mb-6">
            <span className="text-[#85BFBB] italic mr-3">Gratitude </span>
            in every line <br className="hidden md:block" /> of code and life.
          </h1>
          <p className="text-[#1F4F46]/60 italic text-xl mb-8">
            Because every moment worth thanking is worth sharing.
          </p>

          <LandingPageActions variant="hero" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-16">
        <div className="flex items-center gap-4 mb-10">
          <h2 className="text-2xl text-[#1F4F46] shrink-0 font-bold">
            Community Stories
          </h2>
          <div className="h-px bg-[#1F4F46]/10 flex-1" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 space-y-8">
            {blogs.length === 0 ? (
              <div className="text-center py-20 bg-white/50 rounded-2xl border border-dashed border-[#1F4F46]/20">
                <p className="text-[#1F4F46]/50 italic">
                  No stories published yet.
                </p>
              </div>
            ) : (
              blogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  authorName={blog.author?.name || "Unknown Author"}
                  currentUserId=""
                  source="home"
                />
              ))
            )}

            {blogs.length > 0 && (
              <div className="pt-4 text-center lg:text-left">
                <LandingPageActions variant="read_more" />
              </div>
            )}
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6 sticky top-10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[#1F4F46] text-xl font-bold">
                Gratitude Wall
              </h3>
              <span className="text-xs font-bold bg-[#85BFBB]/20 text-[#1F4F46] px-2 py-1 rounded-full">
                Latest
              </span>
            </div>

            {gratitudeEntries.length === 0 ? (
              <p className="text-gray-400 italic">The wall is quiet.</p>
            ) : (
              gratitudeEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="transform hover:scale-[1.02] transition-transform duration-300"
                >
                  <GratitudeCard entry={entry} currentUserId="" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
