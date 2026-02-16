import ProfileHeader from "@/components/ProfileHeader";
import WriteBlogButton from "@/components/WriteBlogButton";
import { redirect } from "next/navigation";
import { PenSquare } from "lucide-react";
import { getSession } from "@/lib/session";
import { BlogCard, BlogProps } from "@/components/BlogCard";

interface UserData {
  id: string;
  name: string;
  username: string;
  email: string;
  profileImg: string | null;
  stats: { posts: number; likes: number; comments: number };
  blogs: BlogProps[];
}

async function getUserStatsFromAPI(): Promise<UserData | null> {
  const apiUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  try {
    const res = await fetch(`${apiUrl}/api/user/stats`, {
      cache: "no-store",
      headers: {
        Cookie: `session=${sessionCookie}`,
      },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch user stats", error);
    return null;
  }
}

export default async function HomePage() {
  const session = await getSession();
  if (!session || !session.userId) {
    redirect("/");
  }

  const userData = await getUserStatsFromAPI();

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
              <BlogCard
                key={blog.id}
                blog={blog}
                authorName={userData.name}
                currentUserId={userData.id}
                source="home"
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
