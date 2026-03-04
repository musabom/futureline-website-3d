import { NextResponse } from 'next/server';
import { getBrandSettings } from '@/lib/brand';

export async function GET() {
  try {
    const settings = await getBrandSettings();
    return NextResponse.json({
      contactEmail: settings.contactEmail,
      tourismEmail: settings.tourismEmail,
    });
  } catch {
    return NextResponse.json({
      contactEmail: 'flservices.ai@gmail.com',
      tourismEmail: 'authentic.tour.om@gmail.com',
    });
  }
}
