import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Pakai jalur tunggal dari lib/prisma

// GET: Ambil total cheers global
export async function GET() {
  try {
    let stat = await prisma.stat.findUnique({
      where: { key: "global_cheers" },
    });

    if (!stat) {
      stat = await prisma.stat.create({
        data: { key: "global_cheers", value: 0 },
      });
    }

    return NextResponse.json({ success: true, count: stat.value });
  } catch (error) {
    console.error("GET Cheers Error:", error);
    return NextResponse.json(
      { success: false, count: 0, error: "Gagal ambil cheers" },
      { status: 500 },
    );
  }
}

// POST: Tambah 1 cheers
export async function POST() {
  try {
    const updated = await prisma.stat.upsert({
      where: { key: "global_cheers" },
      update: { value: { increment: 1 } },
      create: { key: "global_cheers", value: 1 },
    });

    return NextResponse.json({ success: true, count: updated.value });
  } catch (error) {
    console.error("POST Cheers Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal update cheers" },
      { status: 500 },
    );
  }
}
