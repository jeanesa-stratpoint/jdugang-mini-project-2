import { Heart } from "lucide-react";
import { DUMMY_GRATITUDE } from "@/data/mock";

export function GratitudeCard({ note }: { note: (typeof DUMMY_GRATITUDE)[0] }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-[#85BFBB]/20 shadow-sm flex flex-col justify-between min-h-45 mb-4">
      <div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-bold text-[#1F4F46]">{note.name}</span>
          <div className="flex gap-1 text-[#85BFBB]">
            <Heart size={12} fill="currentColor" />
            <Heart size={12} fill="currentColor" />
            <Heart size={12} fill="currentColor" />
          </div>
        </div>
        <p className="italic text-[#1F4F46]/90 text-sm leading-relaxed">
          {note.content}
        </p>
      </div>
      <span className="text-[10px] text-[#1F4F46]/40 text-right mt-4">
        {note.date}
      </span>
    </div>
  );
}
