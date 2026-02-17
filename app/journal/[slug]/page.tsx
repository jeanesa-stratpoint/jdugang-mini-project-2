import Image from "next/image";
import Link from "next/link";
import LikeButton from "@/components/LikeButton";
import CommentSection from "@/components/CommentSection";
import { getSession } from "@/lib/session";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils/formatdate";
import { Metadata } from "next";
import { type BlogProps } from "@/components/BlogCard";
import { stripHtml } from "@/lib/utils/stripHtml";
import BlogActionsMenu from "@/components/BlogActionsMenu";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string }>;
}

async function getBlogFromAPI(slug: string): Promise<BlogProps | null> {
  const apiUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${apiUrl}/api/blogs/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch blog:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogFromAPI(slug);

  if (!blog) {
    return {
      title: "Story Not Found",
    };
  }

  const description = stripHtml(blog.content).substring(0, 160);

  return {
    title: blog.title,
    description: description,
    openGraph: {
      title: blog.title,
      description: description,
      images: blog.blogImg ? [{ url: blog.blogImg }] : [],
      type: "article",
      authors: [blog.author?.name || "Unknown"],
    },
  };
}

export default async function BlogPage({ params, searchParams }: PageProps) {
  const session = await getSession();
  const currentUserId = session?.userId ? String(session.userId) : "";

  const { slug } = await params;
  const { from } = await searchParams;
  const blog = await getBlogFromAPI(slug);

  if (!blog) {
    notFound();
  }

  const publishedDate = formatDate(blog.createdAt);
  const lastUpdated = formatDate(blog.updatedAt);
  const isOwner = currentUserId === blog.authorId;

  const isLiked = currentUserId
    ? blog.likes.some(
        (like: { userId: string }) => like.userId === currentUserId,
      )
    : false;

  const cameFromJournal = from === "journal";
  const backLink = !currentUserId
    ? "/"
    : cameFromJournal
      ? "/journal"
      : "/home";
  const backLabel = "Back";

  return (
    <div className="min-h-screen bg-[#F5F3EF] pb-20">
      {/* Cover photo */}
      <div className="relative w-full h-[40vh] md:h-[80vh] bg-[#1F4F46]">
        {blog.blogImg ? (
          <Image
            src={blog.blogImg}
            alt={blog.title}
            fill
            className="object-cover opacity-90"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#1F4F46]">
            <span className="text-white/20 font-serif text-8xl md:text-9xl capitalize">
              {blog.title.charAt(0)}
            </span>
          </div>
        )}

        {/* Back Button */}
        <div className="absolute top-6 left-6 z-10">
          <Link
            href={backLink}
            className="flex items-center gap-2 text-white bg-black/20 
                        hover:bg-black/40 backdrop-blur-sm px-4 py-2 
                        rounded-full transition text-sm font-medium"
          >
            <ArrowLeft size={16} /> {backLabel}
          </Link>
        </div>
      </div>

      {/* Content Container */}
      <main className="max-w-350 mx-auto -mt-20 relative z-10 px-4">
        <div className="bg-white rounded-t-3xl shadow-xl p-8 md:p-12 min-h-[60vh]">
          {/* Header Info */}
          <div className="mb-10 text-center border-b border-gray-100 pb-10">
            {isOwner && (
              <div className="absolute top-5 right-10">
                <BlogActionsMenu
                  blog={blog}
                  currentUserId={currentUserId}
                  isOwner={true}
                  redirectOnDelete={true}
                />
              </div>
            )}
            <h1 className="text-3xl md:text-5xl font-serif text-[#1F4F46] leading-tight mb-6">
              {blog.title}
            </h1>

            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm">
                {/* Author */}
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full bg-[#1F4F46] 
                                text-white flex items-center justify-center 
                                overflow-hidden border border-gray-100"
                  >
                    {blog.author?.profileImg ? (
                      <Image
                        src={blog.author.profileImg}
                        alt={blog.author.name}
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="font-serif text-sm">
                        {blog.author?.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <span className="font-medium text-[#1F4F46]">
                    {blog.author?.name}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>{publishedDate}</span>
                  <Calendar size={14} />
                  <span>{lastUpdated}</span>
                </div>
              </div>

              {/* Like Button */}
              <LikeButton
                blogId={blog.id}
                userId={currentUserId}
                initialLikesCount={blog.likes.length}
                initialIsLiked={isLiked}
              />
            </div>
          </div>

          {/* Blog Body Content */}
          <div
            className="text-lg leading-relaxed text-[#1F4F46]/90 whitespace-pre-wrap prose prose-p:mb-4 prose-headings:font-serif prose-a:text-blue-600"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* comment section */}
          <div
            id="comments"
            className="mt-16 pt-10 border-t border-gray-100 scroll-mt-24"
          >
            <CommentSection
              blogId={blog.id}
              currentUserId={currentUserId}
              blogAuthorId={blog.authorId}
              comments={blog.comments}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
