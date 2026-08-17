"use server";

import { prisma } from "@/lib/prisma";

export async function authenticateUser(data: {
  phone: string;
  name: string;
  bio?: string;
  image?: string;
}) {
  try {
    const cleanPhone = data.phone.trim();

    const user = await prisma.user.upsert({
      where: { phone: cleanPhone },
      update: {
        name: data.name,
        ...(data.bio && { bio: data.bio }),
        ...(data.image && { image: data.image }),
      },
      create: {
        phone: cleanPhone,
        name: data.name,
        bio: data.bio || "Warga baru warkop SGScommunity. ☕",
        image:
          data.image ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      },
    });

    return { success: true, user };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Gagal terhubung ke database warkop." };
  }
}

export async function checkUserLogin(phone: string) {
  try {
    const cleanPhone = phone.trim();
    const user = await prisma.user.findUnique({
      where: { phone: cleanPhone },
    });

    if (!user) {
      return {
        success: false,
        error:
          "Nomor WhatsApp belum terdaftar! Silakan daftar terlebih dahulu.",
      };
    }

    return { success: true, user };
  } catch (error) {
    console.error("Login Database Error:", error);
    return { success: false, error: "Terjadi kesalahan pada database warkop." };
  }
}
