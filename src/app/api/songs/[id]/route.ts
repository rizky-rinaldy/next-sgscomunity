import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase environment variables are missing");
  }

  return createClient(supabaseUrl, supabaseKey);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    // 1. Cari data lagu di database Prisma berdasarkan ID
    const song = await prisma.song.findUnique({
      where: { id },
    });

    if (!song) {
      return NextResponse.json(
        { success: false, error: "Lagu tidak ditemukan" },
        { status: 404 },
      );
    }

    // 2. Hapus file fisiknya dari Supabase Storage jika URL-nya valid
    try {
      const supabase = getSupabaseClient();
      // Mengambil nama file dari URL public (contoh: .../songs/filename.mp3)
      const urlParts = song.src.split("/songs/");
      if (urlParts.length > 1) {
        const fileName = urlParts[1];
        await supabase.storage.from("songs").remove([fileName]);
      }
    } catch (storageError) {
      console.error(
        "Gagal menghapus file dari Supabase Storage:",
        storageError,
      );
      // Lanjutkan proses hapus database meskipun file di storage gagal terhapus
    }

    // 3. Hapus data dari database PostgreSQL menggunakan Prisma
    await prisma.song.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Lagu berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete Song Error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan saat menghapus lagu" },
      { status: 500 },
    );
  }
}
