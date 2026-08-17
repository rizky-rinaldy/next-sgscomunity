import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Nomor tidak valid" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { phone: phone.trim() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User tidak ditemukan" },
        { status: 404 },
      );
    }

    const createdDate = new Date(user.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return NextResponse.json({
      success: true,
      daysJoined: diffDays,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Achievement Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat lencana" },
      { status: 500 },
    );
  }
}
