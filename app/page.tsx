import { DUMMY_BLOGS, DUMMY_GRATITUDE } from "@/data/mock";
import { BlogCard } from "@/components/BlogCard";
import { GratitudeCard } from "@/components/GratitudeCard";

export default function LandingPage() {
  return (
    <main className="w-full bg-[#F5F3EF] min-h-screen">
      {/* Container */}
      <div className="max-w-350 mx-auto px-6 lg:px-10 py-12">
        <section className="py-20 lg:py-32 text-center">
          <h1 className="text-[#1F4F46] text-5xl sm:text-6xl lg:text-8xl leading-tight tracking-tight">
            <span className="text-[#85BFBB] italic mr-4 lg:mr-8">
              Gratitude
            </span>
            in every line <br className="hidden md:block" /> of code and life.
          </h1>

          <p className="text-[#1F4F46]/60 italic mt-6 text-lg lg:text-2xl">
            Because every moment worth thanking is worth sharing.
          </p>
        </section>

        {/* COMMUNITY SECTION */}
        <div className="mt-10 border-t border-[#85BFBB]/20 pt-10">
          <h2 className="text-[#1F4F46]/60 font-serif italic text-2xl mb-10">
            Community
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              {DUMMY_BLOGS.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>

            <div className="lg:col-span-1 space-y-6">
              {DUMMY_GRATITUDE.map((note) => (
                <GratitudeCard key={note.id} note={note} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
