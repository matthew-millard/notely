import { json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { requireUserId } from '~/.server/auth';
import { prisma } from '~/.server/db';
import { H4, P } from '~/components/typography';

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireUserId(request);
  // Todo: Check for invariant userId and params.userId

  console.log('params noteId', params.noteId);

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
