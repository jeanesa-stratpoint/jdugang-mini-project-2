"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Auth state
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null); // Modal state

  const navLinks = [
    { label: "Home", href: "/home" },
    { label: "Gratitude Journal", href: "/journal" },
    { label: "Gratitude Wall", href: "/wall" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeAuth = () => setAuthMode(null);

  // Helper to open modal and close mobile menu at the same time
  const openAuth = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setIsOpen(false);
  };

  return (
    <header className="w-full bg-[#E9EEE8] border-b border-black/5 sticky top-0 z-50">
      <nav className="max-w-350 mx-auto flex items-center justify-between px-6 md:px-10 py-4">
        {/* BRAND LOGO */}
        <Link
          href="/"
          className="text-3xl md:text-4xl font-italianno text-[#1F4F46] z-60"
        >
          I Am Grateful For...
        </Link>

        {/* MOBILE HAMBURGER BUTTON */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 text-[#1F4F46] z-60 hover:bg-black/5 rounded-full transition"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* --- DESKTOP VIEW --- */}
        <div className="hidden md:flex items-center gap-8">
          {isLoggedIn ? (
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
              <button
                className="w-10 h-10 rounded-full border-2 
                                border-[#85BFBB] bg-white hover:opacity-80 
                                transition shadow-sm"
              />
            </>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={() => setAuthMode("login")}
                className="bg-[#1F4F46] text-white px-7 py-2 
                            rounded-md font-medium hover:bg-[#163a34] 
                            transition shadow-sm"
              >
                Login
              </button>
              <button
                onClick={() => setAuthMode("signup")}
                className="border border-[#1F4F46] text-[#1F4F46] 
                          px-7 py-2 rounded-md font-medium hover:bg-white/50 transition"
              >
                Sign up
              </button>
            </div>
          )}
        </div>

        {/* --- MOBILE OVERLAY MENU --- */}
        <div
          className={`
          fixed inset-0 bg-[#E9EEE8] flex flex-col items-center 
          justify-center transition-transform duration-500 ease-in-out z-50 md:hidden
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
        >
          <div className="flex flex-col items-center gap-10 w-full px-10">
            {isLoggedIn ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-3xl font-serif tracking-tight 
                              ${pathname === link.href ? "text-[#85BFBB]" : "text-[#1F4F46]"}`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div
                  className="w-20 h-20 rounded-full border-4 
                                border-[#85BFBB] bg-white shadow-lg"
                />
              </>
            ) : (
              <div className="flex flex-col items-center gap-6 w-full">
                <button
                  onClick={() => openAuth("login")}
                  className="bg-[#1F4F46] text-white w-full max-w-sm py-5 
                              rounded-xl text-2xl font-semibold shadow-md"
                >
                  Login
                </button>
                <button
                  onClick={() => openAuth("signup")}
                  className="border-2 border-[#1F4F46] text-[#1F4F46] 
                              w-full max-w-sm py-5 rounded-xl text-2xl font-semibold"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
        </div>
        {/* --- MODALS --- */}
        {authMode === "login" && (
          <LoginModal
            onClose={closeAuth}
            onSwitch={() => setAuthMode("signup")}
          />
        )}
        {authMode === "signup" && (
          <SignupModal
            onClose={closeAuth}
            onSwitch={() => setAuthMode("login")}
          />
        )}
      </nav>
    </header>
  );
}
