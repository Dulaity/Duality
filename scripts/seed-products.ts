import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });
loadEnv();

async function main() {
  const { seedDefaultProducts } = await import("@/lib/product-store");

  await seedDefaultProducts();
  console.log("Default product catalog is seeded.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    const { prisma } = await import("@/lib/prisma");

    await prisma.$disconnect();
  });
