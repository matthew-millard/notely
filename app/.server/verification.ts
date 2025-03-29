import { parseWithZod } from '@conform-to/zod';
import { verifyTOTP } from '@epic-web/totp';
import { createCookieSessionStorage, json, redirect } from '@remix-run/node';
import { z } from 'zod';
import { CODE_QUERY_PARAM, TARGET_QUERY_PARAM, TYPE_QUERY_PARAM, VerifySchema } from '~/routes/_auth+/verify';
import { COOKIE_PREFIX } from './config';
import { prisma } from './db';
import { ENV } from './env';

export const resetPasswordUserSessionKey = 'user';

interface Verification {
  code: string;
  type: 'sign-up' | 'reset-password';
  target: string;
}

export const VERIFY_SESSION_KEY = 'verification';

export const verifySessionStorage = createCookieSessionStorage({
  cookie: {
    name: `${COOKIE_PREFIX}_${VERIFY_SESSION_KEY}`,
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    maxAge: 60 * 10, // 10 minutes
    secrets: ENV.SESSION_SECRET.split(','),
    secure: process.env.NODE_ENV === 'production',
  },
});

export async function validateRequest(request: Request, body: URLSearchParams | FormData) {
  const submission = await parseWithZod(body, {
    async: true,
    schema: VerifySchema.transform(async (data, ctx) => {
      const codeIsValid = await isCodeValid({
        code: data[CODE_QUERY_PARAM],
        type: data[TYPE_QUERY_PARAM],
        target: data[TARGET_QUERY_PARAM],
      });

      if (!codeIsValid) {
        ctx.addIssue({
          path: [CODE_QUERY_PARAM],
          code: z.ZodIssueCode.custom,
          message: 'Invalid code',
        });

        return z.NEVER;
      }
      return data;
    }),
  });

  if (submission.status !== 'success') {
    return json(submission.reply({ hideFields: [CODE_QUERY_PARAM] }), {
      status: submission.status === 'error' ? 400 : 200,
    });
  }

  const { target, type } = submission.value;

  switch (type) {
    case 'sign-up': {
      await deleteVerification({ target, type });
      return handleSignUpVerification({ request, target });
    }

    case 'reset-password': {
      await deleteVerification({ target, type });
      return handleResetPasswordVerification({ request, target });
    }
  }
}

export async function isCodeValid({ code, type, target }: Verification) {
  const verification = await prisma.verification.findUnique({
    where: {
      target_type: { target, type },
    },
    select: {
      secret: true,
      period: true,
      digits: true,
      algorithm: true,
      charSet: true,
    },
  });

  if (!verification) {
    return false;
  }

  const result = await verifyTOTP({
    otp: code,
    ...verification,
  });

  if (!result) {
    return false;
  } else {
    return true;
  }
}

export async function deleteVerification({ target, type }: Omit<Verification, 'code'>) {
  await prisma.verification.delete({
    where: {
      target_type: {
        target,
        type,
      },
    },
  });
}

export async function handleSignUpVerification({ request, target }: { request: Request; target: string }) {
  const verifySession = await verifySessionStorage.getSession(request.headers.get('cookie'));
  verifySession.set(TARGET_QUERY_PARAM, target);

  return redirect('/complete-profile', {
    headers: {
      'Set-Cookie': await verifySessionStorage.commitSession(verifySession),
    },
  });
}

export async function handleResetPasswordVerification({ request, target }: { request: Request; target: string }) {
  const user = await prisma.user.findFirst({
    where: { email: target },
    select: { email: true, id: true, firstName: true },
  });

  // we don't want to say the user is not found if the email is not found
  // because that would allow an attacker to check if an email is registered

  if (!user) {
    return json({ status: 'error' } as const, { status: 400 });
  }

  const verifySession = await verifySessionStorage.getSession(request.headers.get('cookie'));
  verifySession.set(resetPasswordUserSessionKey, user);
  return redirect('/reset-password', {
    headers: {
      'set-cookie': await verifySessionStorage.commitSession(verifySession),
    },
  });
}
