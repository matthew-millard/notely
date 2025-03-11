import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { requireUserId } from '~/.server/auth';
import { prisma } from '~/.server/db';
import { setToastCookie, toastSessionStorage } from '~/.server/toast';
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

    const toastSession = await setToastCookie(request, {
      id: crypto.randomUUID(),
      title: 'Note deleted',
      description: 'Your note has been permanently removed',
      type: 'success',
    });

    return redirect(`/${userId}`, {
      headers: {
        'Set-Cookie': await toastSessionStorage.commitSession(toastSession),
      },
    });
  } catch (error) {
    throw new Response('Note not found', {
      status: 404,
    });
  }
}

export async function loader() {
  throw redirect('/');
}
