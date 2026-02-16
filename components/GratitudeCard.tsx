"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2, Heart } from "lucide-react";
import { formatDate } from "@/lib/utils/formatdate";
import DeleteModal from "@/components/DeleteModal";
import { deleteGratitudeEntry } from "@/actions/gratitude.actions";

export interface GratitudeEntry {
  id: string;
  content: string;
  createdAt: Date | string;
  authorId: string;
  author: {
    name: string;
    profileImg: string | null;
  };
}

interface GratitudeCardProps {
  entry: GratitudeEntry;
  currentUserId: string;
}

export default function GratitudeCard({
  entry,
  currentUserId,
}: GratitudeCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formattedDate = formatDate(entry.createdAt);
  const isOwner = currentUserId === entry.authorId;

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteGratitudeEntry(entry.id, currentUserId);
    setIsDeleting(false);
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="break-inside-avoid bg-white rounded-3xl shadow-xl p-8 mb-6 border border-gray-100 flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 border border-gray-100">
              {entry.author.profileImg ? (
                <Image
                  src={entry.author.profileImg}
                  alt={entry.author.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#1F4F46] text-white">
                  {entry.author.name.charAt(0)}
                </div>
              )}
            </div>
            <span className="font-bold text-[#1F4F46] text-lg leading-tight">
              {entry.author.name}
            </span>
          </div>

          <div className="flex gap-1">
            <Heart size={15} className="text-[#85BFBB] fill-[#85BFBB]" />
            <Heart size={15} className="text-[#85BFBB] fill-[#85BFBB]" />
            <Heart size={15} className="text-[#85BFBB] fill-[#85BFBB]" />
          </div>
        </div>

        <div className="mb-6">
          <p className="text-[#1F4F46] text-lg leading-relaxed">
            {entry.content}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
          <div>
            {isOwner ? (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="text-red-300 hover:text-red-500 transition p-1 hover:bg-red-50 rounded-full"
                title="Delete note"
              >
                <Trash2 size={16} />
              </button>
            ) : (
              <div className="w-4" />
            )}
          </div>

          <span className="text-gray-400 italic text-sm">{formattedDate}</span>
        </div>
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title="Delete Note?"
        description="Are you sure you want to remove this note from the wall? This action cannot be undone."
      />
    </>
  );
}
