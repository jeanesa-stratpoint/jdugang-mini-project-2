"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import AuthGateModal from "@/components/AuthGateModal";

interface LandingPageActionsProps {
  variant: "hero" | "read_more";
}

export default function LandingPageActions({
  variant,
}: LandingPageActionsProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {variant === "hero" && (
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#1F4F46] text-white px-8 py-3 rounded-full font-bold 
                        hover:bg-[#163a34] transition flex items-center gap-2 shadow-lg 
                        hover:shadow-xl hover:-translate-y-0.5 transform duration-200"
          >
            Start Writing <ArrowRight size={18} />
          </button>
        </div>
      )}

      {variant === "read_more" && (
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 text-[#1F4F46] font-bold hover:text-[#85BFBB] transition group"
        >
          <span className="border-b-2 border-[#1F4F46]/20 group-hover:border-[#85BFBB]">
            Join to read more stories
          </span>
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      )}

      {showModal && (
        <AuthGateModal isOpen={true} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
