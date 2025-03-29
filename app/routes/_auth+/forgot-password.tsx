import { getFormProps, getInputProps, type SubmissionResult, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { generateTOTP } from '@epic-web/totp';
import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { Form, Link, useActionData } from '@remix-run/react';
import { z } from 'zod';
import ResetPasswordEmail from 'emails/reset-password-email';
import { prisma } from '~/.server/db';
import { sendEmail } from '~/.server/email';
import { Button, FieldError, FormErrors, Input, Label } from '~/components/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/Card';
import { getDomainUrl } from '~/utils';
import { EmailSchema } from '~/utils/schemas';
import { CODE_QUERY_PARAM, TARGET_QUERY_PARAM, TYPE_QUERY_PARAM } from './verify';

const ForgotPasswordSchema = z.object({
  email: EmailSchema,
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  // Validate formData
  const submission = await parseWithZod(formData, {
    async: true,
    schema: ForgotPasswordSchema.transform(async ({ email }, ctx) => {
      const user = await prisma.user.findFirst({
        where: {
          email,
        },
        select: {
          id: true,
        },
      });

      if (!user) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'There is no account associated with this email address.',
          path: ['email'],
        });
        return z.NEVER;
      }

      return email;
    }),
  });

  if (submission.status !== 'success') {
    return json(submission.reply(), {
      status: submission.status === 'error' ? 400 : 200,
    });
  }

  const email = submission.value;

  const { algorithm, charSet, digits, period, otp, secret } = await generateTOTP({
    digits: 6,
    algorithm: 'SHA-256',
    period: 15 * 60, // 15 minutes
    charSet: 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789', // Removed I, O, and 0 to help prevent user confusion
  });

  const type = 'reset-password';
  const redirectToUrl = new URL('/verify', getDomainUrl(request));
  redirectToUrl.searchParams.set(TYPE_QUERY_PARAM, type);
  redirectToUrl.searchParams.set(TARGET_QUERY_PARAM, email);

  const magicLinkUrl = new URL(redirectToUrl);
  magicLinkUrl.searchParams.set(CODE_QUERY_PARAM, otp); // Magic link

  const verificationData = {
    type,
    target: email,
    secret,
    algorithm,
    digits,
    period,
    charSet,
    expiresAt: new Date(Date.now() + period * 1000),
  };

  await prisma.verification.upsert({
    where: {
      target_type: {
        target: email,
        type,
      },
    },
    create: verificationData,
    update: verificationData,
  });

  const response = await sendEmail({
    from: 'Notely <no-reply@notely.ca>',
    to: [email],
    subject: `Code to reset your password - ${otp}`,
    reactEmailTemplate: <ResetPasswordEmail otp={otp} verifyUrl={magicLinkUrl.toString()} />,
  });

  if (response.status !== 200) {
    return json({ status: 'error', message: 'An error occured' }, { status: 500 });
  }

  return redirect(redirectToUrl.toString());
}

export default function ForgotPasswordRoute() {
  const [form, fields] = useForm({
    id: 'forgot-password-form',
    lastResult: useActionData<SubmissionResult<string[]>>(),
    constraint: getZodConstraint(ForgotPasswordSchema),
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ForgotPasswordSchema });
    },
  });
  return (
    <div className="mx-auto w-full max-w-md pt-24 md:pt-60">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset your password</CardTitle>
          <CardDescription>Enter your email and we&apos;ll send you a link to reset your password.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="POST" {...getFormProps(form)} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor={fields.email.id}>Email</Label>
              <Input
                {...getInputProps(fields.email, {
                  type: 'email',
                })}
                autoFocus
                placeholder="name@example.com"
                autoComplete="off"
              />
              <FieldError field={fields.email} />
            </div>

            <div className="grid gap-y-2">
              <Button type="submit" className="-mt-1 w-full">
                Send email
              </Button>
              <FormErrors errors={form.errors} errorId={form.errorId} />
              <div className="text-center text-sm">
                <Link to="/login" prefetch="intent" className="hover:underline underline-offset-4">
                  Go back
                </Link>
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
