-- Vibe Coding: reposition for complete beginners (zero coding experience).
-- Supersedes scripts/vibe-coding-advanced.sql, which pointed the course at
-- experienced engineers and contradicted the home "Training" pillar + FAQ,
-- both of which already promised "idea to deployed product, no programming
-- background". This brings the DB row back in line with that positioning
-- and with the rewritten promo dialog (messages/{en,ar}.json → promo.*).
--
-- Idempotent: INSERTs the row where it is missing (local dev) and UPDATEs
-- the copy + level where it exists (production). Safe to run repeatedly.
-- Price, format, duration and schedule are deliberately left unchanged.

INSERT INTO "Course" (
  id, title, slug, "shortDescription", "fullDescription",
  "deliveryType", "courseFormat", "scheduleStatus", category, level,
  price, "discountPrice", "durationHours", status, "approvalStatus",
  "highlightBullets"
) VALUES (
  'crs_vibecoding_2026', 'Vibe Coding', 'vibe-coding',
  $$From idea to a real, published product — with zero coding experience. Describe what you want, direct AI to build it, and ship it.$$,
  $$Vibe Coding is for people with an idea and no programming background. You describe what you want in plain words, AI writes the code, and you learn to guide it, test it and publish a real product.

You do not need to know how to code. If you can describe a problem clearly and use a laptop, you have everything this programme needs.

What we cover: turning your idea into a clear plan an AI can build from; directing AI to write, fix and improve your software, step by step; testing what it built so it works for real users; and publishing your product online so people can use it.

You leave with a real, published product you built yourself — not a certificate, not a demo — plus the method to build the next one.$$,
  'ONLINE', 'COHORT', 'TBC', 'AI & Development', 'Beginner',
  149, 99, 24, 'PUBLISHED', 'APPROVED',
  ARRAY[
    'No programming background needed',
    'Build a real product, not a demo',
    'Publish it online by the end',
    'Work in English or Arabic'
  ]
)
ON CONFLICT (slug) DO UPDATE SET
  level              = EXCLUDED.level,
  "shortDescription" = EXCLUDED."shortDescription",
  "fullDescription"  = EXCLUDED."fullDescription",
  "highlightBullets" = EXCLUDED."highlightBullets";

SELECT slug, level, price, "discountPrice", status,
       left("shortDescription", 70) AS short
FROM "Course" WHERE slug = 'vibe-coding';
