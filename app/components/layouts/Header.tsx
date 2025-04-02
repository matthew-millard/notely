// import { useFetcher } from '@remix-run/react';
import { useState } from 'react';
import { useKbdShortcut, useOptionalUser } from '~/hooks';
// import { type SearchResults } from '~/routes/$userId_+/search';
import { formatInitials, timeAgo } from '~/utils';
import { LogOutForm } from '../forms';
import { Logo } from '../typography';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandTrigger,
  EditProfile,
  HamburgerMenuToggle,
} from '../ui';
import Drawer from './Drawer';

export default function Header() {
  const user = useOptionalUser();
  // const search = useFetcher<SearchResults>();
  // const data = search?.data;
  // No longer need to query the database, just grab all the users notes and use the command components from shadcn to filter through them.
  const notes = user?.notes;
  // Grab top three most recently edited notes - they are coming back from the database in descending order based on last updated
  const mostRecentNotes = notes?.slice(0, 3);

  const allRemainingNotes = notes?.slice(3);

  const [isCommandDialogOpen, setIsCommandDialogOpen] = useState(false);
  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // const [query, setQuery] = useState('');

  useKbdShortcut('k', setIsCommandDialogOpen);
  const commandTriggerProps = { isCommandDialogOpen, setIsCommandDialogOpen };
  const drawerProps = { isDrawerOpen, setIsDrawerOpen };

  // useEffect(() => {
  //   if (!isCommandDialogOpen) {
  //     setQuery('');
  //   }
  // }, [isCommandDialogOpen]);

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
            <CommandInput placeholder="Search notes..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              {mostRecentNotes && mostRecentNotes.length > 0 && (
                <CommandGroup heading="Most Recent">
                  {mostRecentNotes.map(note => (
                    <CommandItem
                      key={note.id}
                      onSelect={() => {
                        setIsCommandDialogOpen(false);
                        window.location.href = `/${user?.id}/notes/${note.id}`;
                      }}
                    >
                      <div className="flex justify-between w-full">
                        <span className="font-semibold">{note.title}</span>
                        <span className="text-xs text-muted-foreground">{timeAgo(new Date(note.updatedAt))}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {allRemainingNotes && allRemainingNotes.length > 0 && (
                <CommandGroup heading="More...">
                  {allRemainingNotes?.map(note => (
                    <CommandItem
                      key={note.id}
                      onSelect={() => {
                        setIsCommandDialogOpen(false);
                        window.location.href = `/${user?.id}/notes/${note.id}`;
                      }}
                    >
                      <div className="flex justify-between w-full">
                        <span className="font-semibold">{note.title}</span>
                        <span className="text-xs text-muted-foreground">{timeAgo(new Date(note.updatedAt))}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </CommandDialog>

          <nav className="hidden items-center gap-x-2 md:flex">
            <EditProfile
              isEditProfileDialogOpen={isEditProfileDialogOpen}
              setIsEditProfileDialogOpen={setIsEditProfileDialogOpen}
            />
            <button type="button" onClick={() => setIsEditProfileDialogOpen(true)}>
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
            </button>
            <LogOutForm />
          </nav>
        </div>
      </div>
    </header>
  );
}
