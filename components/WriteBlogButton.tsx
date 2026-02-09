"use client";

import { useState } from "react";
import { PenTool } from "lucide-react";
import WriteBlogModal from "./WriteBlogModal";

export default function WriteBlogButton({
  userId,
  label = "Write",
}: {
  userId: string;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[#1F4F46] text-white px-6 py-3 rounded-full 
                font-bold shadow-lg hover:bg-[#163a34] transition flex items-center 
                gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500"
      >
        <PenTool size={18} />
        {label}
      </button>

      <WriteBlogModal
        userId={userId}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
