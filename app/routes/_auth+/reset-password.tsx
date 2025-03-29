import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import { LoaderCircle } from 'lucide-react';
import { z } from 'zod';
import PasswordResetConfirmation from 'emails/password-reset-confirmation-email';
import { prisma } from '~/.server/db';
import { sendEmail } from '~/.server/email';
import { setToastCookie, toastSessionStorage } from '~/.server/toast';
import { resetPasswordUserSessionKey, verifySessionStorage } from '~/.server/verification';
import { Button, FieldError, FormErrors, Input, Label } from '~/components/ui';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/Card';
import { useIsPending } from '~/hooks';
import { hashPassword } from '~/utils';
import { PasswordSchema } from '~/utils/schemas';

const ResetPasswordSchema = z
  .object({
    newPassword: PasswordSchema,
    confirmPassword: z.string().trim().min(1),
  })
  .refine(({ newPassword, confirmPassword }) => newPassword === confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'], // This will attach the error to the confirmPassword field
  });

export async function loader({ request }: LoaderFunctionArgs) {
  const verifySession = await verifySessionStorage.getSession(request.headers.get('cookie'));
  const user = verifySession.get(resetPasswordUserSessionKey);

  if (!user) {
    throw redirect('/login');
  }

  return json({ user });
}

export async function action({ request }: ActionFunctionArgs) {
  const verifySession = await verifySessionStorage.getSession(request.headers.get('cookie'));
  const user = verifySession.get(resetPasswordUserSessionKey);

  if (!user) {
    throw redirect('/login');
  }

  const formData = await request.formData();

  const submission = parseWithZod(formData, {
    schema: ResetPasswordSchema,
  });

  if (submission.status !== 'success') {
    return json(submission.reply({ formErrors: ['Bad request'], hideFields: ['newPassword', 'confirmPassword'] }), {
      status: submission.status === 'error' ? 400 : 200,
    });
  }

  const { newPassword } = submission.value;

  const hashedPassword = hashPassword(newPassword);

  const userWithUpdatedPassword = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: {
        update: {
          hash: hashedPassword,
        },
      },
    },
  });

  if (!userWithUpdatedPassword) {
    return json(submission.reply({ formErrors: ['Unexpected server error occurred'] }), {
      status: 500,
    });
  }

  // The idea is to log the error but continue with the rest of the password reset flow
  let emailError = false;
  try {
    await sendEmail({
      from: 'Notely <no-reply@notely.ca>',
      reactEmailTemplate: <PasswordResetConfirmation firstName={userWithUpdatedPassword.firstName} />,
      subject: 'You have successfully reset your password',
      to: [userWithUpdatedPassword.email],
    });
  } catch (error) {
    console.error('Failed to send password reset confirmation email:', error);
    emailError = true;
  }

  const toastSession = await setToastCookie(request, {
    id: 'reset-password',
    title: 'Your password has been reset.',
    description: emailError
      ? 'You can now log in with your new password. (Note: Confirmation email could not be sent)'
      : 'You can now log in with your new password.',
    type: 'success',
  });

  const combinedHeaders = new Headers();
  combinedHeaders.append('Set-Cookie', await toastSessionStorage.commitSession(toastSession));
  combinedHeaders.append('Set-Cookie', await verifySessionStorage.destroySession(verifySession));

  return redirect('/login', {
    headers: combinedHeaders,
  });
}

export default function ResetPasswordRoute() {
  const { user } = useLoaderData<typeof loader>();
  const isPending = useIsPending();

  const [form, fields] = useForm({
    id: 'reset-password-form',
    lastResult: useActionData<typeof action>(),
    constraint: getZodConstraint(ResetPasswordSchema),
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ResetPasswordSchema });
    },
  });

  return (
    <Card className="mx-auto mt-44 max-w-sm">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>{`Thank you ${user.firstName} for verifying yourself. Lastly, choose your new password`}</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <Form method="POST" {...getFormProps(form)} className="grid gap-4">
          <div className="grid gap-2">
            <Label id={fields.newPassword.id}>New password</Label>
            <Input {...getInputProps(fields.newPassword, { type: 'password' })} autoFocus />
            <FieldError field={fields.newPassword} />
          </div>
          <div className="grid gap-2">
            <Label id={fields.confirmPassword.id}>Confirm password</Label>
            <Input {...getInputProps(fields.confirmPassword, { type: 'password' })} />
            <FieldError field={fields.confirmPassword} />
          </div>
        </Form>
        <FormErrors errors={form.errors} errorId={form.errorId} />
      </CardContent>
      <CardFooter>
        <Button type="submit" form={form.id} className="w-full">
          {isPending ? <LoaderCircle className="animate-spin" /> : 'Set new password'}
        </Button>
      </CardFooter>
    </Card>
  );
}
