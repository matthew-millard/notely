export async function loader() {
  const baseUrl = process.env.NODE_ENV === 'production' ? process.env.BASE_URL : 'http://localhost:3000';

  if (!baseUrl) {
    console.error('BASE_URL is not defined');
    return new Response('Internal server error', { status: 500 });
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
