import { cssBundleHref } from "@remix-run/css-bundle";
import "~/tailwind.css";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  type LinksFunction,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { getUserId } from "~/.server/auth";
import { prisma } from "~/.server/db";
import { getThemeFromCookie, updateTheme } from "~/.server/theme";
import {
  updateThemeActionIntent,
  type Theme,
} from "./components/ui/ThemeSwitch";
import { useTheme } from "./hooks";

export function links() {
  return [
    ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
    // any other stylesheets you need
  ];
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case updateThemeActionIntent:
      return updateTheme(formData);
    default:
      throw new Response("Invalid intent", { status: 400 });
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const theme = getThemeFromCookie(request);
  const userId = await getUserId(request);

  const user = userId
    ? await prisma.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
        },
      })
    : null;

  const data = {
    theme: theme as Theme,
    user,
  };

  return json(data);
}

function App() {
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
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function AppWithProviders() {
  return <App />;
}
