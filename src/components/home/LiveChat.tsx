"use client";

import { useState, useEffect } from "react";
import { playSound } from "@/utils/sound";

interface Message {
  id: string;
  name: string;
  role: string;
  text: string;
  createdAt: string;
}

export default function LiveChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState("Warga Warkop");

  // Fungsi cek sesi & ambil lencana real dari localStorage
  const checkSession = () => {
    const phone = localStorage.getItem("sgs_user_phone");
    const name = localStorage.getItem("sgs_user_name");
    const createdAtStr = localStorage.getItem("sgs_user_created_at");

    if (name) {
      setUserName(name);
      setUserPhone(phone);

      if (name === "Riyandi") {
        setUserRole("Supreme Leader 👑");
      } else if (createdAtStr) {
        // Hitung durasi hari secara real dari tanggal buat akun
        const createdDate = new Date(createdAtStr);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - createdDate.getTime());
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (days >= 365) setUserRole("👑 Legenda Abadi");
        else if (days >= 30) setUserRole("🛡️ Warga Tetap");
        else if (days >= 7) setUserRole("🔥 Sobat Warkop");
        else setUserRole("☕ Pendatang Baru");
      } else {
        setUserRole("☕ Pendatang Baru");
      }
    } else {
      setUserName(null);
      setUserPhone(null);
    }
  }; // <--- Kurung kurawal penutup fungsi checkSession yang tadinya kurang

  useEffect(() => {
    checkSession();
    fetchMessages();

    const sessionInterval = setInterval(checkSession, 2000);
    const chatInterval = setInterval(fetchMessages, 3000);

    return () => {
      clearInterval(sessionInterval);
      clearInterval(chatInterval);
    };
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/chat");
      const data = await res.json();
      if (data.success) setMessages(data.messages);
    } catch (error) {
      console.error("Gagal load chat:", error);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !userName || loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName,
          role: userRole,
          text,
        }),
      });

      const data = await res.json();
      if (data.success) {
        playSound("success");
        setText("");
        fetchMessages();
      } else {
        alert("Gagal kirim pesan: " + data.error);
      }
    } catch (error) {
      console.error("Error send chat:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!userName) {
    return (
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl text-center space-y-3 shadow-xl">
        <h3 className="text-white font-bold text-sm">
          💬 SGS Warkop Live Chat
        </h3>
        <p className="text-xs text-gray-400">
          Silakan masuk atau daftar warkop terlebih dahulu lewat tombol di pojok
          kanan atas untuk ikut ngobrol, Bre!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col h-[420px]">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-800">
        <div>
          <span className="text-[10px] bg-indigo-950 text-indigo-400 font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-800">
            💬 Warkop Live Chat
          </span>
          <h3 className="text-sm font-black text-white mt-1">
            Halo, <span className="text-indigo-400">{userName}</span>!{" "}
            <span className="text-[10px] text-yellow-400 font-normal">
              [{userRole}]
            </span>
          </h3>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("sgs_user_phone");
            localStorage.removeItem("sgs_user_name");
            localStorage.removeItem("sgs_user_image");
            localStorage.removeItem("sgs_user_created_at");
            setUserName(null);
            window.location.reload();
          }}
          className="text-[10px] text-gray-500 hover:text-red-400 underline"
        >
          Keluar
        </button>
      </div>

      {/* Area Pesan Chat */}
      {/* Area Pesan Chat */}
      <div className="flex-grow overflow-y-auto space-y-3 pr-2">
        {messages.length > 0 ? (
          messages.map((m) => {
            const timeString = new Date(m.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={m.id}
                className="bg-gray-950 p-3.5 rounded-2xl border border-gray-800/80 space-y-1.5"
              >
                {/* Header Bubble: Nama, Role, dan Waktu */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="text-xs font-bold text-white truncate max-w-[160px] sm:max-w-[200px]">
                      {m.name}
                    </span>
                    <span className="text-[10px] bg-gray-900 text-indigo-400 px-2 py-0.5 rounded-md border border-indigo-900/50 font-medium whitespace-nowrap flex-shrink-0">
                      {m.role}
                    </span>
                  </div>
                  <span className="text-[9px] text-gray-500 self-end sm:self-auto">
                    {timeString}
                  </span>
                </div>

                {/* Isi Pesan */}
                <p className="text-xs text-gray-300 leading-relaxed break-words">
                  {m.text}
                </p>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-xs text-gray-500 italic">
            Belum ada obrolan. Mulai sapa kawan-kawan warkop yuk!
          </div>
        )}
      </div>

      {/* Form Kirim Pesan */}
      <form
        onSubmit={handleSend}
        className="mt-3 pt-3 border-t border-gray-800 flex gap-2"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tulis pesan ke warkop..."
          className="flex-grow bg-gray-950 border border-gray-700 px-4 py-2.5 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition active:scale-95"
        >
          {loading ? "..." : "Kirim"}
        </button>
      </form>
    </div>
  );
}
