import { ArrowRightIcon } from '@radix-ui/react-icons';
import { Link, Outlet } from '@remix-run/react';
import { useState } from 'react';
import { Drawer, Footer } from '~/components/layouts';
import { Logo } from '~/components/typography';
import { Button, HamburgerMenuToggle } from '~/components/ui';
import ThemeSwitch from '~/components/ui/ThemeSwitch';
import { useOptionalUser } from '~/hooks';

export default function PublicLayout() {
  const user = useOptionalUser();
  const isLoggedIn = user !== null;
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
          <div className="md:hidden flex gap-2">
            <ThemeSwitch />
            <HamburgerMenuToggle {...drawerProps} />
            <Drawer {...drawerProps} />
          </div>

          {/* Desktop */}
          {isLoggedIn ? null : (
            <nav className="hidden items-center gap-x-2 md:flex">
              <Link to="/sign-up" prefetch="intent">
                <Button>Sign up</Button>
              </Link>
              <Link to="/login" prefetch="intent">
                <Button variant="ghost">
                  Log in <ArrowRightIcon />{' '}
                </Button>
              </Link>
            </nav>
          )}
        </div>
      </header>

      <div className="flex flex-1">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}
