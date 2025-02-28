import { json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { H4, P } from '~/components/typography';
import { notes } from '../_layout';

export async function loader({ params }: LoaderFunctionArgs) {
  const note = notes.find(note => note.id === params.noteId);

  if (!note) {
    throw new Response('Note not found', {
      status: 404,
      statusText: 'Not found',
    });
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
