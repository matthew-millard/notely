import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { requireUserId } from '~/.server/auth';
import { prisma } from '~/.server/db';
import { ParamsSchema } from './$noteId';

export async function action({ request, params }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const validRouteParams = ParamsSchema.parse(params);

  if (userId !== validRouteParams.userId) {
    throw new Response('Not authorised', {
      status: 401,
    });
  }

  try {
    const [deletedNote, mostRecenetNote] = await prisma.$transaction([
      prisma.note.delete({
        where: {
          id: validRouteParams.noteId,
        },
      }),

      prisma.note.findFirst({
        where: {
          userId,
          NOT: {
            id: validRouteParams.noteId,
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
        select: {
          id: true,
        },
      }),
    ]);

    if (!deletedNote) {
      throw new Response('Note note found', { status: 404 });
    }

    return redirect(mostRecenetNote ? `/${userId}/notes/${mostRecenetNote.id}` : `/${userId}`);
  } catch (error) {
    console.error('Failed to delete note:', error);
    if (error instanceof Response) {
      throw error;
    }

    if (error instanceof Error) {
      throw new Response(error.message, {
        status: 500,
        statusText: error.name,
      });
    }

    throw new Response('An unexpected error occurred', {
      status: 500,
    });
  }
}

export async function loader() {
  throw redirect('/');
}
