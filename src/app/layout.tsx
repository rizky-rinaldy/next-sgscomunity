import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SGScommunity Portal",
  description: "Markas digital resmi geng nongkrong SGScommunity",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Cek status maintenance dari database
  let isMaintenance = false;
  try {
    const config = await prisma.systemConfig.findUnique({
      where: { id: "config" },
    });
    isMaintenance = config?.maintenance ?? false;
  } catch (err) {
    console.error("Gagal mengecek status maintenance:", err);
  }

  return (
    <html lang="id">
      <body
        className={`${inter.className} min-h-screen flex flex-col antialiased`}
      >
        {isMaintenance ? (
          <div className="flex-grow flex items-center justify-center px-4 py-24">
            <div className="max-w-md w-full bg-gray-900 border border-gray-800 p-8 rounded-3xl text-center space-y-6 shadow-2xl">
              <span className="text-5xl">🛑</span>
              <div className="space-y-2">
                <h1 className="text-2xl font-black text-white">
                  Warkop SGScommunity Lagi Tutup!
                </h1>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Lagi dibersihin atau bos-bos besar lagi adain rapat rahasia.
                  Silakan balik lagi nanti ya bro! ☕
                </p>
              </div>
              <div className="pt-2">
                <span className="inline-block bg-red-950/60 text-red-400 border border-red-900/50 text-[10px] font-bold px-4 py-2 rounded-xl uppercase tracking-widest">
                  ⚡ Status: Maintenance Mode Active
                </span>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <ScrollToTop />
            <Footer />
          </>
        )}
      </body>
    </html>
  );
}
