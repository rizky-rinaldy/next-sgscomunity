"use client";

import { useState, useEffect } from "react";
import { playSound } from "@/utils/sound";

interface Author {
  id: string;
  name: string;
  phone: string;
  role?: string;
  image?: string;
}

interface Comment {
  id: string;
  content: string;
  author: Author;
  createdAt: string;
}

interface Reaction {
  id: string;
  type: string;
  userId: string;
}

interface Post {
  id: string;
  content: string;
  imageUrl?: string | null;
  createdAt: string;
  author: Author;
  comments: Comment[];
  reactions: Reaction[];
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<Author | null>(null);

  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(
    null,
  );
  const [commentText, setCommentText] = useState("");

  // Ambil data user murni berdasarkan sgs_user_phone dari Navbar/localStorage
  useEffect(() => {
    const phone = localStorage.getItem("sgs_user_phone");
    const name = localStorage.getItem("sgs_user_name");
    const image = localStorage.getItem("sgs_user_image");

    if (phone) {
      // Kita set data user sementara, tapi untuk operasi backend (post/like/comment)
      // kita butuh ID asli dari database berdasarkan phone tersebut.
      // Mari kita fetch data user lengkap dari backend berdasarkan nomor HP.
      fetch(`/api/user?phone=${phone}`)
        .then(async (res) => {
          const text = await res.text();
          return text ? JSON.parse(text) : null;
        })
        .then((userData) => {
          if (userData && userData.id) {
            setCurrentUser(userData);
          } else {
            // Fallback jika endpoint user belum ada, gunakan data dari localStorage
            setCurrentUser({
              id: phone, // Menggunakan phone sebagai identifier jika ID belum tersimpan
              phone: phone,
              name: name || "Warga",
              image: image || "",
            });
          }
        })
        .catch(() => {
          setCurrentUser({
            id: phone,
            phone: phone,
            name: name || "Warga",
            image: image || "",
          });
        });
    }

    // Ambil Feed dari API
    fetch("/api/feed")
      .then(async (res) => {
        const text = await res.text();
        return text ? JSON.parse(text) : [];
      })
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal memuat feed:", err);
        setLoading(false);
      });
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !imageUrl) return;

    // Ambil langsung dari localStorage agar pasti terbaca
    const phone = localStorage.getItem("sgs_user_phone");
    if (!phone) {
      alert("Kamu belum login! Silakan login terlebih dahulu.");
      return;
    }

    playSound("success");

    try {
      const res = await fetch("/api/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          imageUrl,
          authorPhone: phone, // Kirim nomor telepon langsung ke backend
        }),
      });

      const data = await res.json();

      if (res.ok && data.id) {
        setPosts([data, ...posts]);
        setContent("");
        setImageUrl(null);
      } else {
        alert("Gagal kirim: " + (data.error || "Terjadi kesalahan"));
      }
    } catch (err) {
      console.error("Gagal membuat post:", err);
      alert("Terjadi kesalahan jaringan.");
    }
  };

  const handleReaction = async (postId: string) => {
    // Ambil langsung nomor telepon dari localStorage
    const phone = localStorage.getItem("sgs_user_phone");
    if (!phone) {
      alert("Silakan login dulu untuk menyukai postingan!");
      return;
    }
    playSound("click");

    try {
      const res = await fetch("/api/feed", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          authorPhone: phone, // Menggunakan nomor telepon sebagai pengenal user
          type: "LIKE",
        }),
      });

      const updatedPost = await res.json();
      if (res.ok && updatedPost.id) {
        setPosts(posts.map((p) => (p.id === postId ? updatedPost : p)));
      } else {
        alert(
          "Gagal memberikan reaksi: " +
            (updatedPost.error || "Kesalahan server"),
        );
      }
    } catch (err) {
      console.error("Gagal memberikan reaksi:", err);
    }
  };

  const handleAddComment = async (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    // Ambil langsung nomor telepon dari localStorage
    const phone = localStorage.getItem("sgs_user_phone");
    if (!phone) {
      alert("Login dulu untuk ikut berkomentar.");
      return;
    }
    playSound("success");

    try {
      const res = await fetch("/api/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_comment",
          postId,
          content: commentText,
          authorPhone: phone, // Mengirim nomor telepon untuk mencari user di backend
        }),
      });

      const newComment = await res.json();
      if (res.ok && newComment.id) {
        setPosts(
          posts.map((p) =>
            p.id === postId
              ? { ...p, comments: [...p.comments, newComment] }
              : p,
          ),
        );
        setCommentText("");
      } else {
        alert("Gagal komentar: " + (newComment.error || "Kesalahan server"));
      }
    } catch (err) {
      console.error("Gagal menambah komentar:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-white font-black text-xl animate-pulse">
        💬 LOADING COMMUNITY FEED...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="inline-block bg-indigo-950 text-indigo-400 border border-indigo-800 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
          💬 SGScommunity Community Feed
        </span>
        <h1 className="text-4xl font-black text-white">
          Ruang Obrolan & Status Random
        </h1>
        <p className="text-gray-400 text-sm italic">
          "Tempat unek-unek, sambatan, upload foto mabar, dan info ngawur."
        </p>
      </div>

      {/* Form Buat Postingan */}
      {currentUser ? (
        <form
          onSubmit={handlePost}
          className="bg-gray-900 border border-gray-800 p-6 rounded-3xl space-y-4 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={
                  currentUser.image ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                }
                alt="Avatar"
                className="w-8 h-8 rounded-xl object-cover border border-indigo-500"
              />
              <div>
                <span className="text-xs text-gray-400 block">
                  Posting sebagai:
                </span>
                <span className="text-sm font-bold text-white">
                  {currentUser.name}
                </span>
              </div>
            </div>
          </div>

          <textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Lagi mikirin apa hari ini, bro? Atau mau pamer foto mabar?"
            className="w-full bg-gray-950 border border-gray-800 p-4 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition resize-none"
          />

          {imageUrl && (
            <div className="relative w-full h-48 bg-gray-950 rounded-2xl overflow-hidden border border-gray-800">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setImageUrl(null)}
                className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full text-xs font-bold"
              >
                ✕ Hapus Foto
              </button>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 border border-gray-700">
              📸 Pilih Foto
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-lg"
            >
              Kirim Status 🚀
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl text-center space-y-3">
          <p className="text-sm text-gray-300">
            Kamu belum login ke Warkop SGScommunity.
          </p>
          <a
            href="/join"
            className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition"
          >
            Masuk / Daftar Sekarang
          </a>
        </div>
      )}

      {/* List Postingan */}
      <div className="space-y-6">
        {posts.map((p) => {
          const hasLiked = currentUser
            ? p.reactions?.some(
                (r) =>
                  r.userId === currentUser.id || r.userId === currentUser.phone,
              )
            : false;

          return (
            <div
              key={p.id}
              className="bg-gray-900 border border-gray-800 p-6 rounded-3xl space-y-4 shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      p.author?.image ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                    }
                    alt={p.author?.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-700"
                  />
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      {p.author?.name || "Anonymous"}
                    </h3>
                    <span className="text-[10px] text-indigo-400 font-semibold">
                      {p.author?.role || "Member"}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-gray-500">
                  {new Date(p.createdAt).toLocaleDateString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <p className="text-sm text-gray-200 leading-relaxed">
                {p.content}
              </p>

              {p.imageUrl && (
                <div className="rounded-2xl overflow-hidden border border-gray-800 max-h-80 bg-gray-950">
                  <img
                    src={p.imageUrl}
                    alt="Post image"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex items-center gap-6 pt-3 border-t border-gray-800 text-xs text-gray-400">
                <button
                  onClick={() => handleReaction(p.id)}
                  className={`flex items-center gap-1.5 transition font-medium ${
                    hasLiked ? "text-pink-500 font-bold" : "hover:text-pink-500"
                  }`}
                >
                  ❤️ {p.reactions?.length || 0} Suka
                </button>
                <button
                  onClick={() =>
                    setActiveCommentPostId(
                      activeCommentPostId === p.id ? null : p.id,
                    )
                  }
                  className="flex items-center gap-1.5 hover:text-indigo-400 transition font-medium"
                >
                  💬 {p.comments?.length || 0} Komentar
                </button>
              </div>

              {activeCommentPostId === p.id && (
                <div className="pt-4 space-y-3 border-t border-gray-800/60 mt-2">
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {p.comments?.length === 0 ? (
                      <p className="text-xs text-gray-500 italic">
                        Belum ada komentar. Jadilah yang pertama nge-roasting!
                      </p>
                    ) : (
                      p.comments.map((c) => (
                        <div
                          key={c.id}
                          className="bg-gray-950 border border-gray-800/80 p-3 rounded-xl space-y-0.5"
                        >
                          <span className="font-bold text-xs text-indigo-300">
                            {c.author?.name || "User"}
                          </span>
                          <p className="text-xs text-gray-300">{c.content}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {currentUser ? (
                    <form
                      onSubmit={(e) => handleAddComment(p.id, e)}
                      className="flex gap-2 pt-2"
                    >
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Tulis balasan komentar..."
                        className="flex-grow bg-gray-950 border border-gray-800 px-3 py-2 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                      >
                        Kirim
                      </button>
                    </form>
                  ) : (
                    <p className="text-[11px] text-gray-500 italic text-center pt-1">
                      Login dulu untuk ikut berkomentar.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
