import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Ambil semua postingan beserta author, komentar, dan reaksi
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        comments: {
          include: { author: true },
          orderBy: { createdAt: "asc" },
        },
        reactions: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Gagal mengambil feed:", error);
    return NextResponse.json({ error: "Gagal memuat feed" }, { status: 500 });
  }
}

// POST: Buat postingan baru atau tambah komentar
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, imageUrl, authorPhone, action, postId } = body;

    if (!authorPhone) {
      return NextResponse.json(
        { error: "Nomor telepon tidak valid / belum login" },
        { status: 400 },
      );
    }

    // Cari user di database berdasarkan nomor telepon (diubah dari db ke prisma)
    const user = await prisma.user.findUnique({
      where: { phone: authorPhone },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan di database" },
        { status: 404 },
      );
    }

    // Jika aksi adalah komentar
    if (action === "add_comment") {
      const newComment = await prisma.comment.create({
        data: {
          content: body.content,
          postId,
          authorId: user.id,
        },
        include: { author: true },
      });
      return NextResponse.json(newComment);
    }

    // Jika membuat postingan baru
    const newPost = await prisma.post.create({
      data: {
        content: content || "",
        imageUrl: imageUrl || null,
        authorId: user.id,
      },
      include: {
        author: true,
        comments: { include: { author: true } },
        reactions: true,
      },
    });

    return NextResponse.json(newPost);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}

// PATCH: Toggle / Tambah Reaksi (Like)
// PATCH: Toggle / Tambah Reaksi (Like)
export async function PATCH(req: Request) {
  try {
    const { postId, authorPhone, type = "LIKE" } = await req.json();

    if (!authorPhone) {
      return NextResponse.json(
        { error: "Nomor telepon tidak valid / belum login" },
        { status: 400 },
      );
    }

    // Cari user berdasarkan nomor telepon
    const user = await prisma.user.findUnique({
      where: { phone: authorPhone },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 },
      );
    }

    const userId = user.id;

    // Cek apakah reaction sudah ada
    const existingReaction = await prisma.reaction.findUnique({
      where: {
        postId_userId: { postId, userId },
      },
    });

    if (existingReaction) {
      if (existingReaction.type === type) {
        await prisma.reaction.delete({
          where: { id: existingReaction.id },
        });
      } else {
        await prisma.reaction.update({
          where: { id: existingReaction.id },
          data: { type },
        });
      }
    } else {
      await prisma.reaction.create({
        data: { postId, userId, type },
      });
    }

    const updatedPost = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: true,
        comments: { include: { author: true } },
        reactions: true,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Gagal memproses reaksi:", error);
    return NextResponse.json(
      { error: "Gagal memproses reaksi" },
      { status: 500 },
    );
  }
}
