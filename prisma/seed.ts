import "dotenv/config"; // <-- Wajib ada di baris paling atas agar .env terbaca
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";

const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const admin = await prisma.user.upsert({
    where: { phone: "882022216159" },
    update: { name: "Admin" },
    create: {
      phone: "882022216159",
      name: "Admin (Yang Ngatur Semuanya)",
      bio: "Komunitas aja ku jagain, apalagi kamu...",
    },
  });

  console.log("✅ Berhasil membuat data seed:", admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
