export default function Footer() {
  return (
    <footer className="max-w-6xl mx-auto px-4 py-10 mt-20 border-t border-gray-900 text-center space-y-3">
      <div className="inline-block bg-indigo-950/40 text-indigo-300 border border-indigo-800/50 text-[11px] font-bold px-4 py-1.5 rounded-full">
        ☕ Hidup Cuma Sekali, Jangan Dibikin Stres Bro!
      </div>
      <p className="text-gray-500 text-xs">
        © {new Date().getFullYear()}{" "}
        <span className="text-gray-400 font-bold">RNLDcorp</span>. Dibuat dengan
        secangkir kopi, Wi-Fi gratis, dan sejuta mimpi sukses.
      </p>
    </footer>
  );
}
