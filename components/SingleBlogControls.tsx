"use client";

import { useState } from "react";
import { MoreHorizontal, Edit3, Eye, EyeOff, Trash2 } from "lucide-react";
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
  content: string;
  blogImg: string | null;
  isPublished: boolean | null;
}

export default function SingleBlogControls({
  blog,
  userId,
}: {
  blog: BlogData;
  userId: string;
}) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const confirmDelete = async () => {
    setIsLoading(true);
    await deleteBlog(blog.id, userId);
    setIsLoading(false);
    setShowDeleteModal(false);
    router.push("/home");
  };

  const handleTogglePublish = async () => {
    await toggleBlogPublish(blog.id, userId, blog.isPublished ?? false);
    router.refresh();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="bg-white/50 hover:bg-[#85BFBB]/50 p-2 rounded-full transition text-[#1F4F46]">
            <MoreHorizontal size={24} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
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
        </DropdownMenuContent>
      </DropdownMenu>

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
          userId={userId}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          blogToEdit={blog}
        />
      )}
    </>
  );
}
