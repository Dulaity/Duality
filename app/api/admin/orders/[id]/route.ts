import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { adminOrderUpdateSchema } from "@/lib/validations/admin";

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

  const parsed = adminOrderUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid order status." },
      { status: 400 },
    );
  }

  const { id } = await params;
  const order = await prisma.order.update({
    where: {
      id,
    },
    data: {
      status: parsed.data.status,
      fulfillmentStatus: parsed.data.fulfillmentStatus,
    },
  });

  return NextResponse.json({ ok: true, order });
}
