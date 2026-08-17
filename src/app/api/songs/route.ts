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

export async function GET() {
  try {
    const songs = await prisma.song.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, songs });
  } catch (error) {
    console.error("GET Songs Error:", error);
    return NextResponse.json({ success: true, songs: [] });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseClient();
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

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // KODE BARU (Aman untuk Supabase Storage):
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${uniqueSuffix}-${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("songs")
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase Storage Error:", uploadError);
      return NextResponse.json(
        { success: false, error: "Gagal mengunggah file ke cloud storage" },
        { status: 500 },
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from("songs")
      .getPublicUrl(filename);

    const src = publicUrlData.publicUrl;

    const newSong = await prisma.song.create({
      data: { title, artist, src },
    });

    return NextResponse.json({ success: true, song: newSong });
  } catch (error) {
    console.error("Upload Song Error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan pada server" },
      { status: 500 },
    );
  }
}
