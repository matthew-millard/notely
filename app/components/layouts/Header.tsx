import { useState } from 'react';
import { useKbdShortcut, useOptionalUser } from '~/hooks';
import { formatInitials } from '~/utils';
import { LogOutForm } from '../forms';
import { Logo } from '../typography';
import { Avatar, AvatarFallback, AvatarImage, CommandTrigger, HamburgerMenuToggle } from '../ui';
import Drawer from './Drawer';

export default function Header() {
  const user = useOptionalUser();
  const [isCommandDialogOpen, setIsCommandDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useKbdShortcut('k', setIsCommandDialogOpen);
  const commandTriggerProps = { isCommandDialogOpen, setIsCommandDialogOpen };
  const drawerProps = { isDrawerOpen, setIsDrawerOpen };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <div className="mr-12">
            <Logo />
          </div>
        </div>
        <div className="mr-4 md:hidden">
          <HamburgerMenuToggle {...drawerProps} />
          <Drawer {...drawerProps} />
        </div>
        <div className="flex flex-1 items-center justify-between gap-2 md:justify-end">
          <CommandTrigger {...commandTriggerProps} />
          <nav className="hidden items-center gap-x-2 md:flex">
            <Avatar>
              {user?.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} />
              ) : (
                <AvatarFallback>
                  {formatInitials({
                    firstName: user?.firstName ?? '',
                    lastName: user?.lastName ?? '',
                  })}
                </AvatarFallback>
              )}
            </Avatar>
            <LogOutForm />
          </nav>
        </div>
      </div>
    </header>
  );
}
