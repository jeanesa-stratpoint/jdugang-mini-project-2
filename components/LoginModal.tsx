"use client";

import { X } from "lucide-react";

interface LoginModalProps {
  onClose: () => void;
  onSwitch: () => void;
}

export default function LoginModal({ onClose, onSwitch }: LoginModalProps) {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-[#E9EEE8] rounded-3xl p-10 shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-8 text-[#1F4F46]/50 hover:text-[#1F4F46] transition-colors"
        >
          <X size={32} />
        </button>

        <h2 className="text-center text-5xl font-serif text-[#1F4F46] mb-12 uppercase tracking-tight">
          Login
        </h2>

        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-1">
            <input
              type="text"
              placeholder="Username"
              className="w-full bg-transparent border-b border-[#1F4F46]/30 py-2 outline-none focus:border-[#1F4F46] transition-colors placeholder:text-[#1F4F46]/40 text-[#1F4F46]"
            />
          </div>

          <div className="space-y-1">
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-transparent border-b border-[#1F4F46]/30 py-2 outline-none focus:border-[#1F4F46] transition-colors placeholder:text-[#1F4F46]/40 text-[#1F4F46]"
            />
          </div>

          <button className="w-full bg-[#85BFBB] text-white py-4 rounded-full font-bold tracking-widest mt-4 hover:bg-[#74aeaa] transition-colors shadow-md">
            LOGIN
          </button>

          <div className="flex justify-between text-sm text-[#1F4F46]/60 italic px-2">
            <button type="button" className="hover:text-[#1F4F46]">
              Forgot?
            </button>
            <button
              type="button"
              onClick={onSwitch}
              className="hover:text-[#1F4F46] hover:underline"
            >
              Need an account?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
