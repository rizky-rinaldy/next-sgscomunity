import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Ambil daftar pesan (hanya 10 pesan terakhir)
export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
      take: 10, // Tampilan cuma 10 pesan saja
    });
    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("GET Chat Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal ambil chat" },
      { status: 500 },
    );
  }
}

// POST: Kirim pesan + Auto-clean (maksimal simpan 50 pesan)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, role, text } = body;

    if (!name || !text) {
      return NextResponse.json(
        { success: false, error: "Nama dan pesan wajib diisi!" },
        { status: 400 },
      );
    }

    // 1. Simpan pesan baru
    const newMessage = await prisma.message.create({
      data: { name, role: role || "Core Member", text },
    });

    // 2. Auto-Clean: Batasi simpan hanya 50 pesan di database
    const MAX_STORAGE = 50;
    const totalMessages = await prisma.message.count();

    if (totalMessages > MAX_STORAGE) {
      // Ambil ID pesan yang paling tua
      const oldestMessages = await prisma.message.findMany({
        orderBy: { createdAt: "asc" },
        take: totalMessages - MAX_STORAGE, // Ambil selisihnya
        select: { id: true },
      });

      const idsToDelete = oldestMessages.map((m) => m.id);

      if (idsToDelete.length > 0) {
        await prisma.message.deleteMany({
          where: { id: { in: idsToDelete } },
        });
      }
    }

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    console.error("POST Chat Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal kirim pesan" },
      { status: 500 },
    );
  }
}
