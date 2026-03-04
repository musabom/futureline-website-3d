import { PrismaClient } from '@prisma/client';

async function migrateLead() {
  const prisma = new PrismaClient();
  try {
    const result = await prisma.$queryRawUnsafe(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'Lead' AND column_name = 'name'
    `) as any[];

    if (result.length > 0) {
      console.log('[Migration] Found old "name" column on Lead table, migrating...');

      const hasFirstName = await prisma.$queryRawUnsafe(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'Lead' AND column_name = 'firstName'
      `) as any[];

      if (hasFirstName.length === 0) {
        await prisma.$executeRawUnsafe(`ALTER TABLE "Lead" ADD COLUMN "firstName" TEXT NOT NULL DEFAULT ''`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "Lead" ADD COLUMN "lastName" TEXT NOT NULL DEFAULT ''`);
        console.log('[Migration] Added firstName/lastName columns');
      }

      await prisma.$executeRawUnsafe(`
        UPDATE "Lead" SET 
          "firstName" = COALESCE(SPLIT_PART("name", ' ', 1), ''),
          "lastName" = COALESCE(
            CASE WHEN POSITION(' ' IN "name") > 0 
              THEN SUBSTRING("name" FROM POSITION(' ' IN "name") + 1) 
              ELSE '' 
            END, ''
          )
        WHERE "firstName" = '' OR "firstName" IS NULL
      `);
      console.log('[Migration] Migrated name data to firstName/lastName');

      await prisma.$executeRawUnsafe(`ALTER TABLE "Lead" DROP COLUMN IF EXISTS "name"`);
      console.log('[Migration] Dropped old name column');
    } else {
      console.log('[Migration] Lead table already uses firstName/lastName, skipping');
    }
  } catch (error) {
    console.error('[Migration] Lead migration error (non-fatal):', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateLead();
