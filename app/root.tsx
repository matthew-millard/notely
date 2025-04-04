import { cssBundleHref } from '@remix-run/css-bundle';
import '~/tailwind.css';
import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react';
import React from 'react';
import { Toaster } from 'sonner';
import { getUserId } from '~/.server/auth';
import { prisma } from '~/.server/db';
import { getThemeFromCookie, updateTheme } from '~/.server/theme';
import { getToast, toastSessionStorage } from './.server/toast';
import { updateThemeActionIntent, type Theme } from './components/ui/ThemeSwitch';
import { useTheme, useToast } from './hooks';

export function links() {
  return [
    ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
    // any other stylesheets you need
  ];
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  switch (intent) {
    case updateThemeActionIntent:
      return updateTheme(formData);
    default:
      throw new Response('Invalid intent', { status: 400 });
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const theme = getThemeFromCookie(request);
  const userId = await getUserId(request);
  const { toast, toastCookieSession } = await getToast(request);

  const user = userId
    ? await prisma.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          notes: {
            orderBy: {
              updatedAt: 'desc',
            },
          },
        },
      })
    : null;

  const data = {
    theme: theme as Theme,
    user,
    toast,
  };

  return json(data, {
    headers: {
      'Set-Cookie': await toastSessionStorage.commitSession(toastCookieSession),
    },
  });
}

function App() {
  const data = useLoaderData<typeof loader>();
  useToast(data.toast);

  return (
    <Document>
      <Outlet />
    </Document>
  );
}

function Document({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <html lang="en" className={`${theme} bg-background text-foreground`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Toaster richColors expand />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function AppWithProviders() {
  return <App />;
}
