import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { getSessionExpirationDate, getUserId } from '~/.server/auth';
import { SESSION_KEY } from '~/.server/config';
import { authenticator } from '~/.server/connections';
import { prisma } from '~/.server/db';
import { authSessionStorage } from '~/.server/session';
import { setToastCookie, toastSessionStorage } from '~/.server/toast';
import { ProviderName, ProviderNamesSchema } from '~/components/forms/ProviderConnectionForm';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const providerName = ProviderNamesSchema.parse(params.provider);

  const authResult = await authenticator.authenticate(providerName, request).then(
    data =>
      ({
        success: true,
        data,
      } as const),
    error =>
      ({
        success: false,
        error,
      } as const)
  );

  if (!authResult.success) {
    console.error(authResult.error);
    throw redirect('/login');
  }

  const { data: profile } = authResult;

  const existingConnection = await prisma.connection.findUnique({
    where: {
      providerName_providerId: {
        providerId: profile.id,
        providerName,
      },
    },
    select: {
      userId: true,
    },
  });

  const userId = await getUserId(request);

  if (existingConnection && userId) {
    if (existingConnection.userId === userId) {
      return redirect(`/${userId}`);
    } else {
      throw new Error(`${profile.email} is already connected to another account`);
    }
  }

  //   If we're already logged in, then link the account
  if (userId) {
    await prisma.connection.create({
      data: {
        providerId: profile.id,
        providerName,
        userId,
      },
    });

    return redirect(`/${userId}`);
  }

  //   Connection exists already? Make a new session
  if (existingConnection) {
    return makeSession({ request, userId: existingConnection.userId, providerName });
  }

  //   if the email matches a user in the db, then link the account and make new session
  const user = await prisma.user.findUnique({
    where: {
      email: profile.email.toLowerCase(),
    },
  });

  if (user) {
    await prisma.connection.create({
      data: {
        providerId: profile.id,
        providerName,
        userId: user.id,
      },
    });

    return makeSession({ request, userId: user.id, providerName });
  }

  //   this is a new user, so let's get them signed up
  const newUser = await prisma.user.create({
    data: {
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      avatarUrl: profile.avatarUrl,
    },
  });

  if (!newUser) {
    throw new Response('Unable to create account. Please try again later.', {
      status: 500,
    });
  }

  return makeSession({ request, userId: newUser.id, providerName });
}

async function makeSession({
  request,
  userId,
  providerName,
}: {
  request: Request;
  userId: string;
  providerName: ProviderName;
}) {
  const session = await prisma.session.create({
    data: {
      userId,
      expirationDate: getSessionExpirationDate(),
    },
  });

  const authSession = await authSessionStorage.getSession(request.headers.get('cookie'));
  authSession.set(SESSION_KEY, session.id);

  const toastSession = await setToastCookie(request, {
    id: 'logged-in-with-provider',
    title: 'Logged in',
    description: `You have successfully logged into your account with ${
      providerName.charAt(0).toUpperCase() + providerName.slice(1)
    }`,
    type: 'success',
  });

  const combinedHeaders = new Headers();
  combinedHeaders.append(
    'Set-Cookie',
    await authSessionStorage.commitSession(authSession, {
      expires: session.expirationDate,
    })
  );

  combinedHeaders.append('Set-Cookie', await toastSessionStorage.commitSession(toastSession));

  return redirect(`/${userId}`, {
    headers: combinedHeaders,
  });
}
