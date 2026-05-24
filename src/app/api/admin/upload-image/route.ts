/**
 * POST /api/admin/upload-image
 * -----------------------------------------------------------------
 * Multipart file upload for admin-side images (instructor photos,
 * potentially future course thumbnails, etc.). Admin-only. Writes
 * to `public/uploads/instructors/{random}.{ext}` and returns the
 * public path so the caller can store it in `User.image` (or any
 * other URL-typed column).
 *
 * Constraints:
 *  - Image MIME types only (jpeg, png, webp, gif).
 *  - 5 MB cap (web profile photos rarely need more).
 *  - Random 8-byte hex filename so two uploads of the same name don't
 *    collide and the URL isn't guessable.
 *
 * Limitations:
 *  - Writes to the local filesystem. Works in dev and on long-running
 *    Node servers. On serverless platforms (Vercel) the function FS is
 *    read-only after build — would need swapping for S3/Cloudinary
 *    when deploying there.
 */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { writeFile, mkdir } from 'fs/promises';
import { join, extname } from 'path';
import { randomBytes } from 'crypto';
import { authOptions } from '@/lib/auth';

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file in request' }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `File too large. Max ${MAX_BYTES / 1024 / 1024} MB.` },
        { status: 400 },
      );
    }

    // Validate by both MIME type AND extension — defence in depth.
    const ext = extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Use JPG, PNG, WebP, or GIF.' },
        { status: 400 },
      );
    }
    if (file.type && !ALLOWED_MIME.has(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported MIME type.' },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${randomBytes(8).toString('hex')}${ext}`;
    const dir = join(process.cwd(), 'public', 'uploads', 'instructors');
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, filename), buffer);

    return NextResponse.json({ url: `/uploads/instructors/${filename}` });
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
