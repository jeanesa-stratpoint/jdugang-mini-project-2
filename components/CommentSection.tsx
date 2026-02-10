"use client";

import { useState, useTransition } from "react";
import { addComment, deleteComment } from "@/actions/blog.actions";
import { MessageSquare, Send, Trash2, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils/formatdate";
import Image from "next/image";
import DeleteModal from "./DeleteModal";

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  user: {
    name: string;
    profileImg: string | null;
  };
}

interface CommentSectionProps {
  blogId: string;
  currentUserId: string;
  blogAuthorId: string;
  comments: Comment[];
}

export default function CommentSection({
  blogId,
  currentUserId,
  blogAuthorId,
  comments,
}: CommentSectionProps) {
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    startTransition(async () => {
      await addComment(blogId, currentUserId, input);
      setInput("");
    });
  };

  const handleDeleteClick = (commentId: string) => {
    setCommentToDelete(commentId);
  };

  const confirmDelete = async () => {
    if (!commentToDelete) return;

    setIsDeleting(true);
    try {
      await deleteComment(commentToDelete, currentUserId);
    } catch (error) {
      console.error("Failed to delete comment:", error);
    } finally {
      setIsDeleting(false);
      setCommentToDelete(null);
    }
  };

  return (
    <div className="mt-12 border-t border-gray-100 pt-10">
      <h3 className="text-2xl font-serif text-[#1F4F46] mb-8 flex items-center gap-2">
        <MessageSquare className="text-[#85BFBB]" />
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-10 flex gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full bg-gray-50 border border-transparent focus:bg-white 
                      focus:border-[#85BFBB] rounded-xl px-4 py-3 outline-none transition-all 
                      placeholder:text-gray-400 text-[#1F4F46]"
          />
          <button
            type="submit"
            disabled={isPending || !input.trim()}
            className="absolute right-2 top-2 bg-[#1F4F46] text-white p-2 rounded-lg 
                      hover:bg-[#163a34] disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400 italic">
              No comments yet. Be the first to share love!
            </p>
          </div>
        ) : (
          comments.map((comment) => {
            const isAuthor = comment.userId === blogAuthorId;
            const isOwner = comment.userId === currentUserId;
            const isDeletingThis = commentToDelete === comment.id && isDeleting;

            return (
              <div
                key={comment.id}
                className={`flex gap-4 group animate-in slide-in-from-bottom-2 ${
                  isDeletingThis ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-full bg-[#E9EEE8] shrink-0 overflow-hidden 
                                border border-white shadow-sm flex items-center justify-center"
                >
                  {comment.user.profileImg ? (
                    <Image
                      src={comment.user.profileImg}
                      alt={comment.user.name}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-[#1F4F46] font-serif text-sm">
                      {comment.user.name.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Content Bubble */}
                <div className="flex-1">
                  <div
                    className={`rounded-2xl rounded-tl-none px-4 py-3 relative group/bubble
                    ${
                      isAuthor
                        ? "bg-[#1F4F46]/5 border border-[#1F4F46]/10"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-baseline mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1F4F46]">
                          {comment.user.name}
                        </span>

                        {/* Author Badge */}
                        {isAuthor && (
                          <span
                            className="bg-[#85BFBB] text-white text-[10px] px-1.5 py-0.5 
                                          rounded-full flex items-center gap-0.5 font-medium tracking-wide"
                          >
                            Author
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed">
                      {comment.content}
                    </p>

                    {/* Delete button- */}
                    {isOwner && (
                      <button
                        onClick={() => handleDeleteClick(comment.id)}
                        className="absolute -right-8 top-1/2 -translate-y-1/2 p-2 text-gray-300 
                                  hover:text-red-400 transition opacity-0 group-hover:opacity-100"
                        title="Delete comment"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={!!commentToDelete}
        onClose={() => setCommentToDelete(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        title="Delete Comment?"
        description="Are you sure you want to delete this comment? This action cannot be undone."
      />
    </div>
  );
}
