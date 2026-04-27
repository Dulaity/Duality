import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { adminUserUpdateSchema } from "@/lib/validations/admin";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdminApi();

  if (!admin) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = adminUserUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid account role." },
      { status: 400 },
    );
  }

  const { id } = await params;

  if (id === admin.id && parsed.data.role !== "ADMIN") {
    return NextResponse.json(
      { error: "You cannot remove your own admin access." },
      { status: 400 },
    );
  }

  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      role: parsed.data.role,
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  return NextResponse.json({ ok: true, user });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdminApi();

  if (!admin) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { id } = await params;

  if (id === admin.id) {
    return NextResponse.json(
      { error: "You cannot delete your own admin account." },
      { status: 400 },
    );
  }

  await prisma.user.delete({
    where: {
      id,
    },
  });

  return NextResponse.json({ ok: true });
}
