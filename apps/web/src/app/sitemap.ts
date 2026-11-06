import { MetadataRoute } from 'next';
import sql from '@/app/api/utils/sql';

const BASE = 'https://www.goaboatworld.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { path: '', changeFrequency: 'daily', priority: 1 },
    { path: '/fleet', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/experiences', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/gallery', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/terms', changeFrequency: 'monthly', priority: 0.3 },
    { path: '/privacy', changeFrequency: 'monthly', priority: 0.3 },
    { path: '/cancellation-refund', changeFrequency: 'monthly', priority: 0.3 },
  ].map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency as MetadataRoute.Sitemap[number]['changeFrequency'],
    priority: r.priority,
  }));

  let yachtRoutes: MetadataRoute.Sitemap = [];
  try {
    const yachts = await sql`SELECT id FROM yachts_master WHERE is_active = TRUE`;
    yachtRoutes = yachts.map((y) => ({
      url: `${BASE}/yacht/${y.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch {
    // Sitemap still serves the static routes if the DB is unreachable.
  }

  return [...staticRoutes, ...yachtRoutes];
}
