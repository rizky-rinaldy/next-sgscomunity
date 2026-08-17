import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { phone, name, bio, image, instagram, tiktok } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { error: "Nomor telepon tidak valid" },
        { status: 400 },
      );
    }

    // Menggunakan upsert agar otomatis membuat user baru jika belum ada,
    // atau meng-update data jika nomor telepon sudah terdaftar di database.
    const updatedUser = await prisma.user.upsert({
      where: { phone },
      update: {
        name: name || "Anak Warkop",
        bio,
        image,
        instagram,
        tiktok,
      },
      create: {
        phone,
        name: name || "Anak Warkop",
        bio,
        image,
        instagram,
        tiktok,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Gagal update profil:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui profil di server" },
      { status: 500 },
    );
  }
}
