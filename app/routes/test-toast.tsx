import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { useId } from 'react';
import { z } from 'zod';
import { setToastCookie, toastSessionStorage } from '~/.server/toast';
import { Button } from '~/components/ui';
import { type ToastProps } from '~/components/ui/Toast';

const TestToastSchema = z.object({
  id: z.string().or(z.number()),
  type: z.enum(['default', 'success', 'error', 'info']),
  title: z.string(),
  description: z.string(),
}) satisfies z.ZodType<ToastProps>;

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema: TestToastSchema });

  if (submission.status !== 'success') {
    return json(submission.reply({ formErrors: ['Invalid submission'] }), {
      status: 400,
    });
  }

  const toastCookieSession = await setToastCookie(request, submission.value);

  return redirect('/test-toast', {
    headers: {
      'Set-Cookie': await toastSessionStorage.commitSession(toastCookieSession),
    },
  });
}

export default function TestToastRoute() {
  const [form, fields] = useForm({
    id: 'test-toast-form',
    constraint: getZodConstraint(TestToastSchema),
    defaultValue: {
      id: useId(),
      type: 'default',
      title: 'Welcome back!',
      description: 'You have successfully logged in.',
    },
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: TestToastSchema });
    },
  });
  return (
    <main className="flex w-full justify-center items-center min-h-svh">
      <Form method="POST" {...getFormProps(form)}>
        <input {...getInputProps(fields.id, { type: 'hidden' })} />
        <input {...getInputProps(fields.type, { type: 'hidden' })} />
        <input {...getInputProps(fields.title, { type: 'hidden' })} />
        <input {...getInputProps(fields.description, { type: 'hidden' })} />
        <Button type="submit" variant={'secondary'}>
          Render toast
        </Button>
      </Form>
    </main>
  );
}
