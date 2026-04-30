import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { adminIdeaSubmissionUpdateSchema } from "@/lib/validations/admin";

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

  const parsed = adminIdeaSubmissionUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid submission status." },
      { status: 400 },
    );
  }

  const { id } = await params;
  const submission = await prisma.ideaSubmission.update({
    where: {
      id,
    },
    data: {
      status: parsed.data.status,
    },
  });

  return NextResponse.json({ ok: true, submission });
}
