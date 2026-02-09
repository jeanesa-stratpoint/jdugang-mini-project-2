"use client";
import { Heart, MessageSquare, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Like {
  userId: string;
  blogId: string;
}

interface Comment {
  id: string;
  content: string;
  userId: string;
  createdAt: Date;
}

export interface BlogProps {
  id: string;
  title: string;
  slug: string;
  content: string;
  blogImg: string | null;
  createdAt: Date;
  updatedAt: Date;
  likes: Like[];
  comments: Comment[];
  authorId: string;
}

export function BlogCard({
  blog,
  authorName,
}: {
  blog: BlogProps;
  authorName: string;
}) {
  const publishedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Draft";

  return (
    <div
      className="relative group flex bg-white rounded-xl border 
                  border-[#85BFBB]/30 shadow-sm overflow-hidden 
                  mb-6 hover:shadow-md transition-shadow h-64"
    >
      {/* LEFT SIDE: IMAGE */}
      <div className="w-1/3 bg-[#E2E8E4] relative min-h-full shrink-0">
        {blog.blogImg ? (
          <Image
            src={blog.blogImg}
            alt={blog.title}
            fill
            className="object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center 
                        text-[#1F4F46]/20 font-serif text-4xl"
          >
            {blog.title.charAt(0)}
          </div>
        )}
      </div>

      {/* RIGHT SIDE: CONTENT */}
      <div className="w-2/3 p-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-[#1F4F46] leading-tight line-clamp-1">
              {blog.title}
            </h3>

            <div className="relative z-10 flex items-center gap-4 text-[#85BFBB]">
              <span className="flex items-center gap-1 text-xs font-medium">
                <MessageSquare size={14} /> {blog.comments.length}
              </span>
              <span className="flex items-center gap-1 text-xs font-medium">
                <Heart size={14} /> {blog.likes.length}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Share clicked");
                }}
                className="hover:text-[#1F4F46] transition p-1"
              >
                <MoreHorizontal size={20} />
              </button>
            </div>
          </div>

          <p className="text-[14px] text-[#1F4F46]/70 mt-1">
            by <span className="font-bold">{authorName}</span>
          </p>

          <div className="text-[12px] text-[#1F4F46]/50 italic mt-2 sentencecase tracking-wider">
            <p>
              Published: <span className="font-bold">{publishedDate}</span>
            </p>
          </div>

          <p className="text-sm text-[#1F4F46]/80 mt-4 line-clamp-3 leading-relaxed">
            {blog.content}
          </p>
        </div>

        <Link
          href={`/journal/${blog.slug}`}
          className="text-xs font-bold text-[#1F4F46] underline mt-4 
                    hover:text-[#85BFBB] transition after:content-[''] 
                    after:absolute after:inset-0 after:z-0"
        >
          READ MORE
        </Link>
      </div>
    </div>
  );
}
