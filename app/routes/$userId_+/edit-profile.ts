import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { requireUserId } from '~/.server/auth';
import { ParamsSchema } from './notes+/$noteId';
import { z } from 'zod';
import { parseWithZod } from '@conform-to/zod';
import { EditProfileSchema } from '~/components/ui/EditProfile';
import { prisma } from '~/.server/db';
import { setToastCookie, toastSessionStorage } from '~/.server/toast';

export async function loader() {
  throw redirect('/');
}

export async function action({ request, params }: ActionFunctionArgs) {
  const userId = await requireUserId(request);

  const validRouteParams = z.object({ userId: z.string() }).parse(params);

  if (userId !== validRouteParams.userId) {
    throw new Response('Not authorised', {
      status: 401,
    });
  }

  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema: EditProfileSchema,
  });

  if (submission.status !== 'success') {
    return json(submission.reply(), {
      status: submission.status === 'error' ? 400 : 200,
    });
  }

  const { firstName, lastName } = submission.value;

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      firstName,
      lastName,
    },
    select: {
      id: true,
    },
  });

  if (!updatedUser) {
    return json(submission.reply({ formErrors: ['Unexpected server error'] }), {
      status: 500,
    });
  }

  const toastSession = await setToastCookie(request, {
    id: 'edit-profile',
    title: 'Profile updated',
    description: 'You successfully updated your profile',
    type: 'success',
  });

  return json(
    { status: 'ok' },
    {
      headers: {
        'Set-Cookie': await toastSessionStorage.commitSession(toastSession),
      },
    }
  );
}
