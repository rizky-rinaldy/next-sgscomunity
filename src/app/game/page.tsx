"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { playSound } from "@/utils/sound";

export default function GamePage() {
  const [coffeeCount, setCoffeeCount] = useState(0);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loadingLB, setLoadingLB] = useState(true);

  // Story / Scenario State
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [storyResult, setStoryResult] = useState("");

  // Ambil data leaderboard saat halaman dibuka
  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/game/coffee");
      const data = await res.json();
      if (res.ok) {
        setLeaderboard(data);
      }
    } catch (err) {
      console.error("Gagal memuat leaderboard:", err);
    } finally {
      setLoadingLB(false);
    }
  };

  const handleDrinkCoffee = async () => {
    const newCount = coffeeCount + 1;
    setCoffeeCount(newCount);
    playSound("click");

    if (newCount % 10 === 0) {
      playSound("success");
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });

      // Simpan otomatis ke database setiap kelipatan 10 tegukan jika sudah login
      const phone = localStorage.getItem("sgs_user_phone");
      if (phone) {
        try {
          await fetch("/api/game/coffee", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone, score: newCount }),
          });
          fetchLeaderboard(); // Refresh leaderboard
        } catch (err) {
          console.error("Gagal sinkronisasi skor:", err);
        }
      }
    }
  };

  const saveFinalScore = async () => {
    const phone = localStorage.getItem("sgs_user_phone");
    if (!phone) {
      alert(
        "⚠️ Login dulu menggunakan nomor HP kamu di pojok/menu utama kalau mau masuk papan peringkat global warkop!",
      );
      return;
    }

    try {
      const res = await fetch("/api/game/coffee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, score: coffeeCount }),
      });

      const data = await res.json();

      if (res.ok) {
        playSound("success");
        alert(
          "🏆 Berhasil! Skor tegukan kopi kamu sudah diamankan di database warkop.",
        );
        fetchLeaderboard();
      } else {
        // Menampilkan pesan error spesifik dari backend (misal: user tidak ditemukan)
        alert(
          `❌ Gagal menyimpan skor: ${data.error || "Terjadi kesalahan pada server"}`,
        );
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("❌ Terjadi kesalahan jaringan saat menghubungi server warkop.");
    }
  };

  // Skenario absurd warkop
  const scenarios = [
    {
      id: 1,
      question:
        "Dompet sisa Rp5.000, tapi tiba-tiba ada ajakan mabar dadakan di warkop. Apa pilihanmu?",
      options: [
        {
          text: "Datang modal numpang Wi-Fi & minta es teh sisa temen.",
          result:
            "🏆 ENDING: Survival King! Berhasil numpang hidup tanpa keluar sepeser pun.",
        },
        {
          text: "Menolak halus karena malu dompet tipis.",
          result: "💀 ENDING: Nolep Abadi. Nyesel di rumah ketinggalan gosip.",
        },
        {
          text: "Gadai HP demi bayar traktir gelandangan warkop.",
          result:
            "🔥 ENDING: Sultan Dadakan, Besoknya langsung bangkrut total!",
        },
      ],
    },
    {
      id: 2,
      question:
        "Udah pesen Indomie rebus pake telur, eh pas mau dibayar abang warkop bilang 'Lagi kosong'. Tindakanmu?",
      options: [
        {
          text: "Ganti jadi Indomie goreng double tanpa penyesalan.",
          result:
            "👑 ENDING: Kaum Karbohidrat Sejati. Perut kenyang, hati tenang.",
        },
        {
          text: "Ngambek, lalu pulang sambil banting pintu warkop.",
          result:
            "🌪️ ENDING: Ngambek Gaming. Diblacklist dari pergaulan warkop.",
        },
        {
          text: "Numpang ngutang ke temen sebelah.",
          result:
            "🤝 ENDING: Parasit Profesional. Berhasil bertahan hidup berkat mental patungan.",
        },
      ],
    },
  ];

  const handleChoice = (resultText: string) => {
    playSound("success");
    setStoryResult(resultText);
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
  };

  const nextScenario = () => {
    playSound("click");
    setStoryResult("");
    setScenarioIndex((prev) => (prev + 1) % scenarios.length);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="inline-block bg-pink-950 text-pink-400 border border-pink-800 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
          🎮 SGScommunity Arcade & Leaderboard
        </span>
        <h1 className="text-4xl font-black text-white">
          Warkop Simulator & Papan Peringkat
        </h1>
        <p className="text-gray-400 text-sm italic">
          "Siapa raja kopi warkop sejati? Buktikan di sini!"
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* MINI GAME: CLICKER KOPI */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl text-center space-y-6 shadow-2xl flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-xl font-black text-white">
              ☕ Clicker Challenge
            </h3>
            <p className="text-xs text-gray-400">
              Klik cangkir kopinya sebanyak mungkin!
            </p>
          </div>

          <div className="py-2">
            <button
              onClick={handleDrinkCoffee}
              className="text-6xl bg-gray-950 hover:bg-gray-800 border-2 border-indigo-500/50 w-32 h-32 rounded-3xl shadow-2xl transition transform active:scale-90 mx-auto flex items-center justify-center select-none"
            >
              ☕
            </button>
          </div>

          <div className="space-y-4">
            <div className="text-lg font-black text-yellow-400">
              Tegukan Sesi Ini: {coffeeCount} Kopi ☕
            </div>
            <button
              onClick={saveFinalScore}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white font-black text-xs py-3.5 rounded-2xl transition shadow-lg active:scale-95"
            >
              💾 Simpan Skor ke Leaderboard Global
            </button>
          </div>
        </div>

        {/* LEADERBOARD PANEL */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl space-y-4 shadow-2xl">
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            🏆 <span>Top 10 Raja Kopi Warkop</span>
          </h3>
          <p className="text-xs text-gray-400">
            Member dengan tegukan kopi terbanyak.
          </p>

          {loadingLB ? (
            <div className="text-center py-10 text-xs text-gray-500 animate-pulse">
              Memuat papan peringkat...
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-10 text-xs text-gray-500">
              Belum ada data di leaderboard. Jadilah yang pertama!
            </div>
          ) : (
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {leaderboard.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-gray-950 border border-gray-800 px-4 py-3 rounded-2xl text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-black w-6 text-center ${index === 0 ? "text-yellow-400 text-sm" : index === 1 ? "text-gray-300" : index === 2 ? "text-amber-600" : "text-gray-500"}`}
                    >
                      #{index + 1}
                    </span>
                    <span className="font-bold text-white">
                      {item.user?.name || "Anonim"}
                    </span>
                  </div>
                  <span className="font-black text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-full">
                    {item.score} Kopi
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MINI GAME: SKENARIO ABSURD */}
      <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl space-y-6 shadow-2xl">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black text-white">
            🧠 Skenario Hidup Warkop
          </h3>
          <span className="text-[10px] bg-indigo-950 text-indigo-400 font-bold px-3 py-1 rounded-full">
            Skenario {scenarioIndex + 1} dari {scenarios.length}
          </span>
        </div>

        {storyResult ? (
          <div className="space-y-6 text-center animate-in fade-in">
            <div className="bg-indigo-950/80 border border-indigo-500/50 p-6 rounded-2xl text-white font-bold text-base shadow-inner">
              {storyResult}
            </div>
            <button
              onClick={nextScenario}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white font-black text-xs px-8 py-4 rounded-2xl transition shadow-lg active:scale-95"
            >
              🎲 Coba Skenario Absurd Lainnya
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in">
            <p className="text-base font-bold text-gray-200 leading-relaxed">
              {scenarios[scenarioIndex].question}
            </p>
            <div className="grid grid-cols-1 gap-3">
              {scenarios[scenarioIndex].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(opt.result)}
                  className="bg-gray-950 hover:bg-indigo-950 border border-gray-800 hover:border-indigo-500 text-left p-4 rounded-2xl text-xs sm:text-sm font-semibold text-gray-300 hover:text-white transition shadow-md active:scale-[0.99]"
                >
                  👉 {opt.text}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
