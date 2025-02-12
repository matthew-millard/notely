import { Outlet } from "@remix-run/react";
import { Logo } from "~/components/typography";

export default function PublicLayout() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-muted px-4 dark:bg-background">
      <header>
        <div className="flex h-14 items-center sm:container">
          <div className="flex-1">
            <Logo />
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
