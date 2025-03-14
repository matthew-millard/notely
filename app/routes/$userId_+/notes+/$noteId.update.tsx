import { randomUUID } from 'node:crypto';
import { parseWithZod } from '@conform-to/zod';
import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { requireUserId } from '~/.server/auth';
import { prisma } from '~/.server/db';
import { setToastCookie, toastSessionStorage } from '~/.server/toast';
import { ParamsSchema, UpdateNoteSchema } from './$noteId';

export async function action({ request, params }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();

  const submission = parseWithZod(formData, {
    schema: UpdateNoteSchema,
  });

  if (submission.status !== 'success') {
    return json(submission.reply());
  }

  const { content, noteId, title } = submission.value;

  const validRouteParams = ParamsSchema.parse(params);
  if (validRouteParams.noteId !== noteId || validRouteParams.userId !== userId) {
    throw new Response('Not authorized', {
      status: 401,
    });
  }

  const updatedNote = await prisma.note.update({
    where: {
      id: noteId,
      AND: {
        userId,
      },
    },
    data: {
      title,
      content,
    },
  });

  //   Fix error handling, currently just redirect to /:userId and doesn't display error toast or form error
  if (!updatedNote) {
    const toastSession = await setToastCookie(request, {
      id: randomUUID(),
      title: 'Failed to update note',
      description: 'Unexpected server error occurred.',
      type: 'error',
    });
    return json(
      submission.reply({
        formErrors: ['Unexpected server error occurred.'],
      }),
      {
        status: 500,
        headers: {
          'Set-Cookie': await toastSessionStorage.commitSession(toastSession),
        },
      }
    );
  }

  const toastSession = await setToastCookie(request, {
    id: randomUUID(),
    title: 'Note updated',
    description: 'Your note has been updated successfully.',
    type: 'success',
  });

  return json(
    { success: true },
    {
      headers: {
        'Set-Cookie': await toastSessionStorage.commitSession(toastSession),
      },
    }
  );
}

export async function loader() {
  throw redirect('/');
}
