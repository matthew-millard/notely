import { json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { PenIcon } from 'lucide-react';
import { z } from 'zod';
import { requireUserId } from '~/.server/auth';
import { prisma } from '~/.server/db';
import { H4, P } from '~/components/typography';
import { Button, Tooltip } from '~/components/ui';

// Todo - figure out where this should live
export const ParamsSchema = z.object({
  userId: z.string(),
  noteId: z.string(),
});

export async function loader({ request, params }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const validRouteParams = ParamsSchema.parse(params);

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
      <div className="flex gap-x-2 group">
        <Tooltip label="Edit note" side="top" sideOffset={10}>
          <Button variant="ghost" size="icon" className="p-2">
            <PenIcon className="group-hover:text-muted-foreground text-transparent" />
          </Button>
        </Tooltip>
        <div className="space-y-6">
          <H4>{note.title}</H4>
          <div className="space-y-4">
            {note.content.split('\n\n').map((paragraph, index) => (
              <P key={index} className="whitespace-pre-line">
                {paragraph}
              </P>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
