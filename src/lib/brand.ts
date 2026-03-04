import { prisma } from '@/lib/prisma';

const DEFAULTS = {
  companyName: 'FutureLine',
  tagline: 'Design • Deploy • Evolve',
  primaryColor: '#0F1E3D',
  accentColor: '#18A999',
  logo: null as string | null,
  contactEmail: 'flservices.ai@gmail.com',
  tourismEmail: 'authentic.tour.om@gmail.com',
};

export async function getBrandSettings() {
  const settings = await prisma.brandSettings.findFirst();
  return {
    ...DEFAULTS,
    ...settings,
  };
}
