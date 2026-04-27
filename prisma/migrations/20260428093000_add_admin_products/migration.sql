CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'ADMIN');

ALTER TABLE "User" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER';

CREATE TABLE "Product" (
  "id" TEXT NOT NULL,
  "sku" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "subtitle" TEXT NOT NULL,
  "price" INTEGER NOT NULL,
  "collection" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "fit" TEXT NOT NULL,
  "badge" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "story" TEXT NOT NULL,
  "vibe" TEXT NOT NULL,
  "materials" TEXT NOT NULL,
  "leadTime" TEXT NOT NULL,
  "sizes" TEXT[],
  "highlights" TEXT[],
  "paletteBase" TEXT NOT NULL,
  "paletteShell" TEXT NOT NULL,
  "paletteAccent" TEXT NOT NULL,
  "paletteGlow" TEXT NOT NULL,
  "paletteText" TEXT NOT NULL,
  "inventory" INTEGER NOT NULL DEFAULT 0,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Product_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Product_price_nonnegative" CHECK ("price" >= 0),
  CONSTRAINT "Product_inventory_nonnegative" CHECK ("inventory" >= 0)
);

CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
CREATE INDEX "User_role_idx" ON "User"("role");
CREATE INDEX "Product_active_featured_idx" ON "Product"("active", "featured");
CREATE INDEX "Product_collection_idx" ON "Product"("collection");
CREATE INDEX "Product_inventory_idx" ON "Product"("inventory");
