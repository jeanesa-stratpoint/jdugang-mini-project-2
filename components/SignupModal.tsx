"use client";

import { useActionState } from "react";
import { signup } from "@/actions/auth";
import { X } from "lucide-react";

export default function SignupModal({
  onCloseAction,
  onSwitchAction,
}: {
  onCloseAction: () => void;
  onSwitchAction: () => void;
}) {
  const [state, action, isPending] = useActionState(signup, undefined);

  return (
    <div
      className="fixed inset-0 z-100 flex items-center 
                    justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div
        className="relative w-full max-w-lg bg-[#1F4F46] 
                      rounded-3xl p-10 shadow-2xl text-white 3
                      animate-in fade-in zoom-in duration-200"
      >
        {/* Close Button using renamed prop */}
        <button
          onClick={onCloseAction}
          className="absolute top-6 right-8 text-white/50 
                      hover:text-white transition-colors"
        >
          <X size={32} />
        </button>

        <h2 className="text-center text-5xl font-serif mb-12 uppercase tracking-tight">
          Sign Up
        </h2>

        <form action={action} className="space-y-4">
          <div className="space-y-1">
            <input
              required
              name="name"
              placeholder="Name"
              className="w-full bg-transparent border-b 
                        border-white/30 py-2 outline-none 
                        focus:border-white transition-colors 
                        placeholder:text-white/40"
            />
            {state?.errors?.name && (
              <p className="text-red-400 text-xs mt-1">{state.errors.name}</p>
            )}
          </div>

          <div className="space-y-1">
            <input
              required
              name="email"
              type="email"
              placeholder="Email"
              className="w-full bg-transparent border-b 
                        border-white/30 py-2 outline-none 
                        focus:border-white transition-colors 
                        placeholder:text-white/40"
            />
            {state?.errors?.email && (
              <p className="text-red-400 text-xs mt-1">{state.errors.email}</p>
            )}
          </div>

          <div className="space-y-1">
            <input
              required
              name="password"
              type="password"
              placeholder="Password"
              className="w-full bg-transparent border-b 
                        border-white/30 py-2 outline-none 
                        focus:border-white transition-colors 
                        placeholder:text-white/40"
            />
            {state?.errors?.password && (
              <p className="text-red-400 text-xs mt-1">
                {state.errors.password}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <input
              required
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              className="w-full bg-transparent border-b 
                        border-white/30 py-2 outline-none 
                        focus:border-white transition-colors 
                        placeholder:text-white/40"
            />
            {state?.errors?.confirmPassword && (
              <p className="text-red-400 text-xs mt-1">
                {state.errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            disabled={isPending}
            className="w-full bg-[#85BFBB] text-[#1F4F46] 
                      py-4 rounded-full font-bold mt-6 hover:bg-[#97cfcc] 
                      transition-colors shadow-md disabled:opacity-50 
                      disabled:cursor-not-allowed"
          >
            {isPending ? "CREATING..." : "CREATE ACCOUNT"}
          </button>

          <p className="text-center text-sm text-white/60 mt-4">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchAction}
              className="text-white underline 
                        hover:text-[#85BFBB] transition-colors"
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
