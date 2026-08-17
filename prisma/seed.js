const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Memulai proses seeding data TeamMember...");

  // Hapus data lama (opsional, agar tidak duplikat saat dijalankan ulang)
  await prisma.teamMember.deleteMany({});

  const members = [
    {
      name: "Riyandi",
      role: "Supreme Leader 👑",
      nickname: "Commander",
      bio: "Penanggung jawab utama kalau grup lagi waras maupun pas lagi rusuh. Pemimpin yang mengarahkan jalan hidup dan jalan nongkrong.",
      funFact: "Anak buah salah, leader yang pusing.",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      order: 1,
      instagramUrl: "https://instagram.com",
    },
    {
      name: "Saufi",
      role: "Wakil Leader ⚡",
      nickname: "Guardian",
      bio: "Menteri Pertahanan dan Keamanan Persahabatan. Siap sedia nge-backup Leader kapan pun dibutuhkan.",
      funFact: "Siap pasang badan (asal gak disuruh bayar traktir).",
      avatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      order: 2,
      instagramUrl: "https://instagram.com",
    },
    {
      name: "Rizalul",
      role: "Pengangguran Profesional 💼",
      nickname: "Time Lord",
      bio: "Aset paling berharga saat nongkrong mendadak. Penguasa waktu sejati yang siap dihubungi 24/7.",
      funFact: "Waktu adalah milik mereka yang tidak punya pekerjaan tetap.",
      avatarUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
      order: 3,
      instagramUrl: "https://instagram.com",
    },
    {
      name: "Zaini",
      role: "Master of Darkness 🌙",
      nickname: "Nolep",
      bio: "Pertapa kamar andalan. Offline pas siang, menjelma jadi makhluk nokturnal paling aktif pas tengah malam.",
      funFact: "Matahari adalah musuh alaminya.",
      avatarUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
      order: 4,
      instagramUrl: "https://instagram.com",
    },
    {
      name: "Syamsul",
      role: "Striker",
      nickname: "Striker",
      bio: "Pemain depan andalan.",
      funFact: "Santai tapi pasti.",
      avatarUrl:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
      order: 5,
      instagramUrl: "https://instagram.com",
    },
    {
      name: "Akbar",
      role: "Tanker",
      nickname: "Tanker",
      bio: "Pertahanan mental sekuat baja.",
      funFact: "Gak ada matinya.",
      avatarUrl:
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80",
      order: 6,
      instagramUrl: "https://instagram.com",
    },
    {
      name: "Iyan",
      role: "Support",
      nickname: "ading yandi",
      bio: "Adiknya leader.",
      funFact: "Jagoan kita semua.",
      avatarUrl:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
      order: 7,
      instagramUrl: "https://instagram.com",
    },
    {
      name: "Agus",
      role: "Assassin",
      nickname: "Assassin",
      bio: "Gerak cepat tanpa suara.",
      funFact: "Misterius.",
      avatarUrl:
        "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&auto=format&fit=crop&q=80",
      order: 8,
      instagramUrl: "https://instagram.com",
    },
    {
      name: "Gan gan",
      role: "Mage",
      nickname: "Mage",
      bio: "Penyusun strategi ulung.",
      funFact: "Pikirkan matang-matang.",
      avatarUrl:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
      order: 9,
      instagramUrl: "https://instagram.com",
    },
    {
      name: "Hilmi",
      role: "The King",
      nickname: "king",
      bio: "Penguasa takhta tertinggi.",
      funFact: "Bow down to the king.",
      avatarUrl:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80",
      order: 10,
      instagramUrl: "https://instagram.com",
    },
  ];

  for (const member of members) {
    await prisma.teamMember.create({
      data: member,
    });
  }

  console.log("✅ Seeding data TeamMember selesai!");
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
