import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { z } from 'zod';
import { requireUserId } from '~/.server/auth';
import { prisma } from '~/.server/db';
import { getSession, sessionStorage } from '~/.server/session';
import { setToastCookie, toastSessionStorage } from '~/.server/toast';

export async function loader() {
  throw redirect('/');
}

export async function action({ request, params }: ActionFunctionArgs) {
  console.log('hi');
  const userId = await requireUserId(request);
  const validRouteParams = z.object({ userId: z.string() }).parse(params);

  if (userId !== validRouteParams.userId) {
    throw new Response('Not authorised', {
      status: 401,
    });
  }

  const deletedUser = await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  if (!deletedUser) {
    const toastSession = await setToastCookie(request, {
      id: 'delete-account',
      title: 'Unable to delete account',
      description: 'Unfortunately we were unable to delete your account. Please try again later.',
      type: 'error',
    });
    throw new Response('Unexpected server error. Unable to delete', {
      headers: {
        'Set-Cookie': await toastSessionStorage.commitSession(toastSession),
      },
      status: 500,
    });
  }

  const toastSession = await setToastCookie(request, {
    id: 'delete-account',
    title: 'Account deleted',
    description: 'You have successfully deleted your account',
    type: 'success',
  });

  const session = await getSession(request);

  const combinedHeaders = new Headers();
  combinedHeaders.append('Set-Cookie', await toastSessionStorage.commitSession(toastSession));
  combinedHeaders.append('Set-Cookie', await sessionStorage.destroySession(session));

  return redirect('/', {
    headers: combinedHeaders,
  });
}
