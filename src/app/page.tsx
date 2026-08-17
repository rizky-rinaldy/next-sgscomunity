"use client";

import Link from "next/link";
import HeroSection from "@/components/home/HeroSection";
import RadioRoom from "@/components/home/RadioRoom";
import LiveChat from "@/components/home/LiveChat";
import Achievements from "@/components/home/Achievements";
import MantraCard from "@/components/home/MantraCard";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:py-20 space-y-12">
      {/* Hero Section dengan API Cheers */}
      <HeroSection />

      {/* Radio Room */}
      <RadioRoom />

      {/* Grid Live Chat & Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LiveChat />
        <Achievements />
      </div>

      {/* Menu Navigasi Skenario / Tim */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
        <Link
          href="/team"
          className="group bg-gray-900 border border-gray-800 hover:border-indigo-500 p-6 rounded-3xl space-y-3 transition shadow-lg block"
        >
          <span className="text-2xl">👑</span>
          <h3 className="font-bold text-white text-lg group-hover:text-indigo-400 transition">
            Struktur Petinggi
          </h3>
          <p className="text-xs text-gray-400">
            Kenalan sama Boss Riyandi dan pasukan inti lainnya ala game RPG.
          </p>
        </Link>

        <Link
          href="/feed"
          className="group bg-gray-900 border border-gray-800 hover:border-indigo-500 p-6 rounded-3xl space-y-3 transition shadow-lg block"
        >
          <span className="text-2xl">💬</span>
          <h3 className="font-bold text-white text-lg group-hover:text-indigo-400 transition">
            Ruang Sambatan & Feed
          </h3>
          <p className="text-xs text-gray-400">
            Tempat nge-post unek-unek harian dan info mabar.
          </p>
        </Link>

        <Link
          href="/game"
          className="group bg-gray-900 border border-gray-800 hover:border-indigo-500 p-6 rounded-3xl space-y-3 transition shadow-lg block"
        >
          <span className="text-2xl">🎮</span>
          <h3 className="font-bold text-white text-lg group-hover:text-indigo-400 transition">
            Arcade & Skenario
          </h3>
          <p className="text-xs text-gray-400">
            Mainkan clicker kopi dan skenario pilihan hidup warkop.
          </p>
        </Link>
      </div>

      {/* Mantra Wajib & Easter Egg Admin */}
      <MantraCard />
    </div>
  );
}
