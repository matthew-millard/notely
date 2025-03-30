import { Link, useFetcher } from '@remix-run/react';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useKbdShortcut, useOptionalUser } from '~/hooks';
import { type SearchResults } from '~/routes/$userId_+/search';
import { formatInitials } from '~/utils';
import { LogOutForm } from '../forms';
import { Logo } from '../typography';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  CommandTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  EditProfile,
  HamburgerMenuToggle,
} from '../ui';
import Drawer from './Drawer';

export default function Header() {
  const inputRef = useRef<HTMLInputElement>(null);
  const user = useOptionalUser();
  const search = useFetcher<SearchResults>();
  const data = search?.data;

  const [isCommandDialogOpen, setIsCommandDialogOpen] = useState(false);
  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [query, setQuery] = useState('');

  useKbdShortcut('k', setIsCommandDialogOpen);
  const commandTriggerProps = { isCommandDialogOpen, setIsCommandDialogOpen };
  const drawerProps = { isDrawerOpen, setIsDrawerOpen };

  useEffect(() => {
    // Reset query to an empty string everytime the dialog is closed
    if (!isCommandDialogOpen) {
      setQuery('');
    }
  }, [isCommandDialogOpen]);

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
          <Dialog open={isCommandDialogOpen} onOpenChange={setIsCommandDialogOpen}>
            <DialogTitle className="sr-only" title="Search" />
            <DialogDescription className="sr-only">Search for a note</DialogDescription>
            <DialogContent className="!top-[5%] !translate-y-0 overflow-hidden">
              <search.Form className="flex items-center border-b px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <input
                  type="search"
                  placeholder="Search notes"
                  autoFocus
                  ref={inputRef}
                  value={query}
                  onChange={event => {
                    setQuery(event.target.value);
                    search.submit({ query: event.target.value }, { action: `/${user?.id}/search` });
                  }}
                  className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                />
              </search.Form>
              {query.length > 0 && data?.results ? (
                <ul className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                  {data.results.length > 0 ? (
                    data.results.map(note => (
                      <Link
                        prefetch="intent"
                        onClick={() => {
                          setQuery('');
                          setIsCommandDialogOpen(false);
                        }}
                        to={`/${user?.id}/notes/${note.id}`}
                        key={note.id}
                      >
                        <li className="px-3 py-1.5 text-sm rounded-sm bg-transparent hover:bg-accent text-accent-foreground outline-none">
                          {note.title}
                        </li>
                      </Link>
                    ))
                  ) : (
                    <p className="py-6 text-center text-sm">No results found.</p>
                  )}
                </ul>
              ) : null}
            </DialogContent>
          </Dialog>

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
