import { useFetcher } from '@remix-run/react';
import { useState } from 'react';
import { useKbdShortcut, useOptionalUser } from '~/hooks';
import { formatInitials } from '~/utils';
import { LogOutForm } from '../forms';
import { Logo } from '../typography';
import { Avatar, AvatarFallback, AvatarImage, CommandTrigger, HamburgerMenuToggle } from '../ui';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/Command';
import Drawer from './Drawer';

export default function Header() {
  const user = useOptionalUser();
  const search = useFetcher();
  const [isCommandDialogOpen, setIsCommandDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
          <CommandDialog open={isCommandDialogOpen} onOpenChange={setIsCommandDialogOpen}>
            <search.Form role="search">
              <CommandInput
                placeholder="Search notes..."
                value={searchQuery}
                onValueChange={value => {
                  setSearchQuery(value);
                  search.submit({ query: value }, { method: 'GET', action: `/${user?.id}/search` });
                }}
              />
            </search.Form>
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Results">
                <CommandItem>Calendar</CommandItem>
                <CommandItem>Search Emoji</CommandItem>
                <CommandItem>Calculator</CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandDialog>
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
