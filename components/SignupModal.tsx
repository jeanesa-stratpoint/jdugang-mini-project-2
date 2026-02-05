"use client";

import { X } from "lucide-react";

interface SignupModalProps {
  onClose: () => void;
  onSwitch: () => void;
}

export default function SignupModal({ onClose, onSwitch }: SignupModalProps) {
  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center 
                    bg-black/40 backdrop-blur-sm p-4"
    >
      {/* Modal Container */}
      <div
        className="relative w-full max-w-lg 
                    bg-[#1F4F46] rounded-3xl p-10 shadow-2xl 
                    text-white animate-in fade-in zoom-in duration-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-8 text-white/50 hover:text-white transition-colors"
        >
          <X size={32} />
        </button>

        <h2 className="text-center text-5xl font-serif mb-12 uppercase tracking-tight">
          Sign Up
        </h2>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {["Name", "Username", "Email", "Password", "Confirm Password"].map(
            (field) => (
              <div key={field} className="space-y-1">
                <input
                  type={field.includes("Password") ? "password" : "text"}
                  placeholder={field}
                  className="w-full bg-transparent border-b text-[#85BFBB]
                            border-white/30 py-2 outline-none 
                            focus:border-white transition-colors 
                            placeholder:text-white/40"
                />
              </div>
            ),
          )}

          <button
            className="w-full bg-[#85BFBB] text-[#1F4F46] 
                            py-4 rounded-full font-bold mt-6 
                            hover:bg-[#97cfcc] transition-colors shadow-md"
          >
            CREATE ACCOUNT
          </button>

          <p className="text-center text-sm text-white/60 mt-4">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitch}
              className="text-white underline hover:text-[#85BFBB] transition-colors"
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
