import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXTAUTH_URL || 'https://futureline.ai';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/courses', '/courses/*', '/services', '/services/*', '/ai', '/tourism'],
        // /v2 is the light-redesign staging route — also noindexed via its
        // own page metadata. Both it and this entry go away at cutover.
        disallow: [
          '/admin', '/admin/*',
          '/instructor', '/instructor/*',
          '/dashboard', '/dashboard/*',
          '/api/*',
          '/v2', '/v2/*',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
