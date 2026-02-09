"use client";

import { useActionState } from "react";
import { X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { requestPasswordReset } from "@/actions/auth.actions";

interface ForgotPasswordModalProps {
  onClose: () => void;
  onBackToLogin: () => void;
}

export default function ForgotPasswordModal({
  onClose,
  onBackToLogin,
}: ForgotPasswordModalProps) {
  const [state, action, isPending] = useActionState(
    requestPasswordReset,
    undefined,
  );

  return (
    <div
      className="fixed inset-0 z-100 flex items-center 
                  justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div
        className="relative w-full max-w-lg bg-[#F5F3EF] rounded-3xl 
                      p-10 shadow-2xl animate-in fade-in zoom-in duration-200"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-8 text-[#1F4F46]/50 hover:text-[#1F4F46] transition-colors"
        >
          <X size={32} />
        </button>

        <div className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-serif text-[#1F4F46] leading-tight">
            Forgot your password
          </h2>

          {!state?.success && (
            <p className="text-[#1F4F46] text-lg font-serif">
              Please enter your email address.
            </p>
          )}
        </div>

        {/* Success State */}
        {state?.success ? (
          <div className="mt-8 text-center space-y-6">
            <div className="bg-[#85BFBB]/20 text-[#1F4F46] p-6 rounded-xl flex flex-col items-center gap-4">
              <div className="w-12 h-12 bg-[#85BFBB] rounded-full flex items-center justify-center text-white">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Check your email</h3>
                <p className="text-sm opacity-80 mt-1">{state.message}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-[#1F4F46] underline hover:text-[#85BFBB] transition-colors"
            >
              Close Window
            </button>
          </div>
        ) : (
          /* Form State */
          <form action={action} className="mt-8 space-y-8">
            {/* Error Message */}
            {state?.message && !state.success && (
              <div className="bg-red-100 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm font-medium">
                <AlertCircle size={16} />
                {state.message}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[#1F4F46] text-lg font-serif"></label>
              <input
                required
                name="email"
                type="email"
                placeholder="Email Address"
                className="w-full bg-transparent border-b border-[#1F4F46] placeholder:text-sm
                        py-2 outline-none text-[#1F4F46] text-lg 
                        focus:border-[#85BFBB] transition-colors"
              />
            </div>

            <div className="space-y-6 pt-4">
              <button
                disabled={isPending}
                className="w-full bg-[#85BFBB] text-white py-2 rounded-md 
                            font-bold text-md hover:bg-[#74aeaa] transition-colors shadow-sm 
                            disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin" /> Sending...
                  </>
                ) : (
                  "Request reset link"
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="text-[#1F4F46] font-bold underline decoration-1 underline-offset-4 
                            hover:text-[#85BFBB] transition-colors"
                >
                  Go back to Login
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
