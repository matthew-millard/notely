import { createCookieSessionStorage } from '@remix-run/node';
import { COOKIE_PREFIX } from './config';
import { ENV } from './env';

const sessionSecret = ENV.SESSION_SECRET;

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: `${COOKIE_PREFIX}_session_id`,
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [sessionSecret],
    secure: process.env.NODE_ENV === 'production',
  },
});

export function getCookie(request: Request) {
  const cookie = request.headers.get('Cookie');
  return cookie;
}

export async function getSession(request: Request) {
  const cookie = getCookie(request);
  return sessionStorage.getSession(cookie);
}
