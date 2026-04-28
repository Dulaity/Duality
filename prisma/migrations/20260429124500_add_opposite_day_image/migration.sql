UPDATE "Product"
SET "subtitle" = 'Contrasting tee for pants energy',
    "badge" = 'Pants on top',
    "description" = 'A white tee printed with jeans because apparently clothing has side quests now.',
    "story" = 'Looks normal for half a second, then the jeans load in and the entire outfit becomes a visual bug.',
    "vibe" = 'Deadpan, stupid, and weirdly clean.',
    "highlights" = ARRAY['Denim front graphic', 'Oversized white tee', 'Soft ribbed collar']::TEXT[],
    "storefrontImage" = '/images/products/opposite-day-uniform-shirt.png',
    "catalogImages" = ARRAY['/images/products/opposite-day-uniform-shirt.png']::TEXT[],
    "updatedAt" = NOW()
WHERE "slug" = 'opposite-day-uniform';
