"use client";

import { useState, useEffect } from "react";
import { playSound } from "@/utils/sound";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");

  const [adminData, setAdminData] = useState({
    stats: { users: 0, quotes: 0, coffeeScores: 0 },
    users: [],
    quotes: [],
    maintenance: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const authStatus = sessionStorage.getItem("sgs_admin_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
      fetchAdminData();
    }
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/data");
      const data = await res.json();
      if (res.ok) {
        setAdminData(data);
      }
    } catch (err) {
      console.error("Gagal memuat data admin:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "$lebew") {
      playSound("success");
      setIsAuthenticated(true);
      sessionStorage.setItem("sgs_admin_auth", "true");
      setErrorMsg("");
      fetchAdminData();
    } else {
      playSound("easteregg");
      setErrorMsg("❌ Sandi salah! Lu bukan petinggi SGScommunity ya?");
    }
  };

  const handleLogout = () => {
    playSound("click");
    setIsAuthenticated(false);
    sessionStorage.removeItem("sgs_admin_auth");
    setPassword("");
  };

  const handleDelete = async (
    target: "user" | "quote",
    identifier: string,
    name: string,
  ) => {
    if (!confirm(`Yakin ingin menghapus ${name}?`)) return;

    try {
      const res = await fetch("/api/admin/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", target, identifier }),
      });

      if (res.ok) {
        playSound("success");
        alert("Berhasil dihapus!");
        fetchAdminData();
      } else {
        alert("Gagal menghapus data.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleMaintenance = async () => {
    const newStatus = !adminData.maintenance;
    try {
      const res = await fetch("/api/admin/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle_maintenance",
          identifier: newStatus,
        }),
      });

      if (res.ok) {
        playSound("success");
        setAdminData((prev) => ({ ...prev, maintenance: newStatus }));
        alert(
          `Maintenance mode sekarang: ${newStatus ? "AKTIF (Tutup)" : "MATI (Buka)"}`,
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadBackup = async () => {
    try {
      playSound("click");
      const res = await fetch("/api/admin/backup");
      const data = await res.json();
      if (!res.ok) return alert("Gagal backup.");

      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(data, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute(
        "download",
        `sgs_backup_${new Date().toISOString().split("T")[0]}.json`,
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      playSound("success");
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-24">
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl space-y-6 shadow-2xl text-center">
          <span className="text-3xl">🔒</span>
          <div>
            <h1 className="text-2xl font-black text-white">
              Super Admin Portal
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Masukkan sandi rahasia pimpinan SGScommunity.
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan sandi rahasia..."
              className="w-full bg-gray-950 border border-gray-800 px-4 py-3 rounded-2xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 text-center font-bold"
              required
            />
            {errorMsg && (
              <p className="text-xs text-red-400 font-semibold">{errorMsg}</p>
            )}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs py-3 rounded-2xl transition shadow-lg"
            >
              Masuk Markas Admin 🚀
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-xl">
        <div>
          <span className="text-[10px] bg-red-950 text-red-400 font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-red-800">
            ⚡ SUPREME ADMIN DASHBOARD
          </span>
          <h1 className="text-2xl font-black text-white mt-1">
            Kontrol Utama SGScommunity
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchAdminData}
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold px-4 py-2.5 rounded-xl transition"
          >
            🔄 {loading ? "Memuat..." : "Refresh Data"}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-600/50 font-bold text-xs px-5 py-2.5 rounded-xl transition"
          >
            Keluar Admin 🚪
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["dashboard", "users", "quotes", "settings"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              playSound("click");
            }}
            className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase transition ${
              activeTab === tab
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-gray-900 text-gray-400 hover:bg-gray-800 border border-gray-800"
            }`}
          >
            {tab === "dashboard" && "📊 Dashboard"}
            {tab === "users" && `👥 Kelola Anggota (${adminData.users.length})`}
            {tab === "quotes" &&
              `✍️ Kelola Quotes (${adminData.quotes.length})`}
            {tab === "settings" && "⚙️ Pengaturan & Backup"}
          </button>
        ))}
      </div>

      {/* Tab: Dashboard */}
      {activeTab === "dashboard" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl space-y-2 shadow-xl">
            <span className="text-xs text-gray-400 uppercase font-bold">
              Total Anggota
            </span>
            <h3 className="text-3xl font-black text-white">
              {adminData.stats.users} Orang
            </h3>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl space-y-2 shadow-xl">
            <span className="text-xs text-gray-400 uppercase font-bold">
              Kata-Kata Maut (Quotes)
            </span>
            <h3 className="text-3xl font-black text-indigo-400">
              {adminData.stats.quotes} Quotes
            </h3>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl space-y-2 shadow-xl">
            <span className="text-xs text-gray-400 uppercase font-bold">
              Pemain Leaderboard Kopi
            </span>
            <h3 className="text-3xl font-black text-yellow-400">
              {adminData.stats.coffeeScores} Player
            </h3>
          </div>
        </div>
      )}

      {/* Tab: Users */}
      {activeTab === "users" && (
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl space-y-4 shadow-xl">
          <h2 className="text-white font-bold text-base">
            Daftar Anggota Terdaftar (Berdasarkan No HP)
          </h2>
          <div className="space-y-3">
            {adminData.users.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">
                Belum ada anggota terdaftar di database.
              </p>
            ) : (
              adminData.users.map((u: any) => (
                <div
                  key={u.phone}
                  className="flex justify-between items-center bg-gray-950 p-4 rounded-2xl border border-gray-800"
                >
                  <div>
                    <p className="text-white font-bold text-sm">{u.name}</p>
                    <p className="text-gray-400 text-xs">
                      📱 {u.phone} • Terdaftar:{" "}
                      {new Date(u.createdAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete("user", u.phone, u.name)}
                    className="bg-red-950/40 hover:bg-red-900 text-red-400 border border-red-900/50 text-xs font-bold px-4 py-2 rounded-xl transition"
                  >
                    Hapus User 🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab: Quotes */}
      {activeTab === "quotes" && (
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl space-y-4 shadow-xl">
          <h2 className="text-white font-bold text-base">
            Daftar Kata-Kata Maut (Quotes)
          </h2>
          <div className="space-y-3">
            {adminData.quotes.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">
                Belum ada quote tersimpan.
              </p>
            ) : (
              adminData.quotes.map((q: any) => (
                <div
                  key={q.id}
                  className="flex justify-between items-start gap-4 bg-gray-950 p-4 rounded-2xl border border-gray-800"
                >
                  <div className="space-y-1">
                    <p className="text-white text-sm italic">"{q.text}"</p>
                    <p className="text-indigo-400 text-xs font-bold">
                      — {q.author}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleDelete("quote", q.id, `quote dari ${q.author}`)
                    }
                    className="bg-red-950/40 hover:bg-red-900 text-red-400 border border-red-900/50 text-xs font-bold px-4 py-2 rounded-xl transition shrink-0"
                  >
                    Hapus 🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab: Settings */}
      {activeTab === "settings" && (
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl space-y-6 shadow-xl">
          <h2 className="text-white font-black text-xl">
            Sistem Kontrol & Pemeliharaan
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="bg-gray-950 border border-gray-800 p-6 rounded-2xl space-y-3">
              <h3 className="font-bold text-white text-sm">
                Status Warkop (Maintenance Mode)
              </h3>
              <p className="text-xs text-gray-400">
                Jika diaktifkan, seluruh portal akan tertutup dan menampilkan
                halaman warkop tutup untuk pengunjung biasa.
              </p>
              <button
                onClick={toggleMaintenance}
                className={`w-full py-3 rounded-xl font-bold text-xs transition shadow-lg ${
                  adminData.maintenance
                    ? "bg-red-600 hover:bg-red-500 text-white"
                    : "bg-green-600 hover:bg-green-500 text-white"
                }`}
              >
                {adminData.maintenance
                  ? "🔴 Matikan Maintenance (Buka Warkop)"
                  : "🟢 Nyalakan Maintenance (Tutup Warkop)"}
              </button>
            </div>

            <div className="bg-gray-950 border border-gray-800 p-6 rounded-2xl space-y-3">
              <h3 className="font-bold text-white text-sm">
                Cadangan Data (Backup)
              </h3>
              <p className="text-xs text-gray-400">
                Download seluruh database (user, skor, quotes) dalam format JSON
                untuk keamanan data.
              </p>
              <button
                onClick={handleDownloadBackup}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3 rounded-xl transition shadow-lg"
              >
                📥 Download Backup Database (JSON)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
