import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const session = await getSession();

  if (session?.userId) {
    redirect("/home");
  }

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
      </div>
    </main>
  );
}
