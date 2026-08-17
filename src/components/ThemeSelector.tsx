"use client";

import { useState, useEffect } from "react";
import { playSound } from "@/utils/sound";

export default function ThemeSelector() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("sgs_theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const changeTheme = (newTheme: string) => {
    playSound("click");
    setTheme(newTheme);
    localStorage.setItem("sgs_theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <div className="flex items-center gap-1.5 bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-2xl shadow-md">
      <span className="text-[10px] font-bold text-gray-400 uppercase hidden lg:inline">
        Tema:
      </span>
      <button
        onClick={() => changeTheme("dark")}
        className={`text-[10px] font-bold px-2.5 py-1 rounded-xl transition ${theme === "dark" ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"}`}
      >
        🌑 Dark
      </button>
      <button
        onClick={() => changeTheme("light")}
        className={`text-[10px] font-bold px-2.5 py-1 rounded-xl transition ${theme === "light" ? "bg-amber-500 text-black" : "text-gray-400 hover:text-white"}`}
      >
        ☀️ Light
      </button>
      <button
        onClick={() => changeTheme("cyber")}
        className={`text-[10px] font-bold px-2.5 py-1 rounded-xl transition ${theme === "cyber" ? "bg-pink-600 text-white" : "text-gray-400 hover:text-white"}`}
      >
        ⚡ Cyber
      </button>
    </div>
  );
}
