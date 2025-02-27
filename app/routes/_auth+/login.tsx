import { parseWithZod } from '@conform-to/zod';
import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from '@remix-run/node';
import { z } from 'zod';
import { login, requireAnonymous } from '~/.server/auth';
import { SESSION_KEY } from '~/.server/config';
import { authSessionStorage, getSession } from '~/.server/session';
import { setToastCookie, toastSessionStorage } from '~/.server/toast';
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
        hideFields: ['password'],
      }),
      { status: submission.status === 'error' ? 400 : 200 }
    );
  }

  const { session, user } = submission.value;

  const authSession = await getSession(request);
  authSession.set(SESSION_KEY, session.id);

  const toastSession = await setToastCookie(request, {
    id: 'logged-in-successfully',
    title: 'Welcome back!',
    description: 'You are now logged in to your account',
    type: 'success',
  });

  const combinedHeaders = new Headers();
  combinedHeaders.append('Set-Cookie', await toastSessionStorage.commitSession(toastSession));
  combinedHeaders.append(
    'Set-Cookie',
    await authSessionStorage.commitSession(authSession, {
      expires: session.expirationDate, // Remember me permanently set
    })
  );

  return redirect(`/${user.id}`, {
    headers: combinedHeaders,
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
