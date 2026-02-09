"use client";

import { useState } from "react";
import { PenTool, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { createBlog } from "@/actions/home.actions";

interface WriteBlogModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function WriteBlogModal({
  userId,
  isOpen,
  onClose,
}: WriteBlogModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  async function onSubmit(formData: FormData) {
    setIsSubmitting(true);
    // In a real app, handle image upload to UploadThing here first,
    // get the URL, and append it to formData.

    await createBlog(userId, formData);
    setIsSubmitting(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-[#F5F3EF] rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-serif text-[#1F4F46]">Write a Story</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-[#1F4F46] transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form action={onSubmit} className="space-y-6">
          <div>
            <input
              name="title"
              required
              placeholder="Title of your story..."
              className="w-full bg-transparent text-3xl font-serif text-[#1F4F46] placeholder:text-[#1F4F46]/30 outline-none border-b border-gray-200 pb-2 focus:border-[#85BFBB] transition"
            />
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <label className="flex items-center gap-2 cursor-pointer hover:text-[#85BFBB] transition">
              <ImageIcon size={18} />
              <span>Add Cover Image</span>
              <input
                type="file"
                name="image"
                className="hidden"
                accept="image/*"
              />
            </label>
            {/* Hint for demo */}
            <span className="text-xs text-gray-300">
              (Image upload needs Cloudinary setup)
            </span>
          </div>

          <div>
            <textarea
              name="content"
              required
              placeholder="Tell your story..."
              className="w-full h-48 bg-transparent text-lg text-[#1F4F46] placeholder:text-[#1F4F46]/30 outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-[#1F4F46] font-medium hover:bg-black/5 rounded-full transition"
            >
              Cancel
            </button>
            <button
              disabled={isSubmitting}
              className="bg-[#85BFBB] text-white px-8 py-2 rounded-full font-bold shadow-md hover:bg-[#74aeaa] transition flex items-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <PenTool size={18} />
              )}
              Publish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
