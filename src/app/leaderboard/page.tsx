"use client";

import { useState, useEffect } from "react";

export default function LeaderboardPage() {
  const [rankings, setRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHallOfFame();
  }, []);

  const fetchHallOfFame = async () => {
    try {
      const res = await fetch("/api/leaderboard/hall-of-fame");
      const data = await res.json();
      if (res.ok) {
        setRankings(data);
      }
    } catch (err) {
      console.error("Gagal mengambil data hall of fame:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="inline-block bg-yellow-950 text-yellow-400 border border-yellow-800 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
          🏆 SGScommunity Hall of Fame
        </span>
        <h1 className="text-4xl font-black text-white">
          Papan Peringkat Anggota Geng
        </h1>
        <p className="text-gray-400 text-sm italic">
          "Statistik tidak pernah bohong, dihitung dari keaktifan ngopi dan
          nyumbang kata maut."
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="text-center py-16 text-xs text-gray-500 animate-pulse">
            Memuat data para penguasa warkop...
          </div>
        ) : rankings.length === 0 ? (
          <div className="text-center py-16 text-xs text-gray-500">
            Belum ada data anggota di database. Yuk ajak temen-temen login!
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {rankings.map((r, index) => {
              const rankNum = index + 1;
              return (
                <div
                  key={r.id || rankNum}
                  className="p-5 flex items-center justify-between gap-4 hover:bg-gray-850 transition"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                        rankNum === 1
                          ? "bg-yellow-500 text-black"
                          : rankNum === 2
                            ? "bg-gray-300 text-black"
                            : rankNum === 3
                              ? "bg-amber-700 text-white"
                              : "bg-gray-800 text-gray-400"
                      }`}
                    >
                      #{rankNum}
                    </span>
                    <div>
                      <h3 className="font-bold text-white text-base flex items-center gap-2">
                        {r.name} <span>{r.badge}</span>
                      </h3>
                      <p className="text-xs text-gray-400">{r.title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-indigo-400 bg-indigo-950 px-3 py-1.5 rounded-xl border border-indigo-900">
                      {r.scoreText}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
