import { createCookieSessionStorage } from '@remix-run/node';
import { type ToastProps } from '~/components/ui/Toast';
import { COOKIE_PREFIX } from './config';
import { ENV } from './env';

export const toastKey = 'toast';

export const toastSessionStorage = createCookieSessionStorage({
  cookie: {
    name: `${COOKIE_PREFIX}_toast`,
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
    secrets: [ENV.SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production',
  },
});

export async function getToastCookie(request: Request) {
  const cookie = request.headers.get('cookie');
  const toastCookieSession = await toastSessionStorage.getSession(cookie);

  return toastCookieSession;
}

export async function getToast(request: Request) {
  const toastCookieSession = await getToastCookie(request);
  const toast = toastCookieSession.get(toastKey);

  return { toast, toastCookieSession };
}

export async function setToastCookie(request: Request, value: ToastProps) {
  const toastCookieSession = await getToastCookie(request);
  toastCookieSession.flash(toastKey, value);

  return toastCookieSession;
}
