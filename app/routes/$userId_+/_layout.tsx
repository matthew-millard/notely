import { TrashIcon } from '@radix-ui/react-icons';
import { json, LoaderFunctionArgs } from '@remix-run/node';
import { Form, Link, NavLink, Outlet, useLoaderData, useNavigation } from '@remix-run/react';
import { PenSquareIcon } from 'lucide-react';
import { requireUserId } from '~/.server/auth';
import { prisma } from '~/.server/db';
import { Footer, Header } from '~/components/layouts';
import { H4 } from '~/components/typography';
import { Tooltip } from '~/components/ui';
import { classNames as cn } from '~/utils';

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const notes = await prisma.note.findMany({
    where: {
      userId,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return json({ userId, notes });
}

export default function UserDashboardLayout() {
  const { userId, notes } = useLoaderData<typeof loader>();

  const navigation = useNavigation();

  const isDeleting = (noteId: string) => {
    return navigation.state && navigation.formAction?.includes(`/${noteId}/delete`);
  };

  return (
    <div className="relative">
      <Header />
      <main className="flex flex-col flex-1 min-h-svh">
        <div className="mx-auto w-full container border-x">
          <div className="flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
            <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 border-r md:sticky md:block">
              <div className="h-full overflow-auto py-3 pr-4">
                <div className="flex w-full">
                  <Link to={`/${userId}/notes/new`} prefetch="intent" className="ml-auto">
                    <Tooltip label="New note" side="bottom">
                      <PenSquareIcon className="h-5 w-5" />
                    </Tooltip>
                  </Link>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-1">
                    <H4>My Notes</H4>
                    <div className="grid grid-flow-row auto-rows-max gap-0.5 text-sm">
                      {notes?.map(note => (
                        <div key={note.id} className="relative">
                          <NavLink
                            to={`/${userId}/notes/${note.id}`}
                            prefetch="intent"
                            className={({ isActive }) =>
                              cn(
                                'group relative flex h-8 w-full items-center rounded-md px-2 after:absolute after:inset-x-0 after:inset-y-[-2px] after:rounded-lg hover:bg-accent hover:text-accent-foreground font-medium',
                                isActive ? 'bg-accent text-accent-foreground' : '',
                                isDeleting(note.id) ? 'opacity-50' : ''
                              )
                            }
                          >
                            <span className="line-clamp-1 w-full">{note.title}</span>
                          </NavLink>
                          <Form
                            method="POST"
                            action={`/${userId}/notes/${note.id}/delete`}
                            className="absolute right-2 top-[5px]"
                          >
                            <button
                              type="submit"
                              disabled={isDeleting(note.id)}
                              className={cn(
                                'bg-transparent p-1 rounded-full hover:bg-destructive hover:text-destructive-foreground',
                                isDeleting(note.id) ? 'cursor-not-allowed opacity-50' : ''
                              )}
                            >
                              <TrashIcon />
                            </button>
                          </Form>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </aside>
            <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px] h-full">
              <div className="mx-auto w-full min-w-0 max-w-2xl">
                <Outlet />
              </div>
              <div className="hidden text-sm xl:block"></div>
            </main>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
