import * as cookie from "cookie";
import { COOKIE_PREFIX } from "./config";
import { Theme, ThemeSwitchSchema } from "~/components/ui/ThemeSwitch";
import { parseWithZod } from "@conform-to/zod";
import { json } from "@remix-run/node";

const THEME_KEY = "prefers-theme";

export function getThemeFromCookie(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return "light";

  const theme = cookie.parse(cookieHeader)[`${COOKIE_PREFIX}_${THEME_KEY}`];

  return theme === "light" || theme === "dark" ? theme : "light"; // default to light
}

export function updateTheme(formData: FormData) {
  const submission = parseWithZod(formData, { schema: ThemeSwitchSchema });

  if (submission.status !== "success") {
    throw new Response("Invalid theme received", { status: 400 });
  }

  const { theme } = submission.value;

  return json(
    { submission: submission.reply() },
    {
      headers: {
        "Set-Cookie": setThemeCookie(theme),
      },
    },
  );
}

export function setThemeCookie(theme: Theme) {
  const themeCookie = cookie.serialize(`${COOKIE_PREFIX}_${THEME_KEY}`, theme, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
  });

  return themeCookie;
}
