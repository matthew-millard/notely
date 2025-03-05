import { getFormProps, getInputProps, getTextareaProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { Form, useActionData, useRouteLoaderData } from '@remix-run/react';
import { LoaderCircle } from 'lucide-react';
import { z } from 'zod';
import { requireUserId } from '~/.server/auth';
import { prisma } from '~/.server/db';
import { setToastCookie, toastSessionStorage } from '~/.server/toast';
import { Button, FieldError, Input, Label } from '~/components/ui';
import { useIsPending } from '~/hooks';
import { loader } from '../_layout';

const newNoteSchema = z.object({
  title: z.string().trim().min(1, { message: 'Title must be longer than 1 character' }).max(50),
  content: z.string().trim().min(1, { message: 'Note must be longer than 1 character' }).max(5000),
});

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema: newNoteSchema,
  });

  if (submission.status !== 'success') {
    return json(submission.reply(), {
      status: submission.status === 'error' ? 400 : 200,
    });
  }

  const { content, title } = submission.value;

  const note = await prisma.note.create({
    data: {
      title,
      content,
      userId,
    },
  });

  const toastSession = await setToastCookie(request, {
    id: 'new-note-toast',
    title: 'Note saved',
    description: 'Your note has been successfully created',
    type: 'success',
  });

  return redirect(`/${userId}/notes/${note.id}`, {
    headers: {
      'Set-Cookie': await toastSessionStorage.commitSession(toastSession),
    },
    status: 200,
  });
}

export default function NewNotesRoute() {
  const data = useRouteLoaderData<typeof loader>('routes/$userId_+/_layout');
  const userId = data?.userId;
  const formAction = `/${userId}/notes/new`;
  const isPending = useIsPending({ formAction });

  const [form, fields] = useForm({
    id: 'new-note-form',
    lastResult: useActionData<typeof action>(),
    constraint: getZodConstraint(newNoteSchema),
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: newNoteSchema });
    },
  });

  return (
    <Form method="POST" action={formAction} {...getFormProps(form)} className="relative flex flex-col space-y-1">
      <Label htmlFor={fields.content.id} className="sr-only">
        Title
      </Label>
      <Input
        autoFocus
        {...getInputProps(fields.title, { type: 'text' })}
        placeholder="Title"
        className="absolute inset-0 rounded-b-none"
      />
      <Label htmlFor={fields.content.id} className="sr-only">
        Note
      </Label>
      <textarea
        {...getTextareaProps(fields.content)}
        rows={10}
        cols={1}
        placeholder="Write a note..."
        className="pt-10 border-input placeholder:text-muted-foreground focus-visible:ring-ring aria-[invalid]:ring-foreground-destructive w-full rounded-md border bg-transparent px-3 leading-7 py-2 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
      />
      <FieldError field={fields.title} />
      <Button className="w-20 self-end">{isPending ? <LoaderCircle className="animate-spin" /> : 'Save'}</Button>
    </Form>
  );
}
