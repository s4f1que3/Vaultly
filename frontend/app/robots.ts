import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vaultly.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/login',
          '/terms',
          '/privacy',
        ],
        disallow: [
          '/dashboard',
          '/transactions',
          '/cards/',
          '/budgets',
          '/analytics',
          '/history',
          '/savings',
          '/goals',
          '/subscriptions',
          '/settings',
          '/auth/',
          '/api/',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
