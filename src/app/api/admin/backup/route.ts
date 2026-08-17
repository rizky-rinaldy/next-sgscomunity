import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user
      .findMany({
        orderBy: { createdAt: "desc" },
      })
      .catch(() => []);

    const coffeeScores = await prisma.coffeeScore.findMany().catch(() => []);

    const quotes = await prisma.quote
      .findMany({
        orderBy: { createdAt: "desc" },
      })
      .catch(() => []);

    const backupData = {
      app: "SGScommunity Warkop Portal",
      backupAt: new Date().toISOString(),
      data: {
        users,
        coffeeScores,
        quotes,
      },
    };

    return NextResponse.json(backupData);
  } catch (error) {
    console.error("Gagal melakukan backup data:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data backup dari database" },
      { status: 500 },
    );
  }
}
