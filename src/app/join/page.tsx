"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { playSound } from "@/utils/sound";
import { authenticateUser } from "@/app/actions";

export default function JoinPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Penyedia wacana nongkrong abadi");
  const [commitment, setCommitment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, ""); // Hanya angka
    setPhone(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      playSound("easteregg");
      alert("⚠️ Nomor WhatsApp terlalu pendek, bro! Masukin yang bener.");
      return;
    }

    setLoading(true);
    playSound("click");

    // Daftarkan user baru langsung ke database PostgreSQL via Prisma
    const result = await authenticateUser({
      phone,
      name,
      bio: `Keahlian: ${role}. Komitmen: ${commitment}`,
    });

    setLoading(false);

    if (result.success) {
      playSound("success");
      setSubmitted(true);
    } else {
      playSound("easteregg");
      alert(`❌ Gagal mendaftar: ${result.error}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="inline-block bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
          📝 SGScommunity Recruitment
        </span>
        <h1 className="text-4xl font-black text-white">
          Formulir Pendaftaran Anggota Baru
        </h1>
        <p className="text-gray-400 text-sm italic">
          "Syarat utama: Kuat mental, tahan ejekan, dan siap sedia kalau diajak
          nongkrong."
        </p>
      </div>

      {submitted ? (
        <div className="bg-gradient-to-br from-emerald-950/80 to-gray-900 border-2 border-emerald-500 p-8 rounded-3xl text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl shadow-lg shadow-emerald-950">
            🎉
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white">
              Pendaftaran Berhasil, {name}!
            </h3>
            <p className="text-sm text-gray-300 max-w-md mx-auto">
              Nomor WhatsApp{" "}
              <span className="text-emerald-400 font-mono font-bold">
                +62 {phone}
              </span>{" "}
              sudah terdaftar di database warkop. Silakan login untuk masuk ke
              sesi Anda.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs py-4 rounded-2xl transition shadow-xl shadow-emerald-950"
            >
              🔑 Lanjut ke Halaman Login Markas ☕
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 border border-gray-800 p-8 rounded-3xl space-y-6 shadow-2xl"
        >
          {/* Nama Lengkap */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300 uppercase">
              Nama Lengkap / Nama Panggilan
            </label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Udin Ngabisin Es Teh"
              className="w-full bg-gray-950 border border-gray-800 p-3.5 rounded-2xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition font-bold"
            />
          </div>

          {/* Nomor WhatsApp */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300 uppercase">
              Nomor WhatsApp Aktif (Untuk Akun Utama)
            </label>
            <div className="flex items-center bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden focus-within:border-indigo-500 transition shadow-inner">
              <span className="bg-gray-900 px-4 py-3.5 text-xs font-bold text-gray-400 border-r border-gray-800">
                🇮🇩 +62
              </span>
              <input
                required
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="812xxxxxxxxx"
                className="w-full bg-transparent px-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none font-bold tracking-wider"
              />
            </div>
          </div>

          {/* Keahlian Utama */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300 uppercase">
              Keahlian Utama di Geng
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 p-3.5 rounded-2xl text-sm text-white focus:outline-none focus:border-indigo-500 transition"
            >
              <option>Tukang bayar makanan orang lain (Sponsor)</option>
              <option>Penyedia wacana nongkrong abadi</option>
              <option>Jago main game tapi sering nyampah</option>
              <option>Pengangguran profesional siaga 24/7</option>
            </select>
          </div>

          {/* Komitmen */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300 uppercase">
              Seberapa siap Anda menagih janji "kalo udah sukses jangan lupa
              temen"?
            </label>
            <textarea
              required
              rows={3}
              value={commitment}
              onChange={(e) => setCommitment(e.target.value)}
              placeholder="Tulis komitmen Anda di sini..."
              className="w-full bg-gray-950 border border-gray-800 p-3.5 rounded-2xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition resize-none leading-relaxed"
            />
          </div>

          <div className="space-y-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 hover:opacity-90 text-white font-black text-sm py-4 rounded-2xl shadow-xl transition transform active:scale-95 disabled:opacity-50"
            >
              {loading ? "Menyimpan Data..." : "🚀 Submit Pendaftaran Warkop"}
            </button>

            <div className="text-center">
              <span className="text-xs text-gray-400">
                Sudah punya akun / terdaftar?{" "}
              </span>
              <Link
                href="/login"
                className="text-xs font-bold text-indigo-400 hover:underline"
              >
                Masuk di sini &rarr;
              </Link>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
