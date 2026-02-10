"use client";

import { Heart } from "lucide-react";
import { toggleLike } from "@/actions/blog.actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface LikeButtonProps {
  blogId: string;
  userId: string;
  initialLikesCount: number;
  initialIsLiked: boolean;
}

export default function LikeButton({
  blogId,
  userId,
  initialLikesCount,
  initialIsLiked,
}: LikeButtonProps) {
  const router = useRouter();
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLiked, setIsLiked] = useState(initialIsLiked);

  const handleLike = async () => {
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikesCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

    await toggleLike(blogId, userId);

    router.refresh();
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 border
        ${
          isLiked
            ? "bg-red-50 border-red-200 text-red-500"
            : "bg-white border-gray-100 text-gray-400 hover:border-red-200 hover:text-red-400"
        }`}
    >
      <Heart
        size={20}
        fill={isLiked ? "currentColor" : "none"}
        className={isLiked ? "animate-pulse" : ""}
      />
      <span className="font-medium">{likesCount}</span>
    </button>
  );
}
