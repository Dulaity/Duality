import { NextResponse } from "next/server";

import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { registerRequestSchema } from "@/lib/validations/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "Expected application/json" }, { status: 415 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = registerRequestSchema.safeParse(body);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];

    return NextResponse.json(
      { error: firstIssue?.message ?? "Please check the form details and try again." },
      { status: 400 },
    );
  }

  const email = parsed.data.email.trim().toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      passwordHash: true,
    },
  });

  if (existingUser?.passwordHash) {
    return NextResponse.json(
      { error: "An account with this email already exists. Please sign in instead." },
      { status: 409 },
    );
  }

  if (existingUser && !existingUser.passwordHash) {
    return NextResponse.json(
      {
        error:
          "This email is already linked to a social login. Please sign in with that provider.",
      },
      { status: 409 },
    );
  }

  const passwordHash = await hashPassword(parsed.data.password);

  await prisma.user.create({
    data: {
      name: parsed.data.name.trim(),
      email,
      passwordHash,
    },
  });

  return NextResponse.json({
    ok: true,
    message: "Your account has been created.",
  });
}
