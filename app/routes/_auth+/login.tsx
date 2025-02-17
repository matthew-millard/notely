import { parseWithZod } from '@conform-to/zod';
import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from '@remix-run/node';
import { z } from 'zod';
import { login, requireAnonymous } from '~/.server/auth';
import { SESSION_KEY } from '~/.server/config';
import { getSession, sessionStorage } from '~/.server/session';
import { LoginForm } from '~/components/forms';
import { LoginSchema } from '~/components/forms/LoginForm';

export async function action({ request }: ActionFunctionArgs) {
  await requireAnonymous(request);
  const formData = await request.formData();

  const submission = await parseWithZod(formData, {
    async: true,
    schema: LoginSchema.transform(async (data, ctx) => {
      const user = await login(data);

      if (!user) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid email or password',
        });
        return z.NEVER;
      }

      return { ...data, ...user };
    }),
  });

  if (submission.status !== 'success') {
    return json(
      submission.reply({
        formErrors: ['Submission failed.'],
        hideFields: ['password'],
      }),
      { status: submission.status === 'error' ? 400 : 200 }
    );
  }

  const { session, user } = submission.value;

  const cookieSession = await getSession(request);
  cookieSession.set(SESSION_KEY, session.id);

  return redirect(`/${user.username}`, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(cookieSession, {
        expires: session.expirationDate, // Remember me permanently set
      }),
    },
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAnonymous(request);
  return null;
}

export default function LoginRoute() {
  return (
    <main className="flex flex-grow justify-center sm:py-24">
      <LoginForm />
    </main>
  );
}
