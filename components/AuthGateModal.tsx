"use client";

import { X, LogIn, UserPlus } from "lucide-react";
import { useState } from "react";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import ForgotPasswordModal from "./ForgotPasswordModal";

interface AuthGateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthGateModal({ isOpen, onClose }: AuthGateModalProps) {
  const [view, setView] = useState<
    "gate" | "login" | "signup" | "forgot-password"
  >("gate");

  if (!isOpen) return null;

  if (view === "login") {
    return (
      <LoginModal
        onClose={onClose}
        onSwitch={() => setView("signup")}
        onForgot={() => setView("forgot-password")}
      />
    );
  }

  if (view === "signup") {
    return (
      <SignupModal
        onCloseAction={onClose}
        onSwitchAction={() => setView("login")}
      />
    );
  }

  if (view === "forgot-password") {
    return (
      <ForgotPasswordModal
        onClose={onClose}
        onBackToLogin={() => setView("login")}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F4F46]/40 
                    backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="bg-[#F5F3EF] w-full max-w-md rounded-3xl shadow-2xl p-8 relative 
                    scale-100 animate-in zoom-in-95 duration-200 border border-white/50"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#1F4F46]/50 hover:text-[#1F4F46] 
                    transition p-2 hover:bg-black/5 rounded-full"
        >
          <X size={20} />
        </button>

        <div className="text-center space-y-4 pt-2">
          <div
            className="w-16 h-16 bg-[#85BFBB]/20 text-[#1F4F46] 
                        rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <UserPlus size={32} />
          </div>

          <h2 className="text-3xl font-serif font-bold text-[#1F4F46]">
            Join the Community
          </h2>

          <p className="text-[#1F4F46]/70 leading-relaxed font-serif text-lg">
            Sign up to share your gratitude, write stories, and connect with
            others.
          </p>

          <div className="pt-6 flex flex-col gap-3">
            <button
              onClick={() => setView("login")}
              className="w-full bg-[#1F4F46] text-white py-3.5 rounded-xl font-bold 
                        hover:bg-[#163a34] transition shadow-lg shadow-[#1F4F46]/20 flex items-center justify-center gap-2"
            >
              <LogIn size={18} /> Log In
            </button>
            <button
              onClick={() => setView("signup")}
              className="w-full bg-white border-2 border-[#1F4F46]/10 text-[#1F4F46] 
                        py-3.5 rounded-xl font-bold hover:bg-gray-50 transition"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
