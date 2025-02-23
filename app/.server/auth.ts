import type { Password, User } from '@prisma/client';
import { redirect } from '@remix-run/node';
import bcrypt from 'bcryptjs';
import { hashPassword } from '~/utils';
import { SESSION_KEY } from './config';
import { prisma } from './db';
import { authSessionStorage } from './session';

interface AuthCredentials {
  email: User['email'];
  firstName: User['firstName'];
  lastName: User['lastName'];
  password: Password['hash'];
}

// Cookie Expiration Time
const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30; // 30 days

export function getSessionExpirationDate() {
  const expirationDate = new Date(Date.now() + SESSION_EXPIRATION_TIME);
  return expirationDate;
}

export async function verifyUserPassword({ email, password }: Pick<AuthCredentials, 'email' | 'password'>) {
  const userWithPassword = await prisma.user.findUnique({
    where: {
      email,
    },
    select: { id: true, password: { select: { hash: true } } },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(password, userWithPassword.password.hash);

  if (!isValid) {
    return null;
  }

  return { id: userWithPassword.id }; // Makes sense to get username for redirect here...
}

export async function createAccount({ email, firstName, lastName, password }: AuthCredentials) {
  const session = await prisma.session.create({
    data: {
      expirationDate: getSessionExpirationDate(),
      user: {
        create: {
          email,
          firstName,
          lastName,
          password: {
            create: {
              hash: hashPassword(password),
            },
          },
        },
      },
    },
    select: {
      id: true,
      expirationDate: true,
      userId: true,
    },
  });

  return session;
}

export async function login({ email, password }: Pick<AuthCredentials, 'email' | 'password'>) {
  const user = await verifyUserPassword({ email, password });

  if (!user) return null;

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      expirationDate: getSessionExpirationDate(),
    },
    select: { id: true, expirationDate: true, userId: true },
  });

  return { session, user };
}

export async function logout(request: Request) {
  const authSession = await authSessionStorage.getSession(request.headers.get('cookie'));
  const sessionId = authSession.get(SESSION_KEY);

  if (sessionId) {
    void prisma.session
      .delete({
        where: {
          id: sessionId,
        },
      })
      .catch(() => {});
  }

  throw redirect('/', {
    headers: {
      'Set-Cookie': await authSessionStorage.destroySession(authSession),
    },
  });
}

export async function requireAnonymous(request: Request) {
  const userId = await getUserId(request);

  if (userId) {
    throw redirect(`/${userId}`);
  }
  return;
}

export async function requireUserId(request: Request) {
  const userId = await getUserId(request);

  if (!userId) {
    throw redirect('/login');
  }

  return userId;
}

export async function getUserId(request: Request) {
  const authSession = await authSessionStorage.getSession(request.headers.get('cookie'));

  const sessionId = authSession.get(SESSION_KEY);

  if (!sessionId) return null;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { userId: true },
  });

  if (!session?.userId) {
    throw redirect('/', {
      headers: {
        'Set-Cookie': await authSessionStorage.destroySession(authSession),
      },
    });
  }

  return session.userId;
}
