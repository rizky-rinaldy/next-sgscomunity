import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Ambil daftar quotes dari tabel Quote database
export async function GET() {
  try {
    const quotes = await prisma.quote.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(quotes);
  } catch (error) {
    console.error("Gagal memuat quotes:", error);
    return NextResponse.json({ error: "Gagal memuat quotes" }, { status: 500 });
  }
}

// POST: Tambah quote baru ke tabel Quote
export async function POST(req: Request) {
  try {
    const { text, author } = await req.json();

    if (!text || !author) {
      return NextResponse.json(
        { error: "Kata-kata dan author wajib diisi!" },
        { status: 400 },
      );
    }

    const newQuote = await prisma.quote.create({
      data: {
        text,
        author,
      },
    });

    return NextResponse.json(newQuote);
  } catch (error) {
    console.error("Gagal menyimpan quote:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan ke database" },
      { status: 500 },
    );
  }
}
