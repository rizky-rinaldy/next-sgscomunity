"use client";

import Navbar from "@/components/Navbar2";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden md:pl-24">
      <Navbar />

      {/* HERO SECTION */}
      <section
        id="home"
        className="min-h-screen flex flex-col justify-center items-start px-6 md:px-16 max-w-5xl mx-auto py-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="px-3 py-1 text-xs font-semibold tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full uppercase">
            Komunitas Kreatif & Teknologi
          </span>
          <h1 className="text-4xl md:text-7xl font-extrabold mt-6 tracking-tight leading-tight">
            Kolaborasi Tanpa Batas, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500">
              Karya Berkualitas.
            </span>
          </h1>
          <p className="mt-6 text-slate-400 text-base md:text-lg max-w-2xl leading-relaxed">
            Kami adalah wadah bagi para kreator, developer, dan inovator untuk
            tumbuh bersama dan membangun project berdampak tinggi.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
            >
              Jelajahi Karya
            </a>
            <a
              href="#contact"
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium rounded-xl transition-all"
            >
              Gabung Komunitas
            </a>
          </div>
        </motion.div>
      </section>

      {/* TEAM SECTION */}
      <section
        id="team"
        className="min-h-screen flex flex-col justify-center px-6 md:px-16 max-w-5xl mx-auto py-20"
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Tim Inti Kami
          </h2>
          <p className="text-slate-400 mt-2">
            Orang-orang hebat di balik layar komunitas.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                whileHover={{ y: -8 }}
                className="p-6 bg-slate-900/50 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-xl"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4 mx-auto" />
                <h3 className="text-lg font-semibold text-center text-white">
                  Nama Anggota
                </h3>
                <p className="text-xs text-indigo-400 text-center mt-1">
                  Core Developer
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* PROJECTS SECTION */}
      <section
        id="projects"
        className="min-h-screen flex flex-col justify-center px-6 md:px-16 max-w-5xl mx-auto py-20"
      >
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          Project Komunitas
        </h2>
        <p className="text-slate-400 mt-2">
          Beberapa karya dan kolaborasi terbaik kami.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-64 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col justify-end"
            >
              <span className="text-xs text-indigo-400 font-semibold">
                Open Source
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                Project Kolaborasi {item}
              </h3>
              <p className="text-sm text-slate-400 mt-2">
                Deskripsi singkat mengenai project yang dikerjakan bersama tim.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section
        id="contact"
        className="min-h-screen flex flex-col justify-center px-6 md:px-16 max-w-5xl mx-auto py-20"
      >
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          Mari Terhubung
        </h2>
        <p className="text-slate-400 mt-2">
          Tertarik berkolaborasi atau ingin bergabung?
        </p>
        <form className="mt-10 max-w-xl space-y-4">
          <input
            type="text"
            placeholder="Nama Lengkap"
            className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-white text-sm"
          />
          <input
            type="email"
            placeholder="Alamat Email"
            className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-white text-sm"
          />
          <textarea
            rows={4}
            placeholder="Pesan / Pertanyaan"
            className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-white text-sm"
          />
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-600/30"
          >
            Kirim Pesan
          </button>
        </form>
      </section>
    </main>
  );
}
