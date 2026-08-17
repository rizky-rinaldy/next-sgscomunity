"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { playSound } from "@/utils/sound";

export default function MantraCard() {
  const [secretClicks, setSecretClicks] = useState(0);
  const router = useRouter();

  const handleSecretAdminTrigger = () => {
    const nextClicks = secretClicks + 1;
    setSecretClicks(nextClicks);
    playSound("click");

    if (nextClicks >= 5) {
      playSound("easteregg");
      alert("🔓 Access Granted: Membuka Pintu Rahasia Markas Petinggi...");
      router.push("/admin");
    }
  };

  return (
    <div
      onClick={handleSecretAdminTrigger}
      className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/30 p-8 sm:p-12 rounded-3xl space-y-3 text-center shadow-inner cursor-pointer select-none group"
      title="Klik 5x jika kamu bernyali..."
    >
      <span className="text-[10px] text-gray-500 uppercase tracking-widest group-hover:text-indigo-400 transition">
        {secretClicks > 0
          ? `🔥 [${secretClicks}/5] Menuju Pintu Rahasia...`
          : "🔒 Zona Rahasia Petinggi"}
      </span>
      <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest">
        Mantra Wajib Anggota SGScommunity 🤝
      </h3>
      <p className="text-lg sm:text-2xl font-black text-white tracking-wide">
        "Kalo udah sukses jangan lupa sama temen ya bro, minimal inget tampang
        kita!"
      </p>
    </div>
  );
}
