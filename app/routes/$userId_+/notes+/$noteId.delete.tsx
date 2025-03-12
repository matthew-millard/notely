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
    await prisma.note.delete({
      where: {
        id: validRouteParams.noteId,
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        notes: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    let redirectUrl;

    if (user?.notes && user.notes.length > 0) {
      redirectUrl = `/${userId}/notes/${user?.notes[0].id}`;
    } else {
      redirectUrl = `/${userId}`;
    }

    return redirect(redirectUrl);
  } catch (error) {
    throw new Response('Note not found', {
      status: 404,
    });
  }
}

export async function loader() {
  throw redirect('/');
}
