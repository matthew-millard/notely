import { ExitIcon } from '@radix-ui/react-icons';
import { Form, Link, NavLink, useRouteLoaderData } from '@remix-run/react';
import { ArrowRightIcon } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { useOptionalUser } from '~/hooks';
import { loader } from '~/routes/$userId_+/_layout';
import { classNames as cn, formatInitials, timeAgo } from '~/utils';
import { Logo } from '../typography';
import {
  Drawer as DrawerRoot,
  DrawerPortal,
  DrawerOverlay,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerHeader,
  DrawerSeparator,
  Avatar,
  AvatarImage,
  AvatarFallback,
  DrawerFooter,
  Button,
} from '../ui';
import ThemeSwitch from '../ui/ThemeSwitch';

export interface DrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Drawer({ isDrawerOpen, setIsDrawerOpen }: DrawerProps) {
  const data = useRouteLoaderData<typeof loader>('routes/$userId_+/_layout');
  const user = useOptionalUser();

  return (
    <DrawerRoot open={isDrawerOpen} onOpenChange={open => setIsDrawerOpen(open)}>
      <DrawerPortal>
        <DrawerOverlay />
        {user ? (
          <DrawerContent className="max-h-[80vh] flex flex-col">
            <DrawerHeader>
              <DrawerTitle>My notes</DrawerTitle>
              <DrawerDescription>Choose a different note.</DrawerDescription>
            </DrawerHeader>

            <nav className="flex flex-col overflow-y-auto flex-1 px-4 pb-2 space-y-1">
              {data?.notes.map(note => (
                <NavLink
                  to={`/${data.userId}/notes/${note.id}`}
                  key={note.id}
                  prefetch="intent"
                  onClick={() => setIsDrawerOpen(false)}
                  className={({ isActive }) =>
                    cn('p-4 font-medium hover:bg-accent rounded-sm', isActive ? 'bg-accent text-accent-foreground' : '')
                  }
                >
                  <p className="flex justify-between h-full items-center">
                    {note.title}{' '}
                    <span className="text-xs text-muted-foreground">{timeAgo(new Date(note.updatedAt))}</span>
                  </p>
                </NavLink>
              ))}
            </nav>

            <DrawerSeparator />
            <DrawerFooter>
              <div className="flex justify-between h-full items-center">
                <div className="flex h-full items-center gap-x-2">
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
                  <p className="text-sm">{`${user?.firstName} ${user?.lastName}`}</p>
                </div>
                <Form method="POST" action="/logout">
                  <Button variant="ghost" size="sm">
                    <ExitIcon />
                    Log out
                  </Button>
                </Form>
              </div>
            </DrawerFooter>
          </DrawerContent>
        ) : (
          <DrawerContent className="max-h-[80vh] flex flex-col px-3 space-y-3">
            <DrawerHeader>
              <DrawerTitle>
                <Logo />
              </DrawerTitle>
              <DrawerDescription>Welcome to Notely</DrawerDescription>
            </DrawerHeader>
            <nav className="flex flex-col gap-y-3 ">
              <Link to="/sign-up" prefetch="render">
                <Button className="w-full">Sign up</Button>
              </Link>
              <Link to="/login" prefetch="render">
                <Button variant="secondary" className="w-full">
                  Log in <ArrowRightIcon />{' '}
                </Button>
              </Link>
            </nav>
            <ThemeSwitch />
          </DrawerContent>
        )}
      </DrawerPortal>
    </DrawerRoot>
  );
}
