import { ExitIcon } from '@radix-ui/react-icons';
import { Form, NavLink, useRouteLoaderData } from '@remix-run/react';
import { Dispatch, SetStateAction } from 'react';
import { useOptionalUser } from '~/hooks';
import { loader } from '~/routes/$userId_+/_layout';
import { classNames as cn, formatInitials, timeAgo } from '~/utils';
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
        <DrawerContent className="h-[80vh] flex flex-col">
          <DrawerHeader>
            <DrawerTitle>My notes</DrawerTitle>
            <DrawerDescription>Choose a different note.</DrawerDescription>
          </DrawerHeader>

          <nav className="flex flex-col overflow-y-auto flex-1 px-4">
            {data?.notes.map(note => (
              <NavLink
                to={`/${data.userId}/notes/${note.id}`}
                key={note.id}
                prefetch="intent"
                onClick={() => setIsDrawerOpen(false)}
                className={({ isActive }) =>
                  cn('p-4 font-medium', isActive ? 'bg-accent text-accent-foreground rounded-sm' : '')
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
                <p className="text-sm">Matt Millard</p>
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
      </DrawerPortal>
    </DrawerRoot>
  );
}
