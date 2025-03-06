import { json, LoaderFunctionArgs } from '@remix-run/node';
import { NavLink, Outlet, useLoaderData } from '@remix-run/react';
import { requireUserId } from '~/.server/auth';
import { prisma } from '~/.server/db';
import { Footer, Header } from '~/components/layouts';
import { H4 } from '~/components/typography';
import { classNames as cn } from '~/utils';

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const notes = await prisma.note.findMany({
    where: {
      userId,
    },
  });

  return json({ userId, notes });
}

export default function UserDashboardLayout() {
  const { userId, notes } = useLoaderData<typeof loader>();
  return (
    <div className="relative">
      <Header />
      <main className="flex flex-col flex-1 min-h-svh">
        <div className="mx-auto w-full container border-x">
          <div className="flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
            <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 border-r md:sticky md:block">
              <div className="h-full overflow-auto py-6 pr-4 lg:py-8">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-1">
                    <H4>My Notes</H4>
                    <div className="grid grid-flow-row auto-rows-max gap-0.5 text-sm">
                      {notes?.map(note => (
                        <NavLink
                          key={note.id}
                          to={`/${userId}/notes/${note.id}`}
                          prefetch="intent"
                          className={({ isActive }) =>
                            cn(
                              'group relative flex h-8 w-full items-center rounded-md px-2 after:absolute after:inset-x-0 after:inset-y-[-2px] after:rounded-lg hover:bg-accent hover:text-accent-foreground font-medium',
                              isActive ? 'bg-accent text-accent-foreground' : ''
                            )
                          }
                        >
                          <span className="line-clamp-1 w-full">{note.title}</span>
                        </NavLink>
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
