import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXTAUTH_URL || 'https://futureline.replit.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/courses', '/courses/*', '/services', '/services/*', '/ai', '/tourism'],
        disallow: ['/admin', '/admin/*', '/instructor', '/instructor/*', '/dashboard', '/dashboard/*', '/api/*'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
