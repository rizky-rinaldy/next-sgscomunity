import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Ambil semua user beserta relasi skor kopi dan quotes buatan mereka
    const users = await prisma.user.findMany({
      include: {
        coffeeScore: true,
        quotes: true, // Pastikan relasi quotes ada di model User jika ingin dihitung
      },
    });

    // Petakan dan hitung poin kustom (misal: skor kopi * 10 + jumlah quote * 50)
    const rankedUsers = users.map((user) => {
      const coffee = user.coffeeScore?.score || 0;
      const quoteCount = user.quotes?.length || 0;

      // Rumus poin keaktifan anak warkop
      const totalPower = coffee * 10 + quoteCount * 50;

      // Tentukan gelar/title otomatis berdasarkan total poin atau pencapaian
      let title = "Anak Warkop Santai";
      let badge = "☕";

      if (totalPower > 500) {
        title = "Supreme Leader / Raja Warkop";
        badge = "👑";
      } else if (coffee > 50) {
        title = "Penguasa Cangkir Kopi";
        badge = "🔥";
      } else if (quoteCount > 2) {
        title = "Penyair Kata Maut";
        badge = "✍️";
      }

      return {
        id: user.id,
        name: user.name,
        title,
        badge,
        scoreValue: totalPower,
        scoreText: `${totalPower} Poin Warkop`,
      };
    });

    // Urutkan dari poin tertinggi ke terendah
    rankedUsers.sort((a, b) => b.scoreValue - a.scoreValue);

    return NextResponse.json(rankedUsers);
  } catch (error) {
    console.error("Gagal memuat Hall of Fame:", error);
    return NextResponse.json(
      { error: "Gagal memuat data leaderboard" },
      { status: 500 },
    );
  }
}
