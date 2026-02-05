"use client";
import { Heart, MessageSquare, MoreHorizontal } from "lucide-react"; // Using Lucide for icons
import Link from "next/link";
import { DUMMY_BLOGS } from "@/data/mock";

export function BlogCard({ blog }: { blog: (typeof DUMMY_BLOGS)[0] }) {
  return (
    <div
      className="relative group flex bg-white rounded-xl border 
                    border-[#85BFBB]/30 shadow-sm overflow-hidden 
                    mb-6 hover:shadow-md transition-shadow"
    >
      <div className="w-1/3 bg-[#E2E8E4] min-h-50" />

      <div className="w-2/3 p-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="text-2xl font-semibold text-[#1F4F46] leading-tight">
              {blog.title}
            </h3>

            <div className="relative z-10 flex items-center gap-4 text-[#85BFBB]">
              <span className="flex items-center gap-1 text-xs font-medium">
                <MessageSquare size={14} /> {blog.comments}
              </span>
              <span className="flex items-center gap-1 text-xs font-medium">
                <Heart size={14} /> {blog.likes}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevents the card click from firing
                  console.log("Share clicked");
                }}
                className="hover:text-[#1F4F46] transition p-1"
              >
                <MoreHorizontal size={20} />
              </button>
            </div>
          </div>

          <p className="text-[14px] text-[#1F4F46]/70 font-bold mt-1">
            by {blog.author}
          </p>

          <div className="text-[12px] text-[#1F4F46]/50 italic mt-2 sentencecase tracking-wider">
            <p>Published: {blog.publishedDate}</p>
            <p>Last Updated: {blog.updatedDate}</p>
          </div>

          <p
            className="text-sm text-[#1F4F46]/80 
                        mt-4 line-clamp-3 leading-relaxed"
          >
            {blog.content}
          </p>
        </div>

        <Link
          href={`/journal/${blog.slug}`}
          className="text-xs font-bold text-[#1F4F46] underline mt-4 hover:text-[#85BFBB] transition
                     after:content-[''] after:absolute after:inset-0 after:z-0"
        >
          READ MORE
        </Link>
      </div>
    </div>
  );
}
