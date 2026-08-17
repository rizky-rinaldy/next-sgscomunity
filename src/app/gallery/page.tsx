"use client";

import { useState, useEffect } from "react";
import { playSound } from "@/utils/sound";

export default function GalleryPage() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [activeImage, setActiveImage] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State untuk Upload Foto Baru
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Kopdar");
  const [imageUrl, setImageUrl] = useState("");

  // Ambil data galeri dari API saat halaman dibuka
  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (res.ok) {
        setPhotos(data);
      }
    } catch (err) {
      console.error("Gagal mengambil data galeri:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("⚠️ Ukuran foto terlalu besar! Maksimal 2MB ya bro.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        playSound("click");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phone = localStorage.getItem("sgs_user_phone");

    if (!phone) {
      alert("⚠️ Eitss, login dulu bro kalau mau upload foto ke galeri warkop!");
      return;
    }

    if (!imageUrl) {
      alert("⚠️ Pilih foto terlebih dahulu!");
      return;
    }

    playSound("success");

    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          title,
          description,
          category,
          imageUrl,
        }),
      });

      if (!res.ok) {
        throw new Error("Gagal mengunggah foto");
      }

      // Reset form & tutup modal upload
      setTitle("");
      setDescription("");
      setImageUrl("");
      setIsUploading(false);

      // Refresh daftar foto
      fetchGalleries();
      alert("✅ Foto berhasil diunggah ke galeri warkop!");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mengunggah foto.");
    }
  };

  const handleOpenModal = (p: any) => {
    playSound("click");
    setActiveImage(p);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="space-y-3">
          <span className="inline-block bg-purple-950 text-purple-400 border border-purple-800 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
            📸 SGScommunity Memory Archive
          </span>
          <h1 className="text-4xl font-black text-white">
            Galeri Mabar & Kebersamaan
          </h1>
          <p className="text-gray-400 text-sm italic">
            "Bukti otentik bahwa kita pernah muda dan kurang tidur."
          </p>
        </div>

        <button
          onClick={() => {
            playSound("click");
            setIsUploading(true);
          }}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black px-6 py-4 rounded-2xl shadow-lg transition active:scale-95 flex items-center gap-2"
        >
          <span>➕</span> Unggah Dokumentasi Baru
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500 text-xs animate-pulse">
          Memuat arsip kenangan warkop...
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-3xl space-y-3">
          <p className="text-gray-400 text-sm">
            Belum ada foto di galeri warkop.
          </p>
          <p className="text-xs text-gray-500">
            Jadilah yang pertama mengunggah momen keseruan!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {photos.map((p) => (
            <div
              key={p.id}
              onClick={() => handleOpenModal(p)}
              className="group relative bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:border-indigo-500 transition-all duration-300"
            >
              <div className="h-56 overflow-hidden bg-gray-950">
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
              </div>
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-yellow-400 text-[10px] font-bold px-3 py-1 rounded-full">
                {p.category}
              </div>
              <div className="p-5 space-y-1">
                <h3 className="font-bold text-white text-base">{p.title}</h3>
                <p className="text-xs text-gray-400 line-clamp-1">
                  {p.description}
                </p>
                {p.uploader && (
                  <p className="text-[10px] text-indigo-400 pt-2 font-medium">
                    Oleh: {p.uploader.name}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Detail Foto */}
      {activeImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-gray-900 border border-gray-800 max-w-xl w-full rounded-3xl overflow-hidden shadow-2xl relative space-y-4 p-6">
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-800 p-2 rounded-full w-8 h-8 flex items-center justify-center text-xs z-10"
            >
              ✕
            </button>
            <img
              src={activeImage.imageUrl}
              alt={activeImage.title}
              className="w-full h-72 object-cover rounded-2xl"
            />
            <div className="space-y-1">
              <span className="text-xs bg-indigo-950 text-indigo-400 font-bold px-3 py-0.5 rounded-full">
                {activeImage.category}
              </span>
              <h3 className="text-2xl font-black text-white mt-2">
                {activeImage.title}
              </h3>
              <p className="text-sm text-gray-300">{activeImage.description}</p>
              {activeImage.uploader && (
                <p className="text-xs text-gray-500 pt-2">
                  Diunggah oleh:{" "}
                  <strong className="text-gray-300">
                    {activeImage.uploader.name}
                  </strong>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Form Upload Foto */}
      {isUploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-gray-900 border border-gray-800 max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl p-8 space-y-6 relative">
            <button
              onClick={() => setIsUploading(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-800 p-2 rounded-full w-8 h-8 flex items-center justify-center text-xs"
            >
              ✕
            </button>

            <div>
              <h2 className="text-2xl font-black text-white">
                Unggah Momen Baru
              </h2>
              <p className="text-xs text-gray-400">
                Abadikan keseruan nongkrong atau mabar ke database warkop.
              </p>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase">
                  Judul Momen
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Mabar Mobile Legends Sampai Subuh"
                  className="w-full bg-gray-950 border border-gray-800 px-4 py-3 rounded-2xl text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">
                    Kategori
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 px-4 py-3 rounded-2xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Kopdar">Kopdar</option>
                    <option value="Mabar">Mabar</option>
                    <option value="Rapat">Rapat</option>
                    <option value="Meme">Meme</option>
                    <option value="Nolep">Nolep</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">
                    Pilih Berkas Foto
                  </label>
                  <label className="block bg-gray-950 hover:bg-gray-800 border border-gray-800 text-white text-xs font-bold px-4 py-3 rounded-2xl cursor-pointer text-center truncate">
                    📁 Pilih Foto...
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {imageUrl && (
                <div className="relative h-32 rounded-2xl overflow-hidden border border-gray-800">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase">
                  Deskripsi / Cerita Singkat
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Ceritain sedikit duka atau suka dibalik foto ini..."
                  className="w-full bg-gray-950 border border-gray-800 p-4 rounded-2xl text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs py-4 rounded-2xl transition shadow-lg"
              >
                🚀 Kirim ke Galeri Database
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
