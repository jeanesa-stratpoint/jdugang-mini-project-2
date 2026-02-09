"use client";

import { useState } from "react";
import { UploadButton } from "@/utils/uploadthing";
import { updateProfileImage } from "@/actions/home.actions";
import { Camera } from "lucide-react";
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
  // 1. FIX: Define the state for the image URL
  const [imgUrl, setImgUrl] = useState<string | null>(user.profileImg);

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. PROFILE IMAGE WITH HOVER */}
      <div className="relative group w-32 h-32 shrink-0">
        <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#E9EEE8] shadow-inner bg-[#1F4F46] flex items-center justify-center text-white text-5xl font-serif relative">
          {imgUrl ? (
            <Image src={imgUrl} alt={user.name} fill className="object-cover" />
          ) : (
            <span>{user.name.charAt(0).toUpperCase()}</span>
          )}
        </div>

        {/* OVERLAY WITH UPLOAD BUTTON */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full cursor-pointer z-10">
          <div className="relative w-full h-full flex flex-col items-center justify-center text-white">
            <Camera size={24} />
            <span className="text-[10px] mt-1">Upload</span>

            {/* The Invisible UploadThing Button */}
            <div className="absolute inset-0 opacity-0 cursor-pointer">
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  // 1. Get the new URL
                  const newUrl = res[0].url;

                  // 2. Update UI instantly
                  setImgUrl(newUrl);

                  // 3. Save URL to Neon DB
                  updateProfileImage(user.id, newUrl);

                  alert("Profile photo updated!");
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`);
                }}
                appearance={{
                  button: {
                    width: "100%",
                    height: "100%",
                    cursor: "pointer",
                  },
                  container: {
                    width: "100%",
                    height: "100%",
                  },
                  allowedContent: { display: "none" }, // Hides the text "Image (4MB)"
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. USER DETAILS & STATS */}
      <div className="flex-1 text-center md:text-left space-y-4">
        <div>
          <h2 className="text-3xl font-serif text-[#1F4F46]">{user.name}</h2>
          <p className="text-gray-500">@{user.username}</p>
        </div>

        {/* Stats Grid */}
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
  );
}
