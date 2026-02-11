import { getGratitudeEntries } from "@/actions/gratitude.actions";
import GratitudeInput from "@/components/GratitudeInput";
import { SortFilter } from "@/components/SortFilter";
import GratitudeCard from "@/components/GratitudeCard";
import { getSession } from "@/lib/session";
import { Sparkles, StickyNote } from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ sort?: string }>;
}

export default async function GratitudeWallPage({ searchParams }: PageProps) {
  const session = await getSession();

  if (!session || typeof session.userId !== "string") {
    redirect("/");
  }
  const user = session.user as { name?: string; image?: string } | undefined;

  const { sort } = await searchParams;
  const currentSort = sort || "newest";
  const entries = await getGratitudeEntries(currentSort, session.userId);

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "personal", label: "My Wall" },
  ];

  return (
    <div className="min-h-screen bg-[#F5F3EF] pb-20">
      {/* HEADER */}
      <div className="bg-[#85BFBB] text-[#1F4F46] py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <Sparkles className="absolute top-10 left-10 w-12 h-12 text-white" />
          <Sparkles className="absolute bottom-10 right-10 w-16 h-16 text-white" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div
            className="inline-flex items-center justify-center p-3 
                        bg-white/20 rounded-full mb-4 backdrop-blur-sm shadow-sm"
          >
            <StickyNote size={32} className="text-[#1F4F46]" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            The Gratitude Wall
          </h1>
          <p className="text-lg text-[#1F4F46]/80 font-medium max-w-lg mx-auto">
            Small notes, big impact. Share a fleeting moment of thanks with the
            community.
          </p>
        </div>
      </div>

      <main className="max-w-350 mx-auto px-4 -mt-10 relative z-20">
        <GratitudeInput
          userId={session.userId}
          userImage={user?.image}
          userName={user?.name}
        />

        <SortFilter
          currentSort={currentSort}
          basePath="/wall"
          options={sortOptions}
        />

        {entries.length === 0 ? (
          <div className="text-center py-20 opacity-50">
            {currentSort === "personal" ? (
              <p>You haven&apos;t posted any notes yet. Write one above!</p>
            ) : (
              <p>The wall is empty. Be the first to post!</p>
            )}
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {entries.map((entry) => (
              <GratitudeCard
                key={entry.id}
                entry={entry}
                currentUserId={session.userId as string}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
