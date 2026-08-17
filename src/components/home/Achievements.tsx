"use client";

import { useState, useEffect } from "react";

export default function Achievements() {
  const [daysJoined, setDaysJoined] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUserAchievement() {
      try {
        // Ambil data sesi user dari localStorage (menyesuaikan berbagai kunci login)
        const possibleKeys = [
          "sgs_user",
          "user",
          "currentUser",
          "logged_in_user",
        ];
        let userPhone = null;

        for (const key of possibleKeys) {
          const saved = localStorage.getItem(key);
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              if (parsed && parsed.phone) {
                userPhone = parsed.phone;
                break;
              }
            } catch (e) {
              // Jika format string biasa
            }
          }
        }

        if (!userPhone) {
          setLoading(false);
          return;
        }

        // Request ke API backend untuk menghitung umur akun
        const res = await fetch("/api/achievements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: userPhone }),
        });

        const data = await res.json();
        if (data.success) {
          setDaysJoined(data.daysJoined);
        }
      } catch (error) {
        console.error("Gagal sinkronisasi lencana:", error);
      } finally {
        setLoading(false);
      }
    }

    checkUserAchievement();
  }, []);

  // Kumpulan Lencana Elite Berbasis Masa Bergabung & Perjuangan Warkop
  const badges = [
    {
      title: "☕ Pendatang Baru",
      desc: "Baru bergabung, selamat datang di warkop!",
      unlocked: daysJoined >= 0, // Langsung dapat saat gabung
    },
    {
      title: "🔥 Sobat Warkop (1 Minggu)",
      desc: "Sudah seminggu setia nongkrong di sini.",
      unlocked: daysJoined >= 7,
    },
    {
      title: "🛡️ Warga Tetap (1 Bulan)",
      desc: "Satu bulan berlalu, kamu bagian dari sejarah warkop.",
      unlocked: daysJoined >= 30,
    },
    {
      title: "👑 Legenda Abadi (1 Tahun)",
      desc: "Setahun penuh! Kamu adalah saksi hidup kejayaan SGS.",
      unlocked: daysJoined >= 365,
    },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] bg-yellow-950 text-yellow-400 font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-yellow-800">
            🏆 SGS Achievement Badges
          </span>
          <h3 className="text-xl font-black text-white mt-1">
            Lencana Kehormatan Geng
          </h3>
        </div>
        {!loading && daysJoined > 0 && (
          <span className="text-[10px] bg-indigo-950 text-indigo-300 px-3 py-1 rounded-xl border border-indigo-800 font-bold">
            Ukur Umur: {daysJoined} Hari
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {badges.map((b, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border flex items-center gap-3 transition ${
              b.unlocked
                ? "bg-indigo-950/40 border-indigo-500/50 text-white shadow-lg shadow-indigo-950/20"
                : "bg-gray-950 border-gray-800/80 text-gray-500 opacity-60"
            }`}
          >
            <span className="text-2xl">{b.unlocked ? "🏅" : "🔒"}</span>
            <div>
              <h4 className="font-bold text-xs flex items-center gap-2">
                {b.title}
              </h4>
              <p className="text-[10px] text-gray-400 leading-relaxed mt-0.5">
                {b.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
