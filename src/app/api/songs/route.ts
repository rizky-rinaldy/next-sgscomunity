import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, artist, src } = body;

    if (!title || !artist || !src) {
      return NextResponse.json(
        { success: false, error: "Data tidak lengkap" },
        { status: 400 },
      );
    }

    const newSong = await prisma.song.create({
      data: {
        title,
        artist,
        src,
      },
    });

    return NextResponse.json({ success: true, song: newSong });
  } catch (error: any) {
    console.error("Save Song Data Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan data lagu ke database" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const songs = await prisma.song.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, songs });
  } catch (error) {
    console.error("Get Songs Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat daftar lagu" },
      { status: 500 },
    );
  }
}
