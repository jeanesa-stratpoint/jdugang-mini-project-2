import { getAllPublishedBlogs } from "@/actions/blog.actions";
import { BlogCard } from "@/components/BlogCard";
import { getSession } from "@/lib/session";
import { BookHeart, Sparkles } from "lucide-react";
import { SortFilter } from "@/components/SortFilter";

export const dynamic = "force-dynamic";

interface JournalPageProps {
  searchParams: Promise<{ sort?: string }>;
}

export default async function JournalPage({ searchParams }: JournalPageProps) {
  const session = await getSession();
  const currentUserId = session?.userId as string;
  const { sort } = await searchParams;
  const currentSort = sort || "newest";
  const blogs = await getAllPublishedBlogs(currentSort);

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "popular", label: "Most Popular" },
  ];

  return (
    <div className="min-h-screen bg-[#F5F3EF]">
      {/* HEADER */}
      <div className="bg-[#1F4F46] text-white py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <Sparkles className="absolute top-10 left-10 w-12 h-12 text-[#85BFBB]" />
          <Sparkles className="absolute bottom-10 right-10 w-16 h-16 text-[#85BFBB]" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-4 backdrop-blur-sm">
            <BookHeart size={32} className="text-[#85BFBB]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Gratitude Journal
          </h1>
          <p className="text-lg text-white/80 font-light max-w-lg mx-auto">
            A shared space of positivity. Discover stories of gratitude from our
            community.
          </p>
        </div>
      </div>

      {/* FEED */}
      <main className="max-w-350 mx-auto px-4 py-16">
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <SortFilter
            currentSort={currentSort}
            basePath="/journal"
            options={sortOptions}
          />
        </div>
        {blogs.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-300 rounded-xl">
            <h3 className="text-xl text-[#1F4F46] font-serif">
              It&apos;s quiet here...
            </h3>
            <p className="text-gray-500 mt-2">
              Be the first to share a story of gratitude.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                authorName={blog.author.name}
                currentUserId={currentUserId}
                source="journal"
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
