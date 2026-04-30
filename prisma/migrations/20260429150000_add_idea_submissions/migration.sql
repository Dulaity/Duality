CREATE TABLE "IdeaSubmission" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "concept" TEXT NOT NULL,
    "images" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IdeaSubmission_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "IdeaSubmission_quantity_check" CHECK ("quantity" >= 1 AND "quantity" <= 5)
);

CREATE UNIQUE INDEX "IdeaSubmission_reference_key" ON "IdeaSubmission"("reference");
CREATE INDEX "IdeaSubmission_status_createdAt_idx" ON "IdeaSubmission"("status", "createdAt");
CREATE INDEX "IdeaSubmission_email_createdAt_idx" ON "IdeaSubmission"("email", "createdAt");
