import { getUserStats } from "@/actions/home.actions";
import ProfileHeader from "@/components/ProfileHeader";
import WriteBlogButton from "@/components/WriteBlogButton";
import { redirect } from "next/navigation";
import { PenSquare } from "lucide-react";
import { getSession } from "@/lib/session";
import { BlogCard, BlogProps } from "@/components/BlogCard";

export default async function HomePage() {
  const session = await getSession();
  if (!session || !session.userId) {
    redirect("/");
  }

  const userId = session.userId as string;
  const userData = await getUserStats(userId);

  if (!userData) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#F5F3EF]">
      <main className="max-w-350 mx-auto px-4 py-10 space-y-10">
        {/* Top Section */}
        <div className="relative">
          <ProfileHeader user={userData} />
          <div className="absolute top-0 right-0 mt-8 mr-8 hidden md:block">
            <WriteBlogButton userId={userData.id} />
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-serif text-[#1F4F46]">My Journal</h2>
          <div className="h-px bg-[#1F4F46]/10 flex-1" />
        </div>

        {/* Blog Grid */}
        {userData.stats.posts === 0 ? (
          <div
            className="text-center py-20 bg-white/50 rounded-xl 
                          border border-dashed border-gray-300"
          >
            <div
              className="w-16 h-16 bg-[#E9EEE8] rounded-full 
                          flex items-center justify-center mx-auto mb-4 text-[#1F4F46]"
            >
              <PenSquare size={24} />
            </div>
            <h3 className="text-xl text-[#1F4F46] mb-2">No stories yet</h3>
            <p className="text-gray-500 max-w-xs mx-auto mb-6">
              Your journal is waiting. Capture your first moment of gratitude
              today.
            </p>
            <div className="inline-block">
              <WriteBlogButton
                userId={userData.id}
                label="Write your first story"
              />
            </div>
          </div>
        ) : (
          <div
            className="grid md:grid-cols-2 gap-6 pb-20 animate-in 
                        fade-in slide-in-from-bottom-4 duration-500"
          >
            {userData.blogs.map((blog: BlogProps) => (
              <BlogCard key={blog.id} blog={blog} authorName={userData.name} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
