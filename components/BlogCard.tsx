"use client";

import Link from "next/link";
import Image from "next/image";
import DeleteModal from "./DeleteModal";
import WriteBlogModal from "./WriteBlogModal";
import { useState } from "react";
import {
  Heart,
  MessageSquare,
  MoreHorizontal,
  Share2,
  Trash2,
  Edit3,
  EyeOff,
  Eye,
  Loader2,
  Check,
} from "lucide-react";
import { formatDate } from "@/lib/utils/formatdate";
import { deleteBlog, toggleBlogPublish } from "@/actions/blog.actions";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  isPublished: boolean | null;
}

export function BlogCard({
  blog,
  authorName,
  currentUserId,
  source = "home",
}: {
  blog: BlogProps;
  authorName: string;
  currentUserId: string;
  source?: "home" | "journal";
}) {
  const router = useRouter();
  const publishedDate = formatDate(blog.createdAt);
  const updatedDate = formatDate(blog.updatedAt);

  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isOwner = currentUserId === blog.authorId;

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    await deleteBlog(blog.id, currentUserId);
    setIsLoading(false);
    setShowDeleteModal(false);
    router.refresh();
  };

  const handleTogglePublish = async () => {
    setIsLoading(true);
    await toggleBlogPublish(blog.id, currentUserId, blog.isPublished ?? false);
    setIsLoading(false);
    router.refresh();
  };

  const handleShare = () => {
    const url = `${window.location.origin}/journal/${blog.slug}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const stripHtml = (html: string) => {
    // This removes all HTML tags (like <p>, <strong>) so the card looks clean
    return html.replace(/<[^>]*>?/gm, "");
  };

  return (
    <>
      <div
        className="relative group flex bg-white rounded-xl border border-[#85BFBB]/30 
                    shadow-sm overflow-visible mb-6 hover:shadow-md transition-shadow h-64"
      >
        {/* image */}
        <div className="w-1/3 bg-[#E2E8E4] relative min-h-full shrink-0 overflow-hidden rounded-l-xl">
          {blog.blogImg ? (
            <Image
              src={blog.blogImg}
              alt={blog.title}
              fill
              className={`object-cover transition duration-500 ${!blog.isPublished ? "grayscale opacity-70" : ""}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#1F4F46]/20 font-serif text-4xl">
              {blog.title.charAt(0)}
            </div>
          )}

          {!blog.isPublished && (
            <div className="absolute top-2 left-2 bg-gray-800/80 text-white text-[10px] font-bold px-2 py-1 rounded">
              UNPUBLISHED
            </div>
          )}
        </div>

        {/* content */}
        <div className="w-2/3 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-[#1F4F46] leading-tight line-clamp-1">
                {blog.title}
              </h3>

              <div className="relative z-20 flex items-center gap-4 text-[#85BFBB]">
                <span className="flex items-center gap-1 text-xs font-medium">
                  <MessageSquare size={14} /> {blog.comments.length}
                </span>
                <span className="flex items-center gap-1 text-xs font-medium">
                  <Heart size={14} /> {blog.likes.length}
                </span>

                <div className="relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="hover:text-[#1F4F46] transition p-1 outline-none">
                        {isLoading ? (
                          <Loader2 className="animate-spin" size={20} />
                        ) : (
                          <MoreHorizontal size={20} />
                        )}
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-40">
                      {isOwner ? (
                        <>
                          <DropdownMenuItem
                            onClick={handleEdit}
                            className="cursor-pointer gap-2"
                          >
                            <Edit3 size={14} /> Edit
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={handleTogglePublish}
                            className="cursor-pointer gap-2"
                          >
                            {blog.isPublished ? (
                              <>
                                <EyeOff size={14} /> Unpublish
                              </>
                            ) : (
                              <>
                                <Eye size={14} /> Publish
                              </>
                            )}
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            onClick={handleDeleteClick}
                            className="cursor-pointer gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                          >
                            <Trash2 size={14} /> Delete
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <DropdownMenuItem
                          onClick={handleShare}
                          className="cursor-pointer gap-2"
                        >
                          {isCopied ? (
                            <Check size={14} className="text-green-500" />
                          ) : (
                            <Share2 size={14} />
                          )}
                          {isCopied ? "Copied!" : "Share"}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            <p className="text-[14px] text-[#1F4F46]/70 mt-1">
              by <span className="font-bold">{authorName}</span>
            </p>

            <div className="text-[12px] text-[#1F4F46]/50 italic mt-2 sentencecase tracking-wider">
              <p>
                Published: <span className="font-bold">{publishedDate}</span>
              </p>
              <p className="mt-0.5">
                Last Updated: <span className="font-bold">{updatedDate}</span>
              </p>
            </div>

            <p className="text-sm text-[#1F4F46]/80 mt-4 line-clamp-3 leading-relaxed">
              {stripHtml(blog.content)}
            </p>
          </div>

          <Link
            href={`/journal/${blog.slug}?from=${source}`}
            className="text-xs font-bold text-[#1F4F46] underline mt-4 hover:text-[#85BFBB] 
                      transition after:content-[''] after:absolute after:inset-0 after:z-10"
          >
            READ MORE
          </Link>
        </div>
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        isDeleting={isLoading}
        title="Delete Story?"
        description="Are you sure you want to delete this story? This action cannot be undone."
      />
      {showEditModal && (
        <WriteBlogModal
          userId={currentUserId}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          blogToEdit={blog}
        />
      )}
    </>
  );
}
