import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/admin";
import { toProductMutationData } from "@/lib/admin-products";
import { prisma } from "@/lib/prisma";
import { adminProductSchema } from "@/lib/validations/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
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

  const parsed = adminProductSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid product details." },
      { status: 400 },
    );
  }

  try {
    const product = await prisma.product.create({
      data: toProductMutationData(parsed.data),
    });

    return NextResponse.json({ ok: true, product });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create product.",
      },
      { status: 400 },
    );
  }
}
