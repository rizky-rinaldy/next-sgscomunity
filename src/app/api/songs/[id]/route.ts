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
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Await params terlebih dahulu agar ID terbaca dengan benar
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID lagu tidak valid" },
        { status: 400 },
      );
    }

    // 1. Cari data lagu di database
    const song = await prisma.song.findUnique({
      where: { id },
    });

    if (!song) {
      return NextResponse.json(
        { success: false, error: "Lagu tidak ditemukan" },
        { status: 404 },
      );
    }

    // 2. Hapus file fisik dari Supabase Storage
    try {
      if (song.src && song.src.includes("/songs/")) {
        const supabase = getSupabaseClient();
        const urlParts = song.src.split("/songs/");
        if (urlParts.length > 1) {
          const fileName = decodeURIComponent(urlParts[1].split("?")[0]);
          await supabase.storage.from("songs").remove([fileName]);
        }
      }
    } catch (storageError) {
      console.error(
        "Warning: Gagal hapus file dari Supabase Storage:",
        storageError,
      );
    }

    // 3. Hapus data dari database Prisma
    await prisma.song.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Lagu berhasil dihapus",
    });
  } catch (error: any) {
    console.error("Delete Song Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Terjadi kesalahan saat menghapus lagu",
      },
      { status: 500 },
    );
  }
}
