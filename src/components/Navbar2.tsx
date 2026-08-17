"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Users, Briefcase, Mail, Menu, X } from "lucide-react";

const navItems = [
  { name: "Home", href: "#home", icon: Home },
  { name: "Team", href: "#team", icon: Users },
  { name: "Projects", href: "#projects", icon: Briefcase },
  { name: "Contact", href: "#contact", icon: Mail },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* ================= DESKTOP & TABLET: FLYING SIDEBAR ================= */}
      <motion.nav
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 z-50 flex-col items-center gap-4 p-3 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-full shadow-2xl shadow-indigo-500/10"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <motion.a
              key={item.name}
              href={item.href}
              whileHover={{ scale: 1.2, x: 5 }}
              whileTap={{ scale: 0.9 }}
              className="relative group p-3 text-slate-400 hover:text-indigo-400 transition-colors rounded-full hover:bg-slate-800/60"
            >
              <Icon size={22} />
              {/* Tooltip Hover */}
              <span className="absolute left-full ml-3 px-2 py-1 bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-md opacity-0 group-hover:opacity-150 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                {item.name}
              </span>
            </motion.a>
          );
        })}
      </motion.nav>

      {/* ================= MOBILE: FLOATING BUTTON & BOTTOM BAR ================= */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="absolute bottom-16 right-0 flex flex-col gap-3 p-2 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-indigo-600/20 rounded-xl transition-all text-sm font-medium"
                  >
                    <Icon size={18} className="text-indigo-400" />
                    {item.name}
                  </a>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Flying Toggle Button for Mobile */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.9 }}
          className="p-4 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-600/40 focus:outline-none flex items-center justify-center"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>
    </>
  );
}
