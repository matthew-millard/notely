import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { z } from 'zod';
import { createAccount, requireAnonymous } from '~/.server/auth';
import { SESSION_KEY } from '~/.server/config';
import { getCookie, getSession, sessionStorage } from '~/.server/session';
import { verifySessionStorage } from '~/.server/verification';
import { Button, FieldError, Input, Label } from '~/components/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/Card';
import { useDelayedIsPending } from '~/hooks';
import { FirstNameSchema, LastNameSchema, PasswordSchema } from '~/utils/schemas';
import { TARGET_QUERY_PARAM } from './verify';

const CompleteProfileSchema = z
  .object({
    firstName: FirstNameSchema,
    lastName: LastNameSchema,
    password: PasswordSchema,
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

export async function action({ request }: ActionFunctionArgs) {
  await requireAnonymous(request);
  const cookie = getCookie(request);
  const verifySession = await verifySessionStorage.getSession(cookie);
  const email = verifySession.get(TARGET_QUERY_PARAM);

  // email verification cookie has expired or user has not verified their email yet
  if (typeof email !== 'string' || !email) {
    throw redirect('/sign-up');
  }

  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema: CompleteProfileSchema,
  });

  if (submission.status !== 'success') {
    return json(submission.reply({ hideFields: ['password', 'confirmPassword'] }), {
      status: submission.status === 'error' ? 400 : 200,
    });
  }

  const { firstName, lastName, password } = submission.value;

  const session = await createAccount({ email, firstName, lastName, password });

  if (!session) {
    return json(submission.reply({ formErrors: ['An unexpected error occured'] }), { status: 500 });
  }

  const cookieSession = await getSession(request);
  cookieSession.set(SESSION_KEY, session.id);

  const userId = session.userId;

  return redirect(`/${userId}`, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(cookieSession, {
        expires: session.expirationDate,
      }),
    },
  });
}

export default function CompleteProfileRoute() {
  const isPending = useDelayedIsPending();
  const [form, fields] = useForm({
    id: 'complete-profile-form',
    lastResult: useActionData<typeof action>(),
    constraint: getZodConstraint(CompleteProfileSchema),
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: CompleteProfileSchema });
    },
  });

  return (
    <main className="flex-grow mx-auto pb-6 sm:py-32">
      <Card className="w-full sm:px-6">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Complete profile</CardTitle>
          <CardDescription>Lastly, tell us your name and create a password!</CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="POST" {...getFormProps(form)}>
            <fieldset className="grid gap-2 mb-3" disabled={isPending}>
              <Label htmlFor={fields.firstName.id}>First name</Label>
              <Input {...getInputProps(fields.firstName, { type: 'text' })} autoFocus />
              <FieldError field={fields.firstName} />
            </fieldset>

            <fieldset className="grid gap-2 mb-3" disabled={isPending}>
              <Label htmlFor={fields.lastName.id}>Last name</Label>
              <Input {...getInputProps(fields.lastName, { type: 'text' })} />
              <FieldError field={fields.lastName} />
            </fieldset>

            <fieldset className="grid gap-2 mb-3" disabled={isPending}>
              <Label htmlFor={fields.password.id}>Password</Label>
              <Input {...getInputProps(fields.password, { type: 'password' })} autoComplete="off" />
              <FieldError field={fields.password} />
            </fieldset>

            <fieldset className="grid gap-2 mb-6" disabled={isPending}>
              <Label htmlFor={fields.confirmPassword.id}>Confirm Password</Label>
              <Input {...getInputProps(fields.confirmPassword, { type: 'password' })} autoComplete="off" />
              <FieldError field={fields.confirmPassword} />
            </fieldset>

            <Button className="w-full" disabled={isPending}>
              Create account
            </Button>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
