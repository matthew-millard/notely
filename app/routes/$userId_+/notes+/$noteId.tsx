import { json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { z } from 'zod';
import { requireUserId } from '~/.server/auth';
import { prisma } from '~/.server/db';
import { H4, P } from '~/components/typography';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const validRouteParams = z
    .object({
      userId: z.string(),
      noteId: z.string(),
    })
    .parse(params);

  if (userId !== validRouteParams.userId) {
    throw new Response('Not authorised', {
      status: 401,
    });
  }

  const note = await prisma.note.findUnique({
    where: {
      id: params.noteId,
    },
  });

  if (!note) {
    throw new Error('No note found');
  }

  return json({ note });
}

export default function NoteRoute() {
  const { note } = useLoaderData<typeof loader>();
  return (
    <div>
      <H4>{note.title}</H4>
      <P>{note.content}</P>
    </div>
  );
}
