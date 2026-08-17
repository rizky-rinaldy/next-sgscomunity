"use client";

import { useState, useEffect } from "react";
import { playSound } from "@/utils/sound";

export default function QuotesPage() {
  const [quoteList, setQuoteList] = useState<any[]>([]);
  const [currentQuote, setCurrentQuote] = useState({
    text: "Memuat kearifan lokal warkop...",
    name: "SGScommunity",
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State untuk Tambah Quote
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [role, setRole] = useState("Anak Warkop");

  // Ambil data dari API saat halaman dibuka
  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const res = await fetch("/api/quotes");
      const data = await res.json();

      // Jika database kosong, gunakan data dummy
      if (res.ok && data.length > 0) {
        setQuoteList(data);
        setCurrentQuote(data[0]);
      } else {
        const dummy = [{ text: "Nongkrong itu perlu.", author: "Admin" }];
        setQuoteList(dummy);
        setCurrentQuote(dummy[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateRandomQuote = () => {
    playSound("success");
    if (quoteList.length === 0) return;
    const randomIndex = Math.floor(Math.random() * quoteList.length);
    setCurrentQuote(quoteList[randomIndex]);
  };

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text || !author) {
      alert("⚠️ Kata-kata dan nama pengarang wajib diisi bro!");
      return;
    }

    playSound("success");

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, author, role }),
      });

      if (!res.ok) throw new Error("Gagal menambah kata-kata");

      // Reset form & tutup modal
      setText("");
      setAuthor("");
      setIsModalOpen(false);

      // Refresh data quote
      fetchQuotes();
      alert("✅ Kata-kata maut berhasil ditambahkan ke database warkop!");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menyimpan data.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-12">
      <div className="space-y-3">
        <span className="inline-block bg-yellow-950 text-yellow-400 border border-yellow-800 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
          ✨ SGScommunity Wisdom Hub
        </span>
        <h1 className="text-4xl font-black text-white">
          Generator Kata-Kata Maut
        </h1>
        <p className="text-gray-400 text-sm italic">
          "Nasihat ngawur yang tidak akan pernah kamu temukan di buku motivasi
          manapun."
        </p>
      </div>

      <div className="bg-gradient-to-br from-indigo-950/60 via-gray-900 to-gray-950 border-2 border-indigo-500/40 p-8 sm:p-12 rounded-3xl shadow-2xl relative space-y-6">
        <span className="text-5xl text-indigo-400 font-serif absolute top-4 left-6 opacity-40">
          “
        </span>
        <p className="text-xl sm:text-2xl font-bold text-white relative z-10 leading-relaxed">
          "{loading ? "Memuat..." : currentQuote.text}"
        </p>
        <p className="text-sm font-semibold text-yellow-400">
          — {loading ? "..." : currentQuote.name || currentQuote.author}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={generateRandomQuote}
          className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-pink-600 hover:opacity-90 text-white font-black text-xs px-8 py-4 rounded-2xl shadow-xl transition transform active:scale-95"
        >
          🔀 Putar Kata-Kata Maut Baru
        </button>

        <button
          onClick={() => {
            playSound("click");
            setIsModalOpen(true);
          }}
          className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 border border-gray-800 text-white font-black text-xs px-6 py-4 rounded-2xl shadow-lg transition active:scale-95"
        >
          ✍️ Sumbang Kata-Kata Maut
        </button>
      </div>

      {/* Modal Form Tambah Kata-Kata Maut */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-gray-900 border border-gray-800 max-w-md w-full rounded-3xl overflow-hidden shadow-2xl p-8 space-y-6 relative text-left">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-800 p-2 rounded-full w-8 h-8 flex items-center justify-center text-xs"
            >
              ✕
            </button>

            <div>
              <h2 className="text-2xl font-black text-white">
                Sumbang Kata Maut
              </h2>
              <p className="text-xs text-gray-400">
                Abadikan nasihat ngawurmu agar dibaca anak-anak warkop.
              </p>
            </div>

            <form onSubmit={handleSubmitQuote} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase">
                  Isi Kata-Kata Maut
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={3}
                  placeholder="Contoh: Dompet tipis bukan halangan untuk tetap nongkrong."
                  className="w-full bg-gray-950 border border-gray-800 p-4 rounded-2xl text-xs text-white focus:outline-none focus:border-indigo-500 resize-none font-bold"
                  required
                ></textarea>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase">
                  Nama / Tokoh Pengarang
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Contoh: Zaini (Ahli Nolep)"
                  className="w-full bg-gray-950 border border-gray-800 px-4 py-3 rounded-2xl text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 hover:opacity-90 text-white font-black text-xs py-4 rounded-2xl transition shadow-lg mt-2"
              >
                🚀 Simpan ke Database Warkop
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
