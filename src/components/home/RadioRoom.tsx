"use client";

import { useState, useRef, useEffect } from "react";
import { playSound } from "@/utils/sound";

interface Song {
  id: string;
  title: string;
  artist: string;
  src: string;
}

export default function RadioRoom() {
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.4);

  // State untuk pencarian lagu
  const [searchQuery, setSearchQuery] = useState("");

  // State untuk form upload lagu
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newArtist, setNewArtist] = useState("");
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // State untuk loading saat menghapus lagu
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const res = await fetch("/api/songs");
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("API GET songs bukan JSON");
        return;
      }
      const data = await res.json();
      if (data.success && data.songs.length > 0) {
        setPlaylist(data.songs);
      } else {
        setPlaylist([
          {
            id: "1",
            title: "Faded (Classic)",
            artist: "Alan Walker",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
          },
        ]);
      }
    } catch (error) {
      console.error("Gagal load playlist:", error);
    }
  };

  const currentTrack = playlist[currentTrackIndex] || playlist[0];

  useEffect(() => {
    if (!currentTrack) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(currentTrack.src);
    } else {
      audioRef.current.src = currentTrack.src;
    }
    audioRef.current.volume = volume;
    audioRef.current.loop = true;

    if (isPlaying) {
      audioRef.current.play().catch((e) => console.log("Play error:", e));
    }
  }, [currentTrackIndex, playlist]);

  const togglePlay = () => {
    playSound("click");
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.log("Audio play error:", e));
    }
  };

  const handleSelectTrack = (trackId: string) => {
    playSound("click");
    const index = playlist.findIndex((s) => s.id === trackId);
    if (index !== -1) {
      setCurrentTrackIndex(index);
      setIsPlaying(true);
    }
  };

  // Fungsi untuk menghapus lagu
  const handleDeleteSong = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Mencegah agar card tidak ikut ter-klik (memutar lagu) saat tombol hapus ditekan
    playSound("click");

    if (!confirm("Yakin ingin menghapus lagu ini dari playlist warkop?"))
      return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/songs/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        playSound("success");
        // Jika lagu yang sedang diputar kebetulan yang dihapus, hentikan atau pindah index
        if (currentTrack?.id === id) {
          setIsPlaying(false);
          if (audioRef.current) audioRef.current.pause();
        }
        fetchSongs(); // Refresh ulang playlist dari database
      } else {
        alert("Gagal menghapus: " + data.error);
      }
    } catch (error) {
      console.error("Error delete song:", error);
      alert("Terjadi kesalahan jaringan saat menghapus.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  const handleUploadSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newArtist || !fileToUpload) {
      alert("Judul, artis, dan file MP3 wajib diisi, Bro!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", newTitle);
    formData.append("artist", newArtist);
    formData.append("file", fileToUpload);

    try {
      const res = await fetch("/api/songs", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        playSound("success");
        setNewTitle("");
        setNewArtist("");
        setFileToUpload(null);
        setShowAddForm(false);
        fetchSongs();
      } else {
        alert("Gagal upload lagu: " + data.error);
      }
    } catch (error) {
      console.error("Error upload song:", error);
      alert("Terjadi kesalahan jaringan saat upload.");
    } finally {
      setLoading(false);
    }
  };

  // Filter daftar lagu berdasarkan pencarian (judul atau artis)
  const filteredSongs = playlist.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 border border-indigo-500/30 p-6 rounded-3xl shadow-xl space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="text-[10px] bg-indigo-900 text-indigo-300 font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-700">
            🎧 SGS Community Jukebox
          </span>
          <h3 className="text-xl font-black text-white mt-1">
            Warkop Music Station 24/7
          </h3>
          <p className="text-xs text-gray-400">
            Sedang diputar:{" "}
            <strong className="text-indigo-300">
              {currentTrack
                ? `${currentTrack.title} - ${currentTrack.artist}`
                : "Memuat..."}
            </strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gray-800 hover:bg-gray-700 text-indigo-300 border border-indigo-700/50 font-bold text-xs px-4 py-3 rounded-2xl shadow-lg transition"
          >
            {showAddForm ? "✕ Tutup Form" : "📤 Upload Lagu MP3"}
          </button>
          <button
            onClick={togglePlay}
            className={`font-black text-xs px-6 py-3 rounded-2xl shadow-lg transition transform active:scale-95 flex items-center gap-2 ${
              isPlaying
                ? "bg-pink-600 hover:bg-pink-500 text-white animate-pulse"
                : "bg-indigo-600 hover:bg-indigo-500 text-white"
            }`}
          >
            {isPlaying ? "⏹ Pause" : "▶ Putar"}
          </button>
        </div>
      </div>

      {/* Form Upload File MP3 */}
      {showAddForm && (
        <form
          onSubmit={handleUploadSong}
          className="bg-gray-950/80 border border-indigo-800/60 p-4 rounded-2xl space-y-3"
        >
          <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
            📂 Upload File Musik MP3 Langsung ke Server
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Judul Lagu..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="bg-gray-900 border border-gray-800 text-white text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-indigo-500"
            />
            <input
              type="text"
              placeholder="Artis / Penyanyi..."
              value={newArtist}
              onChange={(e) => setNewArtist(e.target.value)}
              className="bg-gray-900 border border-gray-800 text-white text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-indigo-500"
            />
            <input
              type="file"
              accept="audio/mp3,audio/*"
              onChange={(e) => setFileToUpload(e.target.files?.[0] || null)}
              className="bg-gray-900 border border-gray-800 text-gray-400 text-xs px-3 py-1.5 rounded-xl file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-md"
          >
            {loading
              ? "Mengunggah File MP3..."
              : "🚀 Upload & Simpan ke Playlist"}
          </button>
        </form>
      )}

      {/* Bagian Playlist & Search Bar */}
      <div className="space-y-3 pt-2 border-t border-indigo-900/50">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="text-xs font-bold text-gray-300">
            Daftar Playlist Warkop ({playlist.length} Lagu):
          </label>

          {/* Input Kotak Pencarian */}
          <input
            type="text"
            placeholder="🔍 Cari judul atau artis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-900 border border-gray-800 text-white text-xs px-3 py-1.5 rounded-xl focus:outline-none focus:border-indigo-500 w-full sm:w-60"
          />
        </div>

        {/* Grid List Lagu yang Tersaring */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
          {filteredSongs.length > 0 ? (
            filteredSongs.map((track) => {
              const isSelected = currentTrack?.id === track.id;
              const isDeleting = deletingId === track.id;
              return (
                <div
                  key={track.id}
                  onClick={() => handleSelectTrack(track.id)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600 text-white border-indigo-400 shadow-md"
                      : "bg-gray-900/80 text-gray-400 border-gray-800 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="truncate">{track.title}</div>
                    <div className="text-[10px] opacity-70 font-normal">
                      {track.artist}
                    </div>
                  </div>

                  {/* Tombol Hapus Lagu */}
                  <button
                    onClick={(e) => handleDeleteSong(track.id, e)}
                    disabled={isDeleting}
                    title="Hapus lagu"
                    className="bg-red-900/60 hover:bg-red-700 text-red-200 hover:text-white p-1.5 rounded-lg transition text-[10px] shrink-0"
                  >
                    {isDeleting ? "..." : "🗑️"}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-4 text-xs text-gray-500 italic">
              Lagu "{searchQuery}" tidak ditemukan, Bro! Coba cari yang lain.
            </div>
          )}
        </div>
      </div>

      {/* Status & Volume Bar */}
      <div className="pt-2 border-t border-indigo-900/50 flex items-center justify-between flex-wrap gap-4 text-xs text-gray-300">
        <span className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${isPlaying ? "bg-emerald-500 animate-ping" : "bg-gray-500"}`}
          />
          Status:{" "}
          <strong className="text-white">
            {isPlaying ? "Live Jukebox Playing 🎶" : "Standby ⏸"}
          </strong>
        </span>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400 font-bold">Volume:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 accent-indigo-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
