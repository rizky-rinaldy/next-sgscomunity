import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Ambil semua foto galeri dari database
export async function GET() {
  try {
    const galleries = await prisma.gallery.findMany({
      include: {
        uploader: {
          select: { name: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(galleries);
  } catch (error) {
    console.error("Gagal memuat galeri:", error);
    return NextResponse.json({ error: "Gagal memuat galeri" }, { status: 500 });
  }
}

// POST: Tambah foto galeri baru
export async function POST(req: Request) {
  try {
    const { title, imageUrl, description, category, phone } = await req.json();

    if (!phone || !imageUrl || !title) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 },
      );
    }

    // Cari user berdasarkan nomor telepon (yang sedang login)
    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 },
      );
    }

    // Simpan ke database
    const newGallery = await prisma.gallery.create({
      data: {
        title,
        imageUrl,
        description,
        category: category || "Kopdar",
        uploaderId: user.id,
      },
    });

    return NextResponse.json(newGallery);
  } catch (error) {
    console.error("Gagal mengunggah foto:", error);
    return NextResponse.json(
      { error: "Gagal mengunggah foto ke database" },
      { status: 500 },
    );
  }
}
