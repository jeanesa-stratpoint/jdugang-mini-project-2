"use client";

import { useSearchParams } from "next/navigation";
import { useState, useActionState, Suspense } from "react";
import { resetPassword } from "@/actions/auth.actions";
import { Loader2, Lock, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import PasswordRequirement from "@/components/PasswordRequirement";
import BlogNameCard from "@/components/BlogNameCard";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#E0E5DF] flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <BlogNameCard />
      </div>

      <Suspense
        fallback={<Loader2 className="animate-spin text-[#1F4F46]" size={40} />}
      >
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [state, action, isPending] = useActionState(resetPassword, undefined);

  const isValidLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!token) {
    return (
      <div className="text-center text-red-500 text-xl">
        Invalid link. Missing token.
      </div>
    );
  }

  if (state?.success) {
    return (
      <div
        className="w-full max-w-lg bg-[#F5F3EF] rounded-xl shadow-xl 
                      p-10 text-center animate-in fade-in zoom-in duration-300"
      >
        <div className="flex justify-center mb-6">
          <div
            className="w-20 h-20 rounded-full border-4 
                          border-[#85BFBB] flex items-center justify-center text-[#85BFBB]"
          >
            <CheckCircle size={48} strokeWidth={3} />
          </div>
        </div>
        <h2 className="text-3xl text-[#85BFBB] mb-2 font-bold">Successful!</h2>
        <p className="text-[#1F4F46] text-lg mb-6">
          You have successfully reset your password. Go to{" "}
          <Link href="/" className="font-bold hover:underline">
            Login
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-lg bg-[#F5F3EF] rounded-xl 
                    shadow-xl p-8 md:p-12 animate-in fade-in zoom-in duration-300"
    >
      <h1 className="text-3xl text-[#1F4F46] font-bold mb-2">Reset Password</h1>
      <p className="text-[#1F4F46]/70 mb-8">
        Please enter a new password for your account.
      </p>

      {state?.message && !state.success && (
        <div
          className="bg-red-100 text-red-600 p-3 
                        rounded-lg mb-6 flex items-center gap-2 text-sm font-medium"
        >
          <AlertCircle size={16} />
          {state.message}
        </div>
      )}

      <form action={action} className="space-y-6">
        <input type="hidden" name="token" value={token} />

        {/* New Password Field */}
        <div className="space-y-2">
          <label className="text-[#1F4F46] italic flex items-center gap-2 text-lg">
            <Lock size={18} /> New Password
          </label>

          <input
            required
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-b border-[#1F4F46] 
                      py-2 outline-none text-[#1F4F46] focus:border-[#85BFBB] 
                      transition-colors placeholder:text-sm"
            placeholder="New Password"
          />

          <div className="pl-1 space-y-1 mt-2 flex flex-col gap-1">
            <PasswordRequirement
              label="At least 8 characters long"
              met={isValidLength}
              variant="light"
            />
            <PasswordRequirement
              label="Contains at least one letter"
              met={hasLetter}
              variant="light"
            />
            <PasswordRequirement
              label="Contains at least one number"
              met={hasNumber}
              variant="light"
            />
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <label className="text-[#1F4F46] italic flex items-center gap-2 text-lg">
            <Lock size={18} /> Confirm New Password
          </label>
          <input
            required
            name="confirmPassword"
            type="password"
            className="w-full bg-transparent border-b border-[#1F4F46] 
                      py-2 outline-none text-[#1F4F46] focus:border-[#85BFBB] 
                      transition-colors placeholder:text-sm"
            placeholder="Confirm New Password"
          />
        </div>

        <button
          disabled={isPending || !isValidLength}
          className="w-full bg-[#85BFBB] text-white py-3 rounded-full font-bold mt-4 
                    hover:bg-[#74aeaa] transition-colors shadow-md disabled:opacity-50 
                    flex items-center justify-center uppercase tracking-wide"
        >
          {isPending ? <Loader2 className="animate-spin" /> : "RESET PASSWORD"}
        </button>
      </form>
    </div>
  );
}
