import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, target, identifier } = body;

    if (action === "toggle_maintenance") {
      await prisma.systemConfig.upsert({
        where: { id: "config" },
        update: { maintenance: identifier },
        create: { id: "config", maintenance: identifier },
      });
      return NextResponse.json({ success: true });
    }

    if (action === "delete") {
      if (target === "user") {
        await prisma.user.delete({ where: { phone: identifier } });
      } else if (target === "quote") {
        await prisma.quote.delete({ where: { id: identifier } });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Aksi tidak dikenal" }, { status: 400 });
  } catch (error) {
    console.error("Admin action error:", error);
    return NextResponse.json(
      { error: "Gagal mengeksekusi aksi" },
      { status: 500 },
    );
  }
}
