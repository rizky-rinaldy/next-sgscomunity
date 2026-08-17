import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Menggunakan helper global

// GET: Ambil 10 besar leaderboard kopi
export async function GET() {
  try {
    const scores = await prisma.coffeeScore.findMany({
      include: {
        user: { select: { name: true, phone: true } },
      },
      orderBy: { score: "desc" },
      take: 10,
    });
    return NextResponse.json(scores);
  } catch (error) {
    console.error("GET Leaderboard Error:", error);
    return NextResponse.json(
      { error: "Gagal memuat leaderboard" },
      { status: 500 },
    );
  }
}

// POST: Simpan atau update skor kopi user
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, score } = body;

    if (!phone || score === undefined) {
      return NextResponse.json(
        { error: "Data tidak lengkap (phone atau score kosong)" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan di database, login dulu!" },
        { status: 404 },
      );
    }

    const existingScore = await prisma.coffeeScore.findUnique({
      where: { userId: user.id },
    });

    let savedScore;
    if (existingScore) {
      if (score > existingScore.score) {
        savedScore = await prisma.coffeeScore.update({
          where: { userId: user.id },
          data: { score },
        });
      } else {
        savedScore = existingScore;
      }
    } else {
      savedScore = await prisma.coffeeScore.create({
        data: { userId: user.id, score },
      });
    }

    return NextResponse.json(savedScore);
  } catch (error) {
    console.error("POST CoffeeScore Error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan skor ke database" },
      { status: 500 },
    );
  }
}
