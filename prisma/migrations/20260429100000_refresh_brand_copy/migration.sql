UPDATE "Product"
SET "collection" = 'Brainrot',
    "updatedAt" = NOW()
WHERE "collection" = 'Meme Shirts';

UPDATE "Product"
SET "collection" = 'Sports Trauma',
    "updatedAt" = NOW()
WHERE "collection" = 'Sports Merch';

UPDATE "Product"
SET "collection" = 'Anime Delusions',
    "updatedAt" = NOW()
WHERE "collection" = 'Anime Merch';

UPDATE "Product"
SET "subtitle" = 'Brainrot tee for leaving early',
    "collection" = 'Brainrot',
    "description" = 'For people whose entire personality is surviving group projects, unread messages, and events they never wanted to attend.',
    "story" = 'Looks normal until someone reads it. Then suddenly everyone knows you are operating on 4% social battery.',
    "updatedAt" = NOW()
WHERE "slug" = 'social-battery-critical';

UPDATE "Product"
SET "subtitle" = 'Dark humor tee for pretending to function',
    "collection" = 'Brainrot',
    "description" = 'Emotionally oversized too. A boxy tee for people whose loading screen has been active since breakfast.',
    "story" = 'Looks normal until someone reads it, which is exactly when the HR-safe version of your personality leaves the room.',
    "updatedAt" = NOW()
WHERE "slug" = 'emotionally-rendering';

UPDATE "Product"
SET "subtitle" = 'Sports trauma for elite sitting',
    "collection" = 'Sports Trauma',
    "description" = 'For people whose entire personality is yelling at a screen like they are on the payroll.',
    "story" = 'Sports trauma, but wearable. Made for match days, fake tactical analysis, and elite bench behavior.',
    "updatedAt" = NOW()
WHERE "slug" = 'benchwarmer-olympics';

UPDATE "Product"
SET "subtitle" = 'Match-day trauma in cotton',
    "collection" = 'Sports Trauma',
    "description" = 'Looks normal until someone reads it. Built for people who shout tactical advice at screens and call it emotional investment.',
    "updatedAt" = NOW()
WHERE "slug" = 'final-whistle-chaos';

UPDATE "Product"
SET "subtitle" = 'Anime delusion for doomed side quests',
    "collection" = 'Anime Delusions',
    "description" = 'Anime delusions for anyone entering every situation like a doomed side character with rent due.',
    "updatedAt" = NOW()
WHERE "slug" = 'plot-armor-expired';

UPDATE "Product"
SET "subtitle" = 'Anime delusion for useless arcs',
    "collection" = 'Anime Delusions',
    "description" = 'Emotionally oversized too. A boxy tee for days that happen but add absolutely nothing to the plot.',
    "updatedAt" = NOW()
WHERE "slug" = 'filler-episode-survivor';
