"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { playSound } from "@/utils/sound";
import { checkUserLogin } from "@/app/actions"; // Diimpor dari actions.ts, bukan didefinisikan di sini

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [secretCode, setSecretCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Format nomor HP agar otomatis rapi
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, ""); // Hanya ambil angka

    // Jika user iseng mengetik '0' di awal (misal: 0812...), buang angka '0' pertamanya
    if (val.startsWith("0")) {
      val = val.substring(1);
    }

    setPhone(val);
  };

  const handleSendPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      playSound("easteregg");
      alert("⚠️ Nomor WhatsApp terlalu pendek, bro! Cek lagi.");
      return;
    }

    playSound("click");
    setLoading(true);

    // Cek ke database apakah nomor ini sudah terdaftar
    const result = await checkUserLogin(phone);
    setLoading(false);

    if (!result.success) {
      playSound("easteregg");
      if (
        confirm(
          `${result.error}\n\nMau diarahkan ke halaman pendaftaran sekarang?`,
        )
      ) {
        router.push("/join");
      }
      return;
    }

    // Jika terdaftar, lanjut ke step 2 (Masukkan Kode Rahasia Geng)
    playSound("success");
    setStep(2);
  };

  const handleVerifySecretCode = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi kode rahasia geng (misal: "warkopgeng" atau sesuaikan kodenya)
    const validSecretCode = "$lebew";

    if (secretCode.trim().toLowerCase() === validSecretCode) {
      setLoading(true);
      // Ambil data terbaru dari database berdasarkan nomor HP
      const result = await checkUserLogin(phone);
      setLoading(false);

      if (result.success && result.user) {
        playSound("success");
        // Simpan sesi ke localStorage untuk identitas UI instan
        localStorage.setItem("sgs_user_phone", result.user.phone);
        localStorage.setItem("sgs_user_name", result.user.name);
        localStorage.setItem("sgs_user_image", result.user.image || "");
        localStorage.setItem("sgs_user_bio", result.user.bio || "");
        localStorage.setItem("sgs_user_created_at", result.user.createdAt);

        alert(
          `☕ Verifikasi Berhasil! Selamat datang kembali di markas, ${result.user.name}.`,
        );
        router.push("/feed");
      } else {
        playSound("easteregg");
        alert("❌ Data user tidak ditemukan di database!");
      }
    } else {
      playSound("easteregg");
      alert("❌ Kode rahasia geng salah, Bro! Coba ingat-ingat lagi.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-gray-900/90 backdrop-blur-xl border border-gray-800 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        {/* Hiasan Cahaya Belakang (Glow Effect) */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6 text-center">
          {/* Header Ikon */}
          <div className="w-16 h-16 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-emerald-900/30 text-3xl transform hover:scale-105 transition">
            🔑
          </div>

          <div className="space-y-2">
            <span className="inline-block bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-widest">
              SGSCOMMUNITY DATABASE AUTH
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {step === 1 ? "Masuk via WhatsApp" : "Kode Rahasia Geng"}
            </h1>
            <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
              {step === 1
                ? "Masukkan nomor WhatsApp terdaftar untuk mengakses profil & feed warkop."
                : `Masukkan kode rahasia geng untuk verifikasi nomor +62 ${phone}`}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSendPhone} className="space-y-5 text-left">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                  Nomor WhatsApp Terdaftar
                </label>
                <div className="flex items-center bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden focus-within:border-emerald-500 transition shadow-inner">
                  <span className="bg-gray-900 px-4 py-3.5 text-xs font-bold text-gray-400 border-r border-gray-800">
                    🇮🇩 +62
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="812xxxxxxxxx"
                    className="w-full bg-transparent px-4 py-3.5 text-xs text-white placeholder-gray-600 focus:outline-none font-bold tracking-wider"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs py-4 rounded-2xl transition shadow-xl shadow-emerald-950 flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <span className="animate-pulse">
                    Memeriksa Database Warkop...
                  </span>
                ) : (
                  <>Lanjut ke Kode Geng 🚀</>
                )}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-gray-400">
                  Belum pernah daftar?{" "}
                </span>
                <Link
                  href="/join"
                  className="text-xs font-bold text-emerald-400 hover:underline"
                >
                  Daftar Anggota Baru &rarr;
                </Link>
              </div>
            </form>
          ) : (
            <form
              onSubmit={handleVerifySecretCode}
              className="space-y-6 text-left"
            >
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                  Masukkan Kode Rahasia Geng
                </label>
                <input
                  type="password"
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value)}
                  placeholder="Ketik kode rahasia..."
                  className="w-full bg-gray-950 border border-gray-800 focus:border-indigo-500 px-4 py-3.5 text-xs text-white placeholder-gray-600 rounded-2xl outline-none shadow-inner transition font-bold"
                  required
                />
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs py-4 rounded-2xl transition shadow-xl shadow-indigo-950 transform active:scale-95 disabled:opacity-50"
                >
                  {loading ? "Memuat Data..." : "Verifikasi & Masuk Markas ☕"}
                </button>

                <div className="flex items-center justify-between text-[11px] pt-1 px-1">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-gray-400 hover:text-white transition"
                  >
                    &larr; Ganti Nomor
                  </button>
                  <span className="text-gray-500 italic">
                    (Hint: <strong className="text-indigo-400">jargon$</strong>)
                  </span>
                </div>
              </div>
            </form>
          )}

          <div className="pt-4 border-t border-gray-800/80 text-[10px] text-gray-500">
            Aman & terhubung langsung ke database PostgreSQL.
          </div>
        </div>
      </div>
    </div>
  );
}
