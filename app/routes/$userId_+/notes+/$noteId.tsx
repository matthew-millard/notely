import { getFormProps, getInputProps, getTextareaProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { json, LoaderFunctionArgs } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { LoaderCircle, PenIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { requireUserId } from '~/.server/auth';
import { prisma } from '~/.server/db';
import { H4, P } from '~/components/typography';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FieldError,
  FormErrors,
  Input,
  Label,
  Tooltip,
} from '~/components/ui';
import { useDelayedIsPending } from '~/hooks';
import { NoteSchema } from './new';

export const UpdateNoteSchema = NoteSchema.extend({
  noteId: z.string().trim().min(1),
});

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

  return json({ note, userId });
}

export default function NoteRoute() {
  const { note, userId } = useLoaderData<typeof loader>();
  const fetcher = useFetcher({ key: 'update-note' });
  const updateNoteFormAction = `/${userId}/notes/${note.id}/update`;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  console.log('isDialogOpen', isDialogOpen);
  console.log('fetcher data', fetcher.data);

  const isSubmitting = useDelayedIsPending({ formAction: updateNoteFormAction });

  // FIX This!!!!!!!!
  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.success) {
      // Close dialog
      setIsDialogOpen(false);
      fetcher.submit({ success: false }, { action: `/reset-fetcher`, method: 'POST' });
    }
  }, [fetcher]);

  const [form, fields] = useForm({
    id: 'update-note-form',
    constraint: getZodConstraint(UpdateNoteSchema),
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
    defaultValue: {
      title: note.title,
      content: note.content,
      noteId: note.id,
    },
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: UpdateNoteSchema });
    },
  });
  return (
    <div>
      <div className="group flex items-start gap-x-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger>
            <Tooltip label="Edit note" side="top" sideOffset={10}>
              <PenIcon className="h-8 w-8 hover:bg-accent p-2 hover:text-accent-foreground text-muted-foreground  gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0" />
            </Tooltip>
          </DialogTrigger>
          <DialogContent>
            <fetcher.Form method="POST" action={updateNoteFormAction} {...getFormProps(form)}>
              <Input {...getInputProps(fields.noteId, { type: 'hidden' })} />
              <DialogHeader>
                <DialogTitle>Edit note</DialogTitle>
                <DialogDescription>Make changes to your note here. Click save when you&apos;re done.</DialogDescription>
              </DialogHeader>
              <div className="grid mt-6 mb-3 gap-y-3">
                <div className="grid gap-2">
                  <Label htmlFor={fields.title.id} className="">
                    Title
                  </Label>
                  <Input {...getInputProps(fields.title, { type: 'text' })} autoFocus className="col-span-3" />
                  <FieldError field={fields.title} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={fields.content.id} className="">
                    Content
                  </Label>
                  <textarea
                    {...getTextareaProps(fields.content)}
                    rows={10}
                    cols={1}
                    placeholder="Write a note..."
                    className="border-input placeholder:text-muted-foreground focus-visible:ring-ring aria-[invalid]:ring-foreground-destructive w-full rounded-md border bg-transparent px-3 leading-7 py-2 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 whitespace-pre-wrap"
                  />
                  <FieldError field={fields.content} />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="sm:w-32">
                  {isSubmitting ? <LoaderCircle className="animate-spin" /> : 'Save changes'}
                </Button>
                <FormErrors errorId={form.errorId} errors={form.errors} />
              </DialogFooter>
            </fetcher.Form>
          </DialogContent>
        </Dialog>
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
