"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Edit3,
  Eye,
  EyeOff,
  Trash2,
  Share2,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteBlog, toggleBlogPublish } from "@/actions/blog.actions";
import { useRouter } from "next/navigation";
import DeleteModal from "./DeleteModal";
import WriteBlogModal from "./WriteBlogModal";

interface BlogData {
  id: string;
  title: string;
  slug: string;
  content: string;
  blogImg: string | null;
  isPublished: boolean | null;
  authorId: string;
}

interface BlogActionsMenuProps {
  blog: BlogData;
  currentUserId: string;
  isOwner: boolean;
  redirectOnDelete?: boolean;
}

export default function BlogActionsMenu({
  blog,
  currentUserId,
  isOwner,
  redirectOnDelete = false,
}: BlogActionsMenuProps) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const confirmDelete = async () => {
    setIsLoading(true);
    await deleteBlog(blog.id, currentUserId);
    setIsLoading(false);
    setShowDeleteModal(false);

    if (redirectOnDelete) {
      router.push("/home");
    } else {
      router.refresh();
    }
  };

  const handleTogglePublish = async () => {
    await toggleBlogPublish(blog.id, currentUserId, blog.isPublished ?? false);
    router.refresh();
  };

  const handleShare = () => {
    const url = `${window.location.origin}/journal/${blog.slug}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <>
      <div className="relative z-20" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hover:text-[#1F4F46] transition p-1 outline-none bg-white/50 hover:bg-[#85BFBB]/20 rounded-full">
              <MoreHorizontal size={20} />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            {isOwner ? (
              <>
                <DropdownMenuItem
                  onClick={() => setShowEditModal(true)}
                  className="gap-2 cursor-pointer"
                >
                  <Edit3 size={16} /> Edit Story
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleTogglePublish}
                  className="gap-2 cursor-pointer"
                >
                  {blog.isPublished ? (
                    <>
                      <EyeOff size={16} /> Unpublish
                    </>
                  ) : (
                    <>
                      <Eye size={16} /> Publish
                    </>
                  )}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => setShowDeleteModal(true)}
                  className="gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                >
                  <Trash2 size={16} /> Delete Story
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem
                onClick={handleShare}
                className="gap-2 cursor-pointer"
              >
                {isCopied ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <Share2 size={16} />
                )}
                {isCopied ? "Copied Link!" : "Share Story"}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        isDeleting={isLoading}
        title="Delete Story?"
        description="Are you sure? This will remove the story from your journal forever."
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
