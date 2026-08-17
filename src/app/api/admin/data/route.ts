import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [users, quotes, coffeeCount, config] = await Promise.all([
      prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.quote.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.coffeeScore.count(),
      prisma.systemConfig.findUnique({ where: { id: "config" } }),
    ]);

    return NextResponse.json({
      stats: {
        users: users.length,
        quotes: quotes.length,
        coffeeScores: coffeeCount,
      },
      users,
      quotes,
      maintenance: config?.maintenance ?? false,
    });
  } catch (error) {
    console.error("Gagal mengambil data admin:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data database" },
      { status: 500 },
    );
  }
}
