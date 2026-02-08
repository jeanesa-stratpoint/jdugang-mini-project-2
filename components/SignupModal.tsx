"use client";

import { useActionState, useEffect, useState } from "react";
import { signup, checkUsernameAvailability } from "@/actions/auth.actions";
import { X, Check, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignupModal({
  onCloseAction,
  onSwitchAction,
}: {
  onCloseAction: () => void;
  onSwitchAction: () => void;
}) {
  const [state, action, isPending] = useActionState(signup, undefined);
  const router = useRouter();

  // --- REAL-TIME STATES ---
  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // --- DERIVED STATE (Fix: Calculated immediately, no useEffect needed) ---
  const pwdCriteria = {
    length: password.length >= 8,
    letter: /[a-zA-Z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const isPasswordValid =
    pwdCriteria.length && pwdCriteria.letter && pwdCriteria.number;
  const isMatch = confirmPassword.length > 0 && password === confirmPassword;

  // --- EFFECTS ---

  // 1. Username Debounce Check (This still needs useEffect because of the timer)
  useEffect(() => {
    const checkUsername = async () => {
      if (username.length < 3) {
        setUsernameStatus("idle");
        return;
      }
      setUsernameStatus("checking");

      const result = await checkUsernameAvailability(username);
      setUsernameStatus(result.available ? "available" : "taken");
    };

    const timer = setTimeout(checkUsername, 500);
    return () => clearTimeout(timer);
  }, [username]);

  // 2. Close on Success
  useEffect(() => {
    if (state?.message === "Success! Account created.") {
      const timer = setTimeout(() => {
        onCloseAction();
        router.push("/home");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state?.message, onCloseAction, router]);

  return (
    <div
      className="fixed inset-0 z-100 flex items-center 
                    justify-center bg-black/40 backdrop-blur-sm 
                    p-4 overflow-y-auto"
    >
      <div
        className="relative w-full max-w-lg bg-[#1F4F46] 
                      rounded-3xl p-8 md:p-10 shadow-2xl text-white 
                      animate-in fade-in zoom-in duration-200 my-10"
      >
        <button
          onClick={onCloseAction}
          className="absolute top-6 right-8 text-white/50 
                    hover:text-white transition-colors"
        >
          <X size={32} />
        </button>

        <h2
          className="text-center text-4xl md:text-5xl 
                      font-serif mb-8 uppercase tracking-tight"
        >
          Sign Up
        </h2>

        {state?.message === "Success! Account created." && (
          <div
            className="bg-[#85BFBB] text-[#1F4F46] p-4 rounded-xl 
                          mb-6 text-center font-bold flex items-center justify-center gap-2"
          >
            <Check size={20} /> Success! Redirecting...
          </div>
        )}

        <form action={action} className="space-y-5">
          {/* NAME */}
          <div className="space-y-1">
            <input
              required
              name="name"
              placeholder="Full Name"
              className="w-full bg-transparent border-b border-white/30 
                        py-2 outline-none focus:border-white transition-colors 
                        placeholder:text-white/40"
            />
            {state?.errors?.name && (
              <p className="text-red-300 text-xs">{state.errors.name}</p>
            )}
          </div>

          {/* USERNAME (Real-time) */}
          <div className="space-y-1 relative">
            <input
              required
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent border-b border-white/30 
                        py-2 outline-none focus:border-white transition-colors 
                        placeholder:text-white/40"
            />
            <div className="absolute right-0 top-2">
              {usernameStatus === "checking" && (
                <Loader2 className="animate-spin text-white/50" size={16} />
              )}
              {usernameStatus === "taken" && (
                <span className="text-red-300 text-xs flex items-center gap-1">
                  <X size={12} /> Taken
                </span>
              )}
              {usernameStatus === "available" && (
                <span className="text-[#85BFBB] text-xs flex items-center gap-1">
                  <Check size={12} /> Available
                </span>
              )}
            </div>
            {state?.errors?.username && (
              <p className="text-red-300 text-xs">{state.errors.username}</p>
            )}
          </div>

          {/* EMAIL */}
          <div className="space-y-1">
            <input
              required
              name="email"
              type="email"
              placeholder="Email"
              className="w-full bg-transparent border-b border-white/30 
                        py-2 outline-none focus:border-white transition-colors 
                        placeholder:text-white/40"
            />
            {state?.errors?.email && (
              <p className="text-red-300 text-xs">{state.errors.email}</p>
            )}
          </div>

          {/* PASSWORD (Real-time Checklist) */}
          <div className="space-y-2">
            <input
              required
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-white/30 
                        py-2 outline-none focus:border-white transition-colors 
                        placeholder:text-white/40"
            />

            <div className="flex flex-col gap-1 mt-2 pl-1">
              <PasswordRequirement
                label="At least 8 characters"
                met={pwdCriteria.length}
              />
              <PasswordRequirement
                label="Contains a letter"
                met={pwdCriteria.letter}
              />
              <PasswordRequirement
                label="Contains a number"
                met={pwdCriteria.number}
              />
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="space-y-1 relative">
            <input
              required
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-transparent border-b border-white/30 
                        py-2 outline-none focus:border-white transition-colors 
                        placeholder:text-white/40"
            />
            {confirmPassword.length > 0 && (
              <div className="absolute right-0 top-2 text-xs">
                {isMatch ? (
                  <span className="text-[#85BFBB] flex items-center gap-1">
                    <Check size={12} /> Matched
                  </span>
                ) : (
                  <span className="text-red-300 flex items-center gap-1">
                    <AlertCircle size={12} /> No match
                  </span>
                )}
              </div>
            )}
          </div>

          <button
            disabled={
              isPending ||
              state?.message === "Success! Account created." ||
              usernameStatus === "taken" ||
              !isPasswordValid ||
              !isMatch
            }
            className="w-full bg-[#85BFBB] text-[#1F4F46] py-4 rounded-full 
                      font-bold mt-6 hover:bg-[#97cfcc] transition-colors 
                      shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "CREATING..." : "CREATE ACCOUNT"}
          </button>

          <p className="text-center text-sm text-white/60 mt-4">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchAction}
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

// Helper Component for the checklist
function PasswordRequirement({ label, met }: { label: string; met: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 text-xs transition-colors ${met ? "text-[#85BFBB]" : "text-white/40"}`}
    >
      {met ? (
        <Check size={12} />
      ) : (
        <div className="w-3 h-3 rounded-full border border-current" />
      )}
      {label}
    </div>
  );
}
