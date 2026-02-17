"use client";

import Link from "next/link";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import ForgotPasswordModal from "./ForgotPasswordModal";
import BlogNameCard from "./BlogNameCard";
import NotificationDropdown from "./NotificationDropdown";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { logout } from "@/actions/auth.actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect } from "react";

interface NavbarProps {
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
    profileImg: string | null;
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [authMode, setAuthMode] = useState<
    "login" | "signup" | "forgot" | null
  >(null);
  const isLoggedIn = !!user;

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/status");

        if (isLoggedIn && res.status === 401) {
          window.location.href = "/";
        }

        if (!isLoggedIn && res.status === 200) {
          window.location.reload();
        }
      } catch (error) {
        console.error("Session check failed", error);
      }
    };

    checkSession();

    const onFocus = () => checkSession();
    window.addEventListener("focus", onFocus);

    const intervalId = setInterval(checkSession, 1000 * 60 * 10);

    return () => {
      window.removeEventListener("focus", onFocus);
      clearInterval(intervalId);
    };
  }, [isLoggedIn]);

  if (pathname === "/reset-password") {
    return null;
  }

  const navLinks = [
    { label: "Home", href: "/home" },
    { label: "Gratitude Journal", href: "/journal" },
    { label: "Gratitude Wall", href: "/wall" },
  ];

  const closeAuth = () => setAuthMode(null);

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="w-full bg-[#E9EEE8] border-b border-black/5 sticky top-0 z-50">
      <nav className="max-w-350 mx-auto flex items-center justify-between px-6 md:px-10 py-4">
        <Link href={isLoggedIn ? "/home" : "/"}>
          <BlogNameCard />
        </Link>

        {/* MOBILE HEADER */}
        <div className="flex items-center gap-2 md:hidden">
          {isLoggedIn && user && <NotificationDropdown userId={user.id} />}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-[#1F4F46] z-50 hover:bg-black/5 rounded-full transition relative"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* DESKTOP VIEW */}
        <div className="hidden md:flex items-center gap-6">
          {isLoggedIn && user ? (
            <>
              <div className="flex items-center gap-2">
                {navLinks.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                        active
                          ? "bg-[#85BFBB] text-white"
                          : "text-[#1F4F46] hover:text-[#85BFBB]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <NotificationDropdown userId={user.id} />

              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none ml-2">
                  <Avatar>
                    <AvatarImage src={user.profileImg ?? undefined} />
                    <AvatarFallback className="bg-[#85BFBB] text-white font-serif font-bold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-xl p-2"
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold text-[#1F4F46] leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-[#1F4F46]/60">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={() => setAuthMode("login")}
                className="bg-[#1F4F46] text-white px-7 py-2 rounded-md font-medium 
                          hover:bg-[#163a34] transition shadow-sm"
              >
                Login
              </button>
              <button
                onClick={() => setAuthMode("signup")}
                className="border border-[#1F4F46] text-[#1F4F46] px-7 
                          py-2 rounded-md font-medium hover:bg-white/50 transition"
              >
                Sign up
              </button>
            </div>
          )}
        </div>

        {/* --- MOBILE MENU OVERLAY --- */}
        <div
          className={`fixed inset-0 bg-[#E9EEE8] flex flex-col 
                      items-center justify-center transition-transform 
                      duration-500 ease-in-out z-40 md:hidden ${
                        isOpen ? "translate-x-0" : "translate-x-full"
                      }`}
        >
          <div className="flex flex-col items-center gap-10 w-full px-10">
            {isLoggedIn && user ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-3xl font-serif ${
                      pathname === link.href
                        ? "text-[#85BFBB]"
                        : "text-[#1F4F46]"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="w-full h-px bg-[#1F4F46]/10 my-2" />

                <div className="flex flex-col items-center gap-1 text-center">
                  {/* 👇 FIX: Replaced hardcoded div with Avatar Component */}
                  <Avatar className="w-16 h-16 mb-2 border-2 border-white shadow-sm">
                    <AvatarImage
                      src={user.profileImg ?? undefined}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-[#85BFBB] text-white text-3xl font-serif font-bold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>

                  <p className="text-[#1F4F46] text-lg font-bold">
                    {user.name}
                  </p>
                  <p className="text-[#1F4F46]/60 text-sm">{user.email}</p>
                </div>

                <button
                  onClick={() => logout()}
                  className="text-red-600 text-xl font-bold flex items-center gap-2 mt-4"
                >
                  <LogOut /> Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-6 w-full">
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setIsOpen(false);
                  }}
                  className="bg-[#1F4F46] text-white w-full 
                            max-w-sm py-5 rounded-xl text-2xl font-semibold shadow-md"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setAuthMode("signup");
                    setIsOpen(false);
                  }}
                  className="border-2 border-[#1F4F46] text-[#1F4F46] 
                            w-full max-w-sm py-5 rounded-xl text-2xl font-semibold"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
        </div>

        {/* --- AUTH MODALS --- */}
        {authMode === "login" && (
          <LoginModal
            onClose={closeAuth}
            onSwitch={() => setAuthMode("signup")}
            onForgot={() => setAuthMode("forgot")}
          />
        )}

        {authMode === "signup" && (
          <SignupModal
            onCloseAction={closeAuth}
            onSwitchAction={() => setAuthMode("login")}
          />
        )}

        {authMode === "forgot" && (
          <ForgotPasswordModal
            onClose={closeAuth}
            onBackToLogin={() => setAuthMode("login")}
          />
        )}
      </nav>
    </header>
  );
}
