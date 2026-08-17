"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeSelector from "@/components/ThemeSelector";

export default function Navbar() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [userImage, setUserImage] = useState<string>("");

  useEffect(() => {
    setIsMounted(true);
    // Cek status sesi login dari localStorage setiap kali navbar dimuat atau pindah halaman
    const phone = localStorage.getItem("sgs_user_phone");
    const name = localStorage.getItem("sgs_user_name") || "Warga";
    const image = localStorage.getItem("sgs_user_image") || "";

    setUserPhone(phone);
    setUserName(name);
    setUserImage(image);
  }, [pathname]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Daftar link navigasi utama (tanpa menu Join karena dipisah khusus di ujung)
  const links = [
    { name: "Home", href: "/" },
    { name: "Team", href: "/team" },
    { name: "Feed", href: "/feed" },
    { name: "Gallery", href: "/gallery" },
    { name: "Quotes", href: "/quotes" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Game", href: "/game" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="font-black text-base sm:text-lg bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent"
          >
            🚀 SGScommunity
          </Link>
          <div className="hidden sm:block">
            <ThemeSelector />
          </div>
        </div>

        {/* Menu Navigasi Tengah & Tombol Khusus di Kanan */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-gray-900/60 p-1.5 rounded-2xl border border-gray-800/80">
            {links.map((l) => {
              const isActive = isMounted && pathname === l.href;
              return (
                <Link
                  key={l.name}
                  href={l.href}
                  className={`text-xs font-bold px-3 py-2 rounded-xl transition ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  {l.name}
                </Link>
              );
            })}
          </div>

          {/* Tombol Join / Profil Minimalis di Desktop */}
          {isMounted && (
            <div>
              {userPhone ? (
                <Link
                  href="/profile"
                  className="flex items-center gap-2.5 bg-gray-900 hover:bg-gray-800 border border-gray-700/80 hover:border-emerald-500/60 p-1.5 pr-4 rounded-2xl transition shadow-lg group"
                >
                  <div className="w-8 h-8 rounded-xl overflow-hidden bg-gray-950 border border-gray-700 flex-shrink-0">
                    {userImage ? (
                      <img
                        src={userImage}
                        alt="Profile"
                        className="w-full h-full object-cover group-hover:scale-110 transition"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-white font-bold">
                        ☕
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-gray-400 leading-none">
                      Masuk sebagai
                    </p>
                    <p className="text-xs font-black text-white truncate max-w-[100px]">
                      {userName}
                    </p>
                  </div>
                </Link>
              ) : (
                <Link
                  href="/join"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs px-5 py-3 rounded-2xl shadow-lg shadow-emerald-950 transition transform active:scale-95 flex items-center gap-1.5"
                >
                  <span>☕</span> Gabung Warkop
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Tombol Hamburger Mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-300 hover:text-white bg-gray-900 hover:bg-gray-800 p-2.5 rounded-xl border border-gray-800 transition focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isOpen ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Menu Dropdown Mobile */}
      {isOpen && (
        <div className="md:hidden bg-gray-900/95 border-b border-gray-800 px-4 py-4 space-y-3 backdrop-blur-xl">
          <div className="flex justify-between items-center sm:hidden pb-2 border-b border-gray-800">
            <span className="text-xs font-bold text-gray-400">Pilih Tema:</span>
            <ThemeSelector />
          </div>

          {/* Widget Profil / Tombol Join di Mobile Menu */}
          {isMounted && (
            <div className="pb-2 border-b border-gray-800">
              {userPhone ? (
                <Link
                  href="/profile"
                  className="flex items-center gap-3 bg-gray-950 border border-gray-800 p-3 rounded-2xl"
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-900 border border-gray-700 flex-shrink-0">
                    {userImage ? (
                      <img
                        src={userImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-white">
                        ☕
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">
                      Akun Warkop Anda
                    </p>
                    <p className="text-xs font-black text-white">{userName}</p>
                  </div>
                </Link>
              ) : (
                <Link
                  href="/join"
                  className="block text-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs py-3 rounded-2xl shadow-lg"
                >
                  ☕ Gabung Warkop Sekarang
                </Link>
              )}
            </div>
          )}

          {links.map((l) => {
            const isActive = isMounted && pathname === l.href;
            return (
              <Link
                key={l.name}
                href={l.href}
                className={`block text-xs font-bold px-4 py-3 rounded-xl transition ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {l.name}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
