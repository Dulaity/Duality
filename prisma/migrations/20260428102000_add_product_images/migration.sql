ALTER TABLE "Product"
ADD COLUMN "storefrontImage" TEXT,
ADD COLUMN "catalogImages" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
