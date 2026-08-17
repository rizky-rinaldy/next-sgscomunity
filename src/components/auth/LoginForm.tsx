"use client";

import { useState } from "react";
import { authenticateUser, checkUserLogin } from "@/actions/user"; // Sesuaikan path import server action kamu
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(false); // Mode daftar atau login biasa
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setLoading(true);
    try {
      if (isRegister) {
        // Proses Daftar / Upsert
        if (!name.trim()) {
          alert("Nama wajib diisi untuk pendaftaran baru!");
          setLoading(false);
          return;
        }
        const res = await authenticateUser({ phone, name });
        if (res.success && res.user) {
          // SIMPAN SESI KE LOCALSTORAGE
          localStorage.setItem("sgs_user", JSON.stringify(res.user));
          alert("Berhasil daftar & masuk warkop! ☕");
          router.push("/"); // Lempar ke halaman utama
          router.refresh();
        } else {
          alert(res.error);
        }
      } else {
        // Proses Cek Login Saja
        const res = await checkUserLogin(phone);
        if (res.success && res.user) {
          // SIMPAN SESI KE LOCALSTORAGE
          localStorage.setItem("sgs_user", JSON.stringify(res.user));
          alert(`Selamat datang kembali, ${res.user.name}! ☕`);
          router.push("/");
          router.refresh();
        } else {
          // Jika belum terdaftar, arahkan ke mode register
          alert(res.error);
          setIsRegister(true);
        }
      }
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl max-w-md mx-auto space-y-4 shadow-xl">
      <h3 className="text-white font-bold text-lg text-center">
        {isRegister ? "📝 Daftar Warga Warkop" : "🔑 Masuk Warkop SGS"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs text-gray-400 block mb-1">
            Nomor WhatsApp
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Contoh: 08123456789"
            className="w-full bg-gray-950 border border-gray-700 px-4 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            required
          />
        </div>

        {isRegister && (
          <div>
            <label className="text-xs text-gray-400 block mb-1">
              Nama Panggilan
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama kamu..."
              className="w-full bg-gray-950 border border-gray-700 px-4 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3 rounded-xl transition"
        >
          {loading ? "Memproses..." : isRegister ? "Daftar Sekarang" : "Masuk"}
        </button>
      </form>

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={() => setIsRegister(!isRegister)}
          className="text-[11px] text-indigo-400 hover:underline"
        >
          {isRegister
            ? "Sudah punya akun? Masuk di sini"
            : "Belum punya akun? Daftar warga baru"}
        </button>
      </div>
    </div>
  );
}
