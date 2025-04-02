export async function loader() {
  const baseUrl = process.env.NODE_ENV === 'production' ? process.env.BASE_URL : 'http://localhost:3000';

  if (!baseUrl) {
    throw new Error('BASE_URL environment variable is not set');
  }

  const robotText = `User-agent: *
Allow: /
Allow: /privacy-policy
Disallow: /_auth/
Disallow: /$userId_/
Disallow: /test-toast
Disallow: /healthcheck
Sitemap: ${baseUrl}/sitemap.xml`;

  return new Response(robotText, {
    headers: {
      'Content-Type': 'text/plain',
    },
    status: 200,
  });
}
