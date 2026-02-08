"use client";

import { useActionState, useEffect } from "react";
import { login } from "@/actions/auth.actions";
import { X, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface LoginModalProps {
  onClose: () => void;
  onSwitch: () => void;
}

export default function LoginModal({ onClose, onSwitch }: LoginModalProps) {
  const [state, action, isPending] = useActionState(login, undefined);
  const router = useRouter();

  // Handle Success Redirect
  useEffect(() => {
    if (state?.message === "Success! Logged in.") {
      const timer = setTimeout(() => {
        onClose();
        router.push("/home");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state?.message, onClose, router]);

  return (
    <div
      className="fixed inset-0 z-100 flex items-center 
                    justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div
        className="relative w-full max-w-lg 
                      bg-[#E9EEE8] rounded-3xl p-10 shadow-2xl 
                      animate-in fade-in zoom-in duration-200"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-8 text-[#1F4F46]/50 
                    hover:text-[#1F4F46] transition-colors"
        >
          <X size={32} />
        </button>

        <h2 className="text-center text-5xl text-[#1F4F46] mb-8 uppercase">
          Login
        </h2>

        {/* Global Error Message */}
        {state?.message && state.message !== "Success! Logged in." && (
          <div
            className="bg-red-100 text-red-600 p-3 rounded-lg 
                          mb-6 flex items-center gap-2 text-sm font-medium"
          >
            <AlertCircle size={16} />
            {state.message}
          </div>
        )}

        {/* Success Message */}
        {state?.message === "Success! Logged in." && (
          <div
            className="bg-[#85BFBB] text-white p-3 
                          rounded-lg mb-6 text-center font-bold"
          >
            Welcome back! Redirecting...
          </div>
        )}

        <form action={action} className="space-y-6">
          {/* USERNAME INPUT */}
          <div className="space-y-1">
            <input
              required
              name="username"
              type="text"
              placeholder="Username"
              className="w-full bg-transparent border-b border-[#1F4F46]/30 
                        py-2 outline-none focus:border-[#1F4F46] transition-colors 
                        placeholder:text-[#1F4F46]/40 text-[#1F4F46]"
            />
            {state?.errors?.username && (
              <p className="text-red-500 text-xs mt-1">
                {state.errors.username}
              </p>
            )}
          </div>

          {/* PASSWORD INPUT */}
          <div className="space-y-1">
            <input
              required
              name="password"
              type="password"
              placeholder="Password"
              className="w-full bg-transparent border-b border-[#1F4F46]/30 
                        py-2 outline-none focus:border-[#1F4F46] transition-colors 
                        placeholder:text-[#1F4F46]/40 text-[#1F4F46]"
            />
            {state?.errors?.password && (
              <p className="text-red-500 text-xs mt-1">
                {state.errors.password}
              </p>
            )}
          </div>

          <button
            disabled={isPending || state?.message === "Success! Logged in."}
            className="w-full bg-[#85BFBB] text-white py-4 
                      rounded-full font-bold mt-4 hover:bg-[#74aeaa] 
                      transition-colors shadow-md flex justify-center items-center 
                      gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" size={20} /> LOGGING IN...
              </>
            ) : (
              "LOGIN"
            )}
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
