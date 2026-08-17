import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Mengambil data dari tabel team member di database
    const members = await prisma.teamMember.findMany({
      orderBy: { id: "asc" }, // atau sesuai field urutan kamu
    });

    // Pastikan selalu merespons dengan JSON (walaupun array kosong)
    return NextResponse.json(members || [], { status: 200 });
  } catch (error) {
    console.error("Gagal mengambil data team member:", error);
    // Jika database error, kembalikan array kosong agar frontend tidak crash
    return NextResponse.json([], { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, ...data } = await req.json();

    const updatedMember = await prisma.teamMember.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error("Gagal update team member:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate data" },
      { status: 500 },
    );
  }
}
export async function POST(req: Request) {
  try {
    // Membuat member baru dengan data default
    const newMember = await prisma.teamMember.create({
      data: {
        name: "Anggota Baru",
        role: "New Member",
        nickname: "Newbie",
        avatarUrl:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
        bio: "Bio kosong...",
        order: 99, // Urutan paling belakang
      },
    });
    return NextResponse.json(newMember);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal menambah anggota" },
      { status: 500 },
    );
  }
}
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID tidak ditemukan" },
        { status: 400 },
      );
    }

    await prisma.teamMember.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Berhasil menghapus anggota" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Gagal menghapus anggota:", error);
    return NextResponse.json(
      { error: "Gagal menghapus anggota dari database" },
      { status: 500 },
    );
  }
}
