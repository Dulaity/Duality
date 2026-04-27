import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });
loadEnv();

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

async function main() {
  const [{ hashPassword }, { prisma }] = await Promise.all([
    import("@/lib/password"),
    import("@/lib/prisma"),
  ]);
  const email = requiredEnv("ADMIN_EMAIL").toLowerCase();
  const password = requiredEnv("ADMIN_PASSWORD");
  const name = process.env.ADMIN_NAME?.trim() || "Duality Admin";

  if (password.length < 12) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
  }

  const passwordHash = await hashPassword(password);

  await prisma.user.upsert({
    where: {
      email,
    },
    create: {
      name,
      email,
      passwordHash,
      role: "ADMIN",
    },
    update: {
      name,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`Admin account is ready for ${email}.`);
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
