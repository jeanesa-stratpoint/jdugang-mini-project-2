"use client";

import { useState } from "react";
import { UploadButton } from "@/lib/utils/uploadthing";
import { updateProfileImage } from "@/actions/home.actions";
import {
  Camera,
  Trash2,
  RefreshCcw,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";
import Image from "next/image";

interface ProfileHeaderProps {
  user: {
    id: string;
    name: string;
    username: string;
    profileImg: string | null;
    stats: { posts: number; likes: number; comments: number };
  };
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const [imgUrl, setImgUrl] = useState<string | null>(user.profileImg);
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. New State for the Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Helper: Rename file
  const renameFile = (files: File[]) => {
    return files.map((file) => {
      const extension = file.name.split(".").pop();
      const cleanName = user.name.replace(/\s+/g, "_").toLowerCase();
      const newName = `${user.id}_${cleanName}.${extension}`;
      return new File([file], newName, { type: file.type });
    });
  };

  // 2. Trigger the Modal instead of window.confirm
  const handleRemoveClick = () => {
    setShowDeleteModal(true);
  };

  // 3. Actual Delete Logic (Called by Modal)
  const confirmRemove = async () => {
    if (!imgUrl) return;

    setIsDeleting(true);
    setShowDeleteModal(false); // Close modal immediately to show spinner

    try {
      await updateProfileImage(user.id, null, imgUrl);
      setImgUrl(null);
    } catch (error) {
      console.error("Failed to delete", error);
      alert("Failed to remove photo.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* 1. PROFILE IMAGE AREA */}
        <div className="relative group w-32 h-32 shrink-0">
          <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#E9EEE8] shadow-inner bg-[#1F4F46] flex items-center justify-center text-white text-5xl font-serif relative">
            {isDeleting ? (
              <Loader2 className="animate-spin text-white" />
            ) : imgUrl ? (
              <Image
                src={imgUrl}
                alt={user.name}
                fill
                className="object-cover"
              />
            ) : (
              <span>{user.name.charAt(0).toUpperCase()}</span>
            )}
          </div>

          {/* HOVER OVERLAY */}
          <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 z-10 p-2">
            {imgUrl ? (
              <>
                {/* CHANGE BUTTON */}
                <div className="relative cursor-pointer flex flex-col items-center text-white/90 hover:text-white transition">
                  <RefreshCcw size={18} />
                  <span className="text-[9px] font-bold uppercase mt-0.5">
                    Change
                  </span>
                  <div className="absolute inset-0 opacity-0 overflow-hidden w-full h-full">
                    <UploadButton
                      endpoint="imageUploader"
                      onBeforeUploadBegin={renameFile}
                      onClientUploadComplete={(res) => {
                        const newUrl = res[0].url;
                        updateProfileImage(user.id, newUrl, imgUrl);
                        setImgUrl(newUrl);
                      }}
                      appearance={{
                        button: {
                          width: "100%",
                          height: "100%",
                          cursor: "pointer",
                        },
                        container: { width: "100%", height: "100%" },
                        allowedContent: { display: "none" },
                      }}
                    />
                  </div>
                </div>

                <div className="w-8 h-px bg-white/30" />

                {/* REMOVE BUTTON (Now opens modal) */}
                <button
                  onClick={handleRemoveClick}
                  className="flex flex-col items-center text-red-300 hover:text-red-400 transition"
                >
                  <Trash2 size={18} />
                  <span className="text-[9px] font-bold uppercase mt-0.5">
                    Remove
                  </span>
                </button>
              </>
            ) : (
              <div className="relative w-full h-full flex flex-col items-center justify-center text-white cursor-pointer">
                <Camera size={24} />
                <span className="text-[10px] mt-1 font-bold">UPLOAD</span>
                <div className="absolute inset-0 opacity-0 w-full h-full">
                  <UploadButton
                    endpoint="imageUploader"
                    onBeforeUploadBegin={renameFile}
                    onClientUploadComplete={(res) => {
                      setImgUrl(res[0].url);
                      updateProfileImage(user.id, res[0].url, null);
                    }}
                    appearance={{
                      button: { width: "100%", height: "100%" },
                      container: { width: "100%", height: "100%" },
                      allowedContent: { display: "none" },
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 2. USER DETAILS */}
        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <h2 className="text-3xl font-serif text-[#1F4F46]">{user.name}</h2>
            <p className="text-gray-500">@{user.username}</p>
          </div>

          <div className="flex justify-center md:justify-start gap-8">
            <div className="text-center md:text-left">
              <span className="block text-2xl font-bold text-[#85BFBB]">
                {user.stats.posts}
              </span>
              <span className="text-xs text-gray-400 uppercase tracking-wider">
                Posts
              </span>
            </div>
            <div className="text-center md:text-left">
              <span className="block text-2xl font-bold text-[#85BFBB]">
                {user.stats.likes}
              </span>
              <span className="text-xs text-gray-400 uppercase tracking-wider">
                Likes
              </span>
            </div>
            <div className="text-center md:text-left">
              <span className="block text-2xl font-bold text-[#85BFBB]">
                {user.stats.comments}
              </span>
              <span className="text-xs text-gray-400 uppercase tracking-wider">
                Comments
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- 4. CONFIRMATION MODAL --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative animate-in zoom-in-95 duration-200">
            {/* Close Icon */}
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X size={20} />
            </button>

            {/* Content */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="text-red-500" size={24} />
              </div>

              <h3 className="text-xl font-serif text-[#1F4F46] mb-2">
                Remove Photo?
              </h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Are you sure you want to remove your profile photo? This will
                revert your avatar to the default initial.
              </p>

              {/* Actions */}
              <div className="flex w-full gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemove}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition shadow-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
