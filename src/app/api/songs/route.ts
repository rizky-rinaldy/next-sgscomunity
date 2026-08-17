import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Pakai jalur tunggal dari lib/prisma
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// GET: Ambil semua daftar lagu
export async function GET() {
  try {
    const songs = await prisma.song.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, songs });
  } catch (error) {
    console.error("GET Songs Error:", error);
    return NextResponse.json({ success: true, songs: [] }); // Kembalikan array kosong agar aman
  }
}

// POST: Upload file MP3 dan simpan datanya
export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const title = data.get("title") as string;
    const artist = data.get("artist") as string;
    const file = data.get("file") as File;

    if (!title || !artist || !file) {
      return NextResponse.json(
        { success: false, error: "Judul, artis, dan file MP3 wajib diisi!" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Pastikan folder public/audio ada (kalau belum, buat otomatis)
    const uploadDir = path.join(process.cwd(), "public", "audio");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Abaikan jika sudah ada
    }

    // Buat nama file unik
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `${uniqueSuffix}-${file.name.replace(/\s+/g, "_")}`;
    const filepath = path.join(uploadDir, filename);

    // Simpan file ke server
    await writeFile(filepath, buffer);

    const src = `/audio/${filename}`;

    // Simpan ke database Prisma menggunakan prisma dari lib
    const newSong = await prisma.song.create({
      data: { title, artist, src },
    });

    return NextResponse.json({ success: true, song: newSong });
  } catch (error) {
    console.error("Upload Song Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengunggah lagu ke server" },
      { status: 500 },
    );
  }
}
