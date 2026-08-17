import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const config = await prisma.systemConfig.findUnique({
    where: { id: "config" },
  });
  return NextResponse.json({ maintenance: config?.maintenance ?? false });
}

export async function POST(req: Request) {
  const { maintenance } = await req.json();
  await prisma.systemConfig.upsert({
    where: { id: "config" },
    update: { maintenance },
    create: { id: "config", maintenance },
  });
  return NextResponse.json({ success: true });
}
