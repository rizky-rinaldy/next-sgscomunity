import { defineConfig } from "@prisma/config";

export default defineConfig({
  migrations: {
    // Menggunakan ts-node standar Node.js
    seed: "npx ts-node ./prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
