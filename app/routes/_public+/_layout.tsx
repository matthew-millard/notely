import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Link, Outlet } from "@remix-run/react";
import { useState } from "react";
import { Drawer, Footer } from "~/components/layouts";
import { Logo } from "~/components/typography";
import { Button, HamburgerMenuToggle } from "~/components/ui";

export default function PublicLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerProps = { isDrawerOpen, setIsDrawerOpen };
  return (
    <div className="flex min-h-dvh w-full flex-col bg-muted px-4 dark:bg-background">
      <header>
        <div className="flex h-14 items-center sm:container">
          <div className="flex-1">
            <Logo />
          </div>

          {/* Mobile */}
          <div className="md:hidden">
            <HamburgerMenuToggle {...drawerProps} />
            <Drawer {...drawerProps} />
          </div>

          {/* Desktop */}
          <nav className="hidden items-center gap-x-2 md:flex">
            <Link to="/sign-up" prefetch="intent">
              <Button>Sign up</Button>
            </Link>
            <Link to="/login" prefetch="intent">
              <Button variant="ghost">
                Log in <ArrowRightIcon />{" "}
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <Outlet />

      <Footer />
    </div>
  );
}
