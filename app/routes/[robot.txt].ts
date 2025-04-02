import { ENV } from '~/.server/env';

export async function loader() {
  const baseUrl = process.env.NODE_ENV === 'production' ? ENV.BASE_URL : 'http://localhost:3000';

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
