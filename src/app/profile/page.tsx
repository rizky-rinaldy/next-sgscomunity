"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { playSound } from "@/utils/sound";

export default function ProfilePage() {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedPhone = localStorage.getItem("sgs_user_phone");

    if (!savedPhone) {
      alert("⚠️ Eitss, login dulu bro buat akses profil!");
      router.push("/login");
      return;
    }

    setPhone(savedPhone);

    // Ambil data dari localStorage (atau bisa disesuaikan ambil dari API database jika ada endpoint GET /api/profile)
    setName(localStorage.getItem("sgs_user_name") || "Anak Warkop");
    setBio(
      localStorage.getItem("sgs_user_bio") ||
        "Nongkrong santai, ngopi sampai pagi. ☕",
    );
    setImage(
      localStorage.getItem("sgs_user_image") ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    );
    setInstagram(localStorage.getItem("sgs_user_ig") || "");
    setTiktok(localStorage.getItem("sgs_user_tt") || "");
  }, [router]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("⚠️ Ukuran foto terlalu besar! Maksimal 2MB ya bro.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        playSound("click");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    playSound("success");

    try {
      // Kirim data ke API backend untuk disimpan ke Database Prisma
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          name,
          bio,
          image,
          instagram,
          tiktok,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan ke server");
      }

      // Simpan juga ke localStorage agar state lokal tetap sinkron
      localStorage.setItem("sgs_user_name", name);
      localStorage.setItem("sgs_user_bio", bio);
      localStorage.setItem("sgs_user_image", image);
      localStorage.setItem("sgs_user_ig", instagram);
      localStorage.setItem("sgs_user_tt", tiktok);

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menyimpan profil ke database.");
    }
  };

  const handleLogout = () => {
    playSound("easteregg");
    if (confirm("Yakin mau keluar dari sesi perangkat ini?")) {
      localStorage.clear();
      router.push("/login");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      {/* Header Halaman */}
      <div className="border-b border-gray-800 pb-6">
        <span className="bg-indigo-950 text-indigo-400 border border-indigo-800/60 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
          Dashboard Pengurus
        </span>
        <h1 className="text-3xl font-black text-white mt-2">
          Pengaturan Profil
        </h1>
        <p className="text-xs text-gray-400">
          Atur foto dan sosmedmu agar anak-anak warkop bisa kenal.
        </p>
      </div>

      {isSaved && (
        <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs px-4 py-3 rounded-2xl flex items-center gap-2 animate-bounce">
          <span>✅</span> Profil dan sosmed berhasil diperbarui ke database!
        </div>
      )}

      {/* Form Edit Profil */}
      <form
        onSubmit={handleSave}
        className="bg-gray-900 border border-gray-800 p-8 rounded-[2.5rem] shadow-xl space-y-6"
      >
        {/* Upload Foto Profil */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-24 h-24 rounded-3xl overflow-hidden border-2 border-emerald-500/50 shadow-lg shadow-emerald-950 flex-shrink-0 bg-gray-950">
            {image ? (
              <img
                src={image}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                No Photo
              </div>
            )}
          </div>
          <div className="space-y-2 text-center sm:text-left w-full">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Ganti Foto Profil (Dari Perangkat):
            </label>
            <label className="inline-block bg-gray-950 hover:bg-gray-800 border border-gray-800 text-white text-xs font-bold px-5 py-3 rounded-2xl cursor-pointer transition shadow-inner">
              📁 Pilih Berkas Foto...
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            <p className="text-[10px] text-gray-500">
              Maksimal ukuran file 2MB (Format JPG/PNG).
            </p>
          </div>
        </div>

        {/* Nama Tampilan & Nomor WA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Nama Panggilan / Alias
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Riyandi Warkop"
              className="w-full bg-gray-950 border border-gray-800 px-4 py-3 rounded-2xl text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Nomor WhatsApp (Akun Utama)
            </label>
            <input
              type="text"
              value={phone}
              disabled
              className="w-full bg-gray-950/50 border border-gray-800/60 px-4 py-3 rounded-2xl text-xs text-gray-500 cursor-not-allowed font-mono font-bold"
            />
          </div>
        </div>

        {/* Link Media Sosial */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-800/80">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>📸</span> Instagram Username / Link
            </label>
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="@username_ig"
              className="w-full bg-gray-950 border border-gray-800 px-4 py-3 rounded-2xl text-xs text-white focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>🎵</span> TikTok Username / Link
            </label>
            <input
              type="text"
              value={tiktok}
              onChange={(e) => setTiktok(e.target.value)}
              placeholder="@username_tiktok"
              className="w-full bg-gray-950 border border-gray-800 px-4 py-3 rounded-2xl text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Status / Bio */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Bio / Status Sambatan Singkat
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="Tulis status hidup atau moto nongkrongmu di sini..."
            className="w-full bg-gray-950 border border-gray-800 p-4 rounded-2xl text-xs text-white focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
          ></textarea>
        </div>

        {/* Tombol Simpan & Keluar */}
        <div className="space-y-3 pt-2">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs py-4 rounded-2xl transition shadow-xl shadow-emerald-950 flex items-center justify-center gap-2 transform active:scale-95"
          >
            💾 Simpan Perubahan Profil & Medsos
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-xs py-3.5 rounded-2xl transition text-center shadow-lg"
          >
            🚪 Keluar Perangkat (Logout)
          </button>
        </div>
      </form>
    </div>
  );
}
