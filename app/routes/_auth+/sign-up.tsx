import { parseWithZod } from '@conform-to/zod';
import { generateTOTP } from '@epic-web/totp';
import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from '@remix-run/node';
import { z } from 'zod';
import { requireAnonymous } from '~/.server/auth';
import { prisma } from '~/.server/db';
import { sendEmail } from '~/.server/email';
import { VerifyEmail } from '~/components/emails';
import { SignUpForm } from '~/components/forms';
import { SignUpSchema } from '~/components/forms/SignUpForm';
import { getDomainUrl } from '~/utils';
import { CODE_QUERY_PARAM, TARGET_QUERY_PARAM, TYPE_QUERY_PARAM } from './verify';

export async function action({ request }: ActionFunctionArgs) {
  await requireAnonymous(request);
  const formData = await request.formData();

  const submission = await parseWithZod(formData, {
    async: true,
    schema: SignUpSchema.transform(async ({ email }, ctx) => {
      const emailExists = await prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (emailExists) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['email'],
          message: 'Email is already in use',
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

  const type = 'sign-up';
  const redirectToUrl = new URL('/verify', getDomainUrl(request));
  redirectToUrl.searchParams.set(TYPE_QUERY_PARAM, type);
  redirectToUrl.searchParams.set(TARGET_QUERY_PARAM, email);

  const verifyUrl = new URL(redirectToUrl);
  verifyUrl.searchParams.set(CODE_QUERY_PARAM, otp); // Magic link

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
    subject: 'Verify your email address',
    reactEmailTemplate: <VerifyEmail otp={otp} verifyUrl={verifyUrl.toString()} />,
  });

  if (response.status !== 200) {
    return json({ status: 'error', message: 'An error occured' }, { status: 500 });
  }

  return redirect(redirectToUrl.toString());
}

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAnonymous(request);
  return null;
}

export default function SignupRoute() {
  return (
    <main className="flex flex-grow justify-center py-12 sm:py-36">
      <SignUpForm />
    </main>
  );
}
