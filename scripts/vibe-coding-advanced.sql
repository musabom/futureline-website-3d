-- Vibe Coding: correct the course from Beginner to Advanced.
--
-- The course was first published with beginner-oriented copy ("even if you
-- have never written code professionally"), which contradicts what it is. The
-- promo dialog now badges it Advanced, so the course record has to agree —
-- otherwise the popup and the page it links to describe different courses.
--
-- Content-only: no schema change, safe to re-run, and it touches exactly one
-- row.
--
--   psql "$DATABASE_URL" -f scripts/vibe-coding-advanced.sql
--
UPDATE "Course" SET
  level = 'Advanced',
  "shortDescription" = 'For engineers who already ship. Direct AI across a real codebase — architecture, review, and the judgement that keeps generated code production-safe.',
  "fullDescription" = 'Vibe Coding is for people who already write software and want to work at a different altitude: directing AI across a real codebase instead of typing every line.

This is not an introduction to programming, and not a prompt-library course. It assumes you can read a stack trace, reason about architecture, and tell good code from code that merely runs.

What we cover: decomposing a feature so a model can execute it reliably; steering across multi-file changes without losing the thread; reviewing AI output for the failure modes it reliably produces — plausible-but-wrong logic, silent security regressions, hallucinated APIs, tests that assert nothing; and the workflow discipline that keeps a fast-moving AI codebase reviewable, tested and deployable.

You will work on a real codebase, not toy exercises, and leave with a workflow you can apply to the system you maintain on Monday.',
  "highlightBullets" = ARRAY[
    'Direct AI across multi-file, real-world changes',
    'Catch the failure modes AI reliably produces',
    'Keep an AI-heavy codebase reviewable and tested',
    'Work in English or Arabic'
  ]
WHERE slug = 'vibe-coding';

-- Confirm it took.
SELECT slug, level, price, "discountPrice", status FROM "Course" WHERE slug = 'vibe-coding';
