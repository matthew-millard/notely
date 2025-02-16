import { parseWithZod } from '@conform-to/zod';
import { verifyTOTP } from '@epic-web/totp';
import { json } from '@remix-run/node';
import { z } from 'zod';
import { prisma } from './db';

interface Verification {
  code: string;
  type: 'sign-up';
  target: string;
}

export const TYPE_QUERY_PARAM = 'type';
export const TARGET_QUERY_PARAM = 'target';
export const CODE_QUERY_PARAM = 'code';
export const REDIRECT_TO_QUERY_PARAM = 'redirectTo';

const VerifySchema = z.object({
  [CODE_QUERY_PARAM]: z.string().min(5).max(5),
  [TYPE_QUERY_PARAM]: z.enum(['sign-up']), // add more types of verification here
  [TARGET_QUERY_PARAM]: z.string(),
  [REDIRECT_TO_QUERY_PARAM]: z.string().optional(),
});

export async function validateRequest(request: Request, body: URLSearchParams) {
  const submission = await parseWithZod(body, {
    async: true,
    schema: VerifySchema.transform(async ({ code, target, type }, ctx) => {
      const codeIsValid = await isCodeValid({ code, type, target });

      if (!codeIsValid) {
        ctx.addIssue({
          path: ['code'],
          code: z.ZodIssueCode.custom,
          message: 'Invalid code',
        });
      }
      return { code, target, type };
    }),
  });

  if (submission.status !== 'success') {
    return json({ result: submission.reply() }, { status: submission.status === 'error' ? 400 : 200 });
  }

  const { target, type } = submission.value;

  switch (type) {
    case 'sign-up': {
      await deleteVerification({ target, type });
      return handleSignUpVerification();
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

export async function handleSignUpVerification() {} // continue from here!
