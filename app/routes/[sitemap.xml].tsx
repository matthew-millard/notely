export async function loader() {
  const staticPages = [
    { loc: '/', lastmod: '2025-04-01', changefreq: 'monthly', priority: 1.0 },
    {
      loc: '/privacy-policy/',
      lastmod: '2025-04-02',
      changefreq: 'yearly',
      priority: 0.5,
    },
  ];

  const baseUrl = process.env.NODE_ENV === 'production' ? process.env.BASE_URL : 'http://localhost:3000';

  if (!baseUrl) {
    throw new Error('BASE_URL environment variable is not set');
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticPages
        .map(
          page => `
        <url>
          <loc>${baseUrl}${page.loc}</loc>
          <lastmod>${page.lastmod}</lastmod>
          <changefreq>${page.changefreq}</changefreq>
          <priority>${page.priority}</priority>
        </url>
      `
        )
        .join('')}
    </urlset>`;

  try {
    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400', // Cache for a day
      },
      status: 200,
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);

    throw new Response('Internal server error', { status: 500 });
  }
}
