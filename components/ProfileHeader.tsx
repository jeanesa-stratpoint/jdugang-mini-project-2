"use client";

import Image from "next/image";
import DeleteModal from "./DeleteModal";
import { useState } from "react";
import { UploadButton } from "@/lib/utils/uploadthing";
import { updateProfileImage } from "@/actions/home.actions";
import { Camera, Trash2, RefreshCcw, Loader2 } from "lucide-react";

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
  const stats = [
    { label: "Posts", value: user.stats.posts },
    { label: "Likes", value: user.stats.likes },
    { label: "Comments", value: user.stats.comments },
  ];
  const [imgUrl, setImgUrl] = useState<string | null>(user.profileImg);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const renameFile = (files: File[]) => {
    return files.map((file) => {
      const extension = file.name.split(".").pop();
      const cleanName = user.name.replace(/\s+/g, "_").toLowerCase();
      const newName = `${user.id}_${cleanName}.${extension}`;
      return new File([file], newName, { type: file.type });
    });
  };

  const handleRemoveClick = () => {
    setShowDeleteModal(true);
  };

  const confirmRemove = async () => {
    if (!imgUrl) return;

    setIsDeleting(true);
    setShowDeleteModal(false);

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
      <div
        className="bg-white rounded-xl p-8 shadow-sm border 
                      border-gray-100 flex flex-col md:flex-row items-center gap-8 
                      animate-in fade-in slide-in-from-bottom-4 duration-500"
      >
        {/* Profile img*/}
        <div className="relative group w-32 h-32 shrink-0">
          <div
            className="w-full h-full rounded-full overflow-hidden border-4 
                        border-[#E9EEE8] shadow-inner bg-[#1F4F46] flex items-center 
                        justify-center text-white text-5xl font-serif relative"
          >
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

          {/* Hover */}
          <div
            className="absolute inset-0 bg-black/60 rounded-full 
                          opacity-0 group-hover:opacity-100 transition-opacity 
                          flex flex-col items-center justify-center gap-2 z-10 p-2"
          >
            {imgUrl ? (
              <>
                {/* Change btn */}
                <div
                  className="relative cursor-pointer flex flex-col 
                              items-center text-white/90 hover:text-white transition"
                >
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

                {/* Remove btn, then open the modal) */}
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
              <div
                className="relative w-full h-full flex flex-col 
                            items-center justify-center text-white cursor-pointer"
              >
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

        {/* user details*/}
        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <h2 className="text-3xl text-[#1F4F46]">{user.name}</h2>
            <p className="text-gray-500">@{user.username}</p>
          </div>

          <div className="flex justify-center md:justify-start gap-8">
            {stats.map(({ label, value }) => (
              <div key={label} className="text-center md:text-left">
                <span className="block text-2xl font-bold text-[#85BFBB]">
                  {value}
                </span>
                <span className="text-xs text-gray-400 uppercase tracking-wider">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center text-center">
        <DeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmRemove}
          isDeleting={isDeleting}
          title="Remove Photo?"
          description="Are you sure you want to remove your profile photo? 
                      This will revert your avatar to the default initial."
        />
      </div>
    </>
  );
}
