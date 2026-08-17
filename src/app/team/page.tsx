"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { playSound } from "@/utils/sound";

export default function TeamPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [easterEggClicks, setEasterEggClicks] = useState<{
    [key: string]: number;
  }>({});
  const [activeEasterEgg, setActiveEasterEgg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/team")
      .then(async (res) => {
        const text = await res.text();
        return text ? JSON.parse(text) : [];
      })
      .then((data) => {
        setMembers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal memuat data:", err);
        setMembers([]);
        setLoading(false);
      });
  }, []);

  const handleInlineEdit = async (id: string, field: string, value: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    );

    await fetch("/api/team", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, [field]: value }),
    });
  };

  // Fungsi untuk menangani upload file langsung ke folder public/uploads/
  const handleFileUpload = async (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        handleInlineEdit(id, "avatarUrl", data.url);
      } else {
        alert(data.error || "Gagal mengupload foto!");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Terjadi kesalahan saat mengunggah foto.");
    }
  };

  // Fungsi untuk Menambah Anggota Baru
  const handleAddMember = async () => {
    try {
      const res = await fetch("/api/team", { method: "POST" });
      const newMember = await res.json();

      if (newMember) {
        setMembers((prev) => [...prev, newMember]);
        playSound("success");
      }
    } catch (err) {
      console.error("Gagal menambah anggota:", err);
    }
  };

  // Fungsi untuk Menghapus Anggota
  const handleDeleteMember = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Yakin ingin menghapus/kick anggota ini dari database?"))
      return;

    try {
      const res = await fetch("/api/team", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== id));
        playSound("click");
      } else {
        alert("Gagal menghapus anggota.");
      }
    } catch (err) {
      console.error("Gagal menghapus anggota:", err);
    }
  };

  const handleBossClick = (member: any) => {
    if (isEditing) return;
    setSelectedMember(member);
    playSound("success");
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  const handleAvatarClick = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEditing) return;

    setEasterEggClicks((prev) => {
      const currentCount = (prev[name] || 0) + 1;
      if (currentCount >= 3) {
        playSound("easteregg");
        setActiveEasterEgg(
          `🚨 ALERT: ${name} terdeteksi membuka cheat kode rahasia SGScommunity! Jangan lupa traktirannya ya bro! ☕`,
        );
        return { ...prev, [name]: 0 };
      }
      playSound("click");
      return { ...prev, [name]: currentCount };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-white font-black text-xl animate-pulse">
        🎮 LOADING DATABASE SGSCOMMUNITY...
      </div>
    );
  }

  const bosses = members.slice(0, 2);
  const unknownTeam = members.slice(2, 4);
  const regularRoster = members.slice(4);

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-16 relative">
      {/* Notifikasi Easter Egg */}
      {activeEasterEgg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-extrabold px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border-2 border-white">
          <span className="text-sm">{activeEasterEgg}</span>
          <button
            onClick={() => setActiveEasterEgg(null)}
            className="bg-black text-white hover:bg-red-600 text-xs px-3 py-1.5 rounded-lg transition"
          >
            Tutup
          </button>
        </div>
      )}

      {/* SECTION 1: BOSS & WAKIL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {bosses.map((boss, idx) => (
          <div
            key={boss.id}
            onClick={() => handleBossClick(boss)}
            className={`group relative bg-gradient-to-b ${idx === 0 ? "from-indigo-950/80 border-indigo-500/50" : "from-pink-950/80 border-pink-500/50"} via-gray-900 to-gray-950 border-2 hover:border-yellow-400 p-8 rounded-3xl cursor-pointer transition-all duration-300 shadow-xl space-y-4`}
          >
            {/* Tombol Hapus (Hanya muncul saat mode edit aktif) */}
            {isEditing && (
              <button
                onClick={(e) => handleDeleteMember(boss.id, e)}
                className="absolute top-4 right-4 bg-red-600 hover:bg-red-500 text-white w-8 h-8 rounded-full font-black text-xs flex items-center justify-center border border-white shadow-lg transition z-20"
                title="Hapus Anggota"
              >
                ✕
              </button>
            )}

            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center gap-2">
                <img
                  src={
                    boss.avatarUrl ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"
                  }
                  alt={boss.name}
                  onClick={(e) => handleAvatarClick(boss.name, e)}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-yellow-400 shadow-lg flex-shrink-0"
                />

                {isEditing && (
                  <label className="bg-gray-800 hover:bg-gray-700 text-yellow-400 font-bold text-[9px] px-2.5 py-1 rounded border border-yellow-500 cursor-pointer transition text-center shadow-md">
                    📁 Ganti Foto
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(boss.id, e)}
                    />
                  </label>
                )}
              </div>

              <div className="w-full space-y-1">
                {isEditing ? (
                  <input
                    className="w-full bg-gray-800 text-[11px] font-bold text-pink-400 px-2 py-0.5 rounded border border-pink-500"
                    placeholder="Nickname..."
                    value={boss.nickname || ""}
                    onChange={(e) =>
                      handleInlineEdit(boss.id, "nickname", e.target.value)
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="text-xs font-bold text-pink-400 block">
                    {boss.nickname ? `(${boss.nickname})` : "Class: Commander"}
                  </span>
                )}

                {isEditing ? (
                  <input
                    className="w-full bg-gray-800 text-2xl font-black text-white px-2 py-1 rounded border border-yellow-500"
                    value={boss.name}
                    onChange={(e) =>
                      handleInlineEdit(boss.id, "name", e.target.value)
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <h2 className="text-3xl font-black text-white">
                    {boss.name}
                  </h2>
                )}

                {isEditing ? (
                  <input
                    className="w-full bg-gray-800 text-yellow-400 text-xs font-semibold px-2 py-1 rounded border border-yellow-500"
                    value={boss.role}
                    onChange={(e) =>
                      handleInlineEdit(boss.id, "role", e.target.value)
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <p className="text-yellow-400 text-xs font-semibold">
                    {boss.role}
                  </p>
                )}
              </div>
            </div>

            {isEditing ? (
              <textarea
                className="w-full bg-gray-800 text-gray-200 text-sm p-2 rounded border border-yellow-500 resize-none"
                rows={2}
                value={boss.bio || ""}
                onChange={(e) =>
                  handleInlineEdit(boss.id, "bio", e.target.value)
                }
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <p className="text-gray-300 text-sm line-clamp-2">{boss.bio}</p>
            )}
          </div>
        ))}
      </div>

      {/* SECTION 2: SPECIAL UNKNOWN DIVISION */}
      {unknownTeam.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-center tracking-wide text-white">
            🕵️ SPECIAL UNKNOWN DIVISION
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {unknownTeam.map((item) => (
              <div
                key={item.id}
                onClick={() => !isEditing && setSelectedMember(item)}
                className="group relative bg-gray-900/90 border border-gray-800 hover:border-yellow-400 p-6 rounded-3xl flex items-center gap-5 cursor-pointer transition-all shadow-xl"
              >
                {isEditing && (
                  <button
                    onClick={(e) => handleDeleteMember(item.id, e)}
                    className="absolute top-3 right-3 bg-red-600 hover:bg-red-500 text-white w-7 h-7 rounded-full font-black text-xs flex items-center justify-center border border-white shadow-lg transition z-20"
                    title="Hapus Anggota"
                  >
                    ✕
                  </button>
                )}

                <div className="flex flex-col items-center gap-2">
                  <img
                    src={item.avatarUrl}
                    alt={item.name}
                    onClick={(e) => handleAvatarClick(item.name, e)}
                    className="w-20 h-20 rounded-2xl object-cover border border-yellow-500/50 flex-shrink-0"
                  />
                  {isEditing && (
                    <label className="bg-gray-800 hover:bg-gray-700 text-yellow-400 font-bold text-[9px] px-2 py-0.5 rounded border border-yellow-500 cursor-pointer transition text-center shadow-md">
                      📁 Ganti Foto
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(item.id, e)}
                      />
                    </label>
                  )}
                </div>

                <div className="w-full space-y-1">
                  {isEditing ? (
                    <input
                      className="w-full bg-gray-800 text-[10px] text-pink-400 font-bold px-2 py-0.5 rounded border border-pink-500"
                      placeholder="Nickname..."
                      value={item.nickname || ""}
                      onChange={(e) =>
                        handleInlineEdit(item.id, "nickname", e.target.value)
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="text-[10px] bg-yellow-950 text-yellow-400 font-bold px-2.5 py-0.5 rounded-full border border-yellow-800 inline-block">
                      {item.nickname ? `(${item.nickname})` : "UNKNOWN AGENT"}
                    </span>
                  )}

                  {isEditing ? (
                    <input
                      className="w-full bg-gray-800 text-lg font-black text-white px-2 py-0.5 rounded border border-yellow-500"
                      value={item.name}
                      onChange={(e) =>
                        handleInlineEdit(item.id, "name", e.target.value)
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <h3 className="text-xl font-black text-white">
                      {item.name}
                    </h3>
                  )}

                  {isEditing ? (
                    <input
                      className="w-full bg-gray-800 text-yellow-400 text-xs px-2 py-0.5 rounded border border-yellow-500"
                      value={item.role}
                      onChange={(e) =>
                        handleInlineEdit(item.id, "role", e.target.value)
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <p className="text-yellow-400 text-xs font-semibold">
                      {item.role}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: PASUKAN INTI ROSTER */}
      <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-3xl space-y-6 backdrop-blur-md">
        <div className="text-center">
          <h2 className="text-2xl font-black text-white">
            🔥 PASUKAN INTI ROSTER
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {regularRoster.map((m, idx) => (
            <div
              key={m.id}
              onClick={() => !isEditing && setSelectedMember(m)}
              className="group relative bg-gray-900 border border-gray-800 hover:border-yellow-400 p-4 rounded-2xl text-center cursor-pointer transition-all flex flex-col items-center shadow-md"
            >
              {isEditing && (
                <button
                  onClick={(e) => handleDeleteMember(m.id, e)}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-500 text-white w-6 h-6 rounded-full font-black text-[10px] flex items-center justify-center border border-white shadow transition z-20"
                  title="Hapus"
                >
                  ✕
                </button>
              )}

              <img
                src={m.avatarUrl}
                alt={m.name}
                onClick={(e) => handleAvatarClick(m.name, e)}
                className="w-16 h-16 rounded-full object-cover border border-gray-700 transition mb-2 shadow-md"
              />

              {isEditing && (
                <label className="w-full bg-gray-800 hover:bg-gray-700 text-yellow-400 font-bold text-[9px] py-0.5 px-1 rounded border border-yellow-500 cursor-pointer transition text-center mb-2 block">
                  📁 Ganti Foto
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(m.id, e)}
                  />
                </label>
              )}

              <span className="text-[10px] bg-gray-800 text-gray-300 font-bold px-2 py-0.5 rounded-full mb-1">
                #{idx + 1}
              </span>

              {isEditing ? (
                <input
                  className="w-full bg-gray-800 text-[10px] text-pink-400 text-center p-0.5 rounded border border-pink-500 mb-1"
                  placeholder="Nickname"
                  value={m.nickname || ""}
                  onChange={(e) =>
                    handleInlineEdit(m.id, "nickname", e.target.value)
                  }
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                m.nickname && (
                  <span className="text-[10px] text-pink-400 block mb-1">
                    ({m.nickname})
                  </span>
                )
              )}

              {isEditing ? (
                <input
                  className="w-full bg-gray-800 text-xs font-bold text-white text-center p-1 rounded border border-yellow-500 mb-1"
                  value={m.name}
                  onChange={(e) =>
                    handleInlineEdit(m.id, "name", e.target.value)
                  }
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <h3 className="font-bold text-sm text-white">{m.name}</h3>
              )}

              {isEditing ? (
                <input
                  className="w-full bg-gray-800 text-[10px] text-indigo-300 text-center p-1 rounded border border-yellow-500 mt-auto"
                  value={m.role}
                  onChange={(e) =>
                    handleInlineEdit(m.id, "role", e.target.value)
                  }
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className="text-[10px] text-indigo-400 font-medium mt-auto">
                  {m.role}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FLOATING ACTION BUTTONS DI BAWAH */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end">
        {/* Tombol Tambah Anggota (Muncul hanya saat Mode Edit aktif) */}
        {isEditing && (
          <button
            onClick={handleAddMember}
            className="bg-green-600 hover:bg-green-500 text-white font-black text-xs px-5 py-3 rounded-2xl shadow-2xl transition-all border-2 border-green-400 flex items-center gap-2"
          >
            <span>➕</span> TAMBAH ANGGOTA
          </button>
        )}

        {/* Tombol Toggle Mode Edit */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all duration-300 flex items-center gap-2 border-2 ${
            isEditing
              ? "bg-red-600 border-white text-white animate-pulse"
              : "bg-gray-900 border-gray-700 text-white hover:bg-gray-800 hover:border-indigo-500"
          }`}
        >
          {isEditing ? "💾 SELESAI / SIMPAN" : "✏️ EDIT MODE"}
        </button>
      </div>
    </div>
  );
}
