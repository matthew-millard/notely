import { ExitIcon, TrashIcon } from '@radix-ui/react-icons';
import { Form, Link, NavLink, useRouteLoaderData } from '@remix-run/react';
import { ArrowRightIcon } from 'lucide-react';
import React, { Dispatch, SetStateAction, useState } from 'react';
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
  Dialog,
  DialogHeader,
  DialogContent,
  EditProfile,
} from '../ui';
// import ThemeSwitch from '../ui/ThemeSwitch';

export interface DrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Drawer({ isDrawerOpen, setIsDrawerOpen }: DrawerProps) {
  const data = useRouteLoaderData<typeof loader>('routes/$userId_+/_layout');
  const user = useOptionalUser();
  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false);
  const [isDeleteNoteDialogOpen, setIsDeleteNoteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [swipingNote, setSwipingNote] = useState<{
    id: string;
    startX: number;
    currentX: number;
  } | null>(null);

  const hasNotes = data && data.notes.length > 0 ? true : false;

  const deleteNoteFormAction = `/${user?.id}/notes/${noteToDelete}/delete`;

  const handleTouch = (event: React.TouchEvent<HTMLAnchorElement>, noteId: string) => {
    switch (event.type) {
      case 'touchstart':
        {
          setSwipingNote({
            id: noteId,
            startX: event.touches[0].screenX,
            currentX: event.touches[0].screenX,
          });
        }
        break;

      case 'touchmove':
        if (swipingNote?.id === noteId) {
          setSwipingNote(prev => (prev ? { ...prev, currentX: event.touches[0].screenX } : null));
        }
        break;

      case 'touchend':
        if (swipingNote?.id === noteId) {
          const swipeDistance = swipingNote.startX - swipingNote.currentX;

          if (swipeDistance >= 100) {
            setNoteToDelete(noteId);
            setIsDeleteNoteDialogOpen(true);
          }

          setSwipingNote(null);
        }
        break;
    }
  };

  const getSwipeTransform = (noteId: string) => {
    if (!swipingNote || swipingNote.id !== noteId) {
      return 'translateX(0)';
    }
    const diff = swipingNote.startX - swipingNote.currentX;
    return `translateX(-${Math.min(diff, 100)}px)`;
  };

  return (
    <DrawerRoot open={isDrawerOpen} onOpenChange={open => setIsDrawerOpen(open)}>
      <Dialog open={isDeleteNoteDialogOpen} onOpenChange={setIsDeleteNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <h2 className="text-lg font-semibold">Delete Note</h2>
          </DialogHeader>
          <p className="text-foreground">Are you sure you want to delete this note? This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="ghost"
              onClick={() => {
                setIsDeleteNoteDialogOpen(false);
                setNoteToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Form
              method="POST"
              action={deleteNoteFormAction}
              onSubmit={() => {
                setIsDeleteNoteDialogOpen(false);
                setIsDrawerOpen(false);
              }}
            >
              <Button variant="destructive" type="submit">
                Delete
              </Button>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
      <DrawerPortal>
        <DrawerOverlay />
        {user ? (
          <DrawerContent className="max-h-[80vh] flex flex-col">
            <DrawerHeader>
              <DrawerTitle>My notes</DrawerTitle>
              <DrawerDescription className="sr-only">List of all notes</DrawerDescription>
              <p className="text-sm text-muted-foreground">{hasNotes ? '← swipe to delete a note' : ''}</p>
            </DrawerHeader>

            <nav className="flex flex-col overflow-y-auto flex-1 px-4 pb-2 space-y-1">
              {hasNotes ? (
                data?.notes.map(note => (
                  <div key={note.id} className="relative">
                    <div className="absolute inset-0 bg-destructive text-destructive-foreground rounded-sm flex items-center justify-end pr-8">
                      <TrashIcon className="h-5 w-5" />
                    </div>
                    <NavLink
                      to={`/${data.userId}/notes/${note.id}`}
                      prefetch="intent"
                      onClick={() => setIsDrawerOpen(false)}
                      onTouchStart={event => handleTouch(event, note.id)}
                      onTouchMove={event => handleTouch(event, note.id)}
                      onTouchEnd={event => handleTouch(event, note.id)}
                      style={{
                        transform: getSwipeTransform(note.id),
                      }}
                      className={({ isActive }) =>
                        cn(
                          'p-4 font-medium hover:bg-accent rounded-sm block bg-background transition-transform',
                          isActive ? 'bg-accent text-accent-foreground' : ''
                        )
                      }
                    >
                      <p className="flex justify-between h-full items-center">
                        {note.title}{' '}
                        <span className="text-xs text-muted-foreground">{timeAgo(new Date(note.updatedAt))}</span>
                      </p>
                    </NavLink>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground italic pb-2">You currently don&apos;t have any notes</p>
              )}
            </nav>

            <DrawerSeparator />
            <DrawerFooter>
              <div className="flex justify-between h-full items-center">
                <EditProfile
                  isEditProfileDialogOpen={isEditProfileDialogOpen}
                  setIsEditProfileDialogOpen={setIsEditProfileDialogOpen}
                />
                <button
                  type="button"
                  onClick={() => setIsEditProfileDialogOpen(true)}
                  className="flex h-full items-center gap-x-2"
                >
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
                </button>

                <div className="flex gap-x-1">
                  {/* <ThemeSwitch /> */}
                  <Form method="POST" action="/logout">
                    <Button variant="ghost" size="sm">
                      <ExitIcon />
                      Log out
                    </Button>
                  </Form>
                </div>
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
            <nav className="flex flex-col gap-y-3 pb-6">
              <Link to="/sign-up" prefetch="render">
                <Button className="w-full">Sign up</Button>
              </Link>
              <Link to="/login" prefetch="render">
                <Button variant="secondary" className="w-full">
                  Log in <ArrowRightIcon />{' '}
                </Button>
              </Link>
            </nav>
          </DrawerContent>
        )}
      </DrawerPortal>
    </DrawerRoot>
  );
}
