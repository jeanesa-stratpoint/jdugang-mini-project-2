"use client";

import { useState } from "react";
import { createGratitudeEntry } from "@/actions/gratitude.actions";
import { SendHorizontal, Loader2, Heart } from "lucide-react";
import Image from "next/image";

interface GratitudeInputProps {
  userId: string;
  userImage?: string | null;
  userName?: string | null;
}

export default function GratitudeInput({
  userId,
  userImage,
  userName,
}: GratitudeInputProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    await createGratitudeEntry(userId, content);
    setContent("");
    setIsSubmitting(false);
  }

  return (
    <div className="bg-white rounded-[32px] shadow-xl p-8 mb-10 max-w-2xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 border border-gray-100">
            {userImage ? (
              <Image
                src={userImage}
                alt="Profile"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#1F4F46] text-white">
                {userName?.charAt(0) || "A"}
              </div>
            )}
          </div>
          <span className="font-bold text-[#1F4F46] text-lg">
            {userName || "Anonymous"}
          </span>
        </div>

        <div className="flex gap-1.5 opacity-80">
          <Heart size={20} className="text-[#85BFBB] fill-[#85BFBB]" />
          <Heart size={20} className="text-[#85BFBB] fill-[#85BFBB]" />
          <Heart size={20} className="text-[#85BFBB] fill-[#85BFBB]" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h3 className="text-[#1F4F46] text-2xl mb-4 leading-tight">
            What are you grateful for today?
          </h3>
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={280}
              placeholder="I am grateful for..."
              className="w-full bg-transparent border-b-2 border-gray-200 focus:border-[#1F4F46] outline-none 
                        text-[#1F4F46] text-xl placeholder:text-gray-300 resize-none h-20 transition-colors py-2"
            />
          </div>
        </div>

        <div className="flex items-end justify-between pt-2">
          <span
            className={`text-sm font-medium ${content.length > 279 ? "text-red-500" : "text-gray-400"}`}
          >
            {content.length}/280
          </span>
          <button
            disabled={isSubmitting || !content.trim()}
            type="submit"
            className="text-[#1F4F46] disabled:opacity-30 disabled:cursor-not-allowed 
                        hover:scale-110 transition-transform duration-200"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={32} />
            ) : (
              <SendHorizontal size={32} strokeWidth={1.5} />
            )}
          </button>
        </div>

        <div
          suppressHydrationWarning
          className="text-right text-gray-400 italic text-sm mt-2"
        >
          {currentDate}
        </div>
      </form>
    </div>
  );
}
