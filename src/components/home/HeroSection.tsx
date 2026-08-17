"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { playSound } from "@/utils/sound";

export default function HeroSection() {
  const [beerCount, setBeerCount] = useState(0);

  // Ambil data dari API saat komponen dimuat (dengan pengaman JSON)
  useEffect(() => {
    fetch("/api/cheers")
      .then(async (res) => {
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const htmlText = await res.text();
          console.error("API GET mengembalikan HTML/Error:", htmlText);
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.success) setBeerCount(data.count);
      })
      .catch((err) => console.error("Gagal load cheers:", err));
  }, []);

  const handleCheers = async () => {
    playSound("success");
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });

    try {
      const res = await fetch("/api/cheers", { method: "POST" });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const htmlText = await res.text();
        console.error("API POST mengembalikan HTML/Error:", htmlText);
        alert("Gagal terhubung ke database warkop. Cek terminal!");
        return;
      }

      const data = await res.json();
      if (data.success) {
        setBeerCount(data.count);
      }
    } catch (error) {
      console.error("Network error:", error);
      setBeerCount((prev) => prev + 1); // Fallback lokal
    }
  };

  return (
    <div className="text-center space-y-6 max-w-2xl mx-auto">
      <div className="inline-flex items-center gap-2 bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
        ☕ ZONA SANTAI &bull; SGSCOMMUNITY PORTAL
      </div>
      <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-white">
        Nongkrong Elit, <br />
        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
          Dompet Menjerit.
        </span>
      </h1>
      <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
        Selamat datang di markas digital resmi{" "}
        <strong className="text-white">SGScommunity</strong>. Kumpulan para
        penguasa waktu dan master wacana paling solid.
      </p>

      <div className="pt-2">
        <button
          onClick={handleCheers}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-xl transition transform active:scale-95 flex items-center gap-2 mx-auto"
        >
          ☕ Virtual Cheers (Total Global: {beerCount}x)
        </button>
      </div>
    </div>
  );
}
