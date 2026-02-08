"use client";

import Link from "next/link";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, LogOut, User as UserIcon } from "lucide-react";
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

interface NavbarProps {
  user: {
    name: string;
    username: string;
    email: string;
    profileImg: string | null;
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // Mobile Menu only
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);

  const isLoggedIn = !!user;

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
        {/* BRAND LOGO */}
        <Link
          href={isLoggedIn ? "/home" : "/"}
          className="text-3xl md:text-4xl font-italianno text-[#1F4F46] z-60"
        >
          I Am Grateful For...
        </Link>

        {/* MOBILE HAMBURGER */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-[#1F4F46] z-60 hover:bg-black/5 rounded-full transition"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* --- DESKTOP VIEW --- */}
        <div className="hidden md:flex items-center gap-8">
          {isLoggedIn && user ? (
            <>
              {/* Links */}
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

              {/* SHADCN DROPDOWN & AVATAR */}
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
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
            // NOT LOGGED IN
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

        {/* --- MOBILE MENU--- */}
        <div
          className={`fixed inset-0 bg-[#E9EEE8] flex flex-col 
                      items-center justify-center transition-transform 
                      duration-500 ease-in-out z-50 md:hidden ${
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
                  {/* Manual Avatar for Mobile since Shadcn Avatar is small by default */}
                  <div
                    className="w-16 h-16 rounded-full bg-[#85BFBB] 
                                  flex items-center justify-center text-white 
                                  text-3xl font-serif font-bold shadow-sm mb-2"
                  >
                    {getInitials(user.name)}
                  </div>
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

        {/* MODALS */}
        {authMode === "login" && (
          <LoginModal
            onClose={closeAuth}
            onSwitch={() => setAuthMode("signup")}
          />
        )}
        {authMode === "signup" && (
          <SignupModal
            onCloseAction={closeAuth}
            onSwitchAction={() => setAuthMode("login")}
          />
        )}
      </nav>
    </header>
  );
}
