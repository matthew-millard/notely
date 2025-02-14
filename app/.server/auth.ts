import type { Password, User } from '@prisma/client';
import { redirect } from '@remix-run/node';
import bcrypt from 'bcryptjs';
import { SESSION_KEY } from './config';
import { prisma } from './db';
import { getSession, sessionStorage } from './session';

interface AuthCredentials {
  email: User['email'];
  password: Password['hash'];
}

// Cookie Expiration Time
const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30; // 30 days

export function getSessionExpirationDate() {
  const expirationDate = new Date(Date.now() + SESSION_EXPIRATION_TIME);
  return expirationDate;
}

export async function verifyUserPassword({ email, password }: AuthCredentials) {
  const userWithPassword = await prisma.user.findUnique({
    where: {
      email,
    },
    select: { id: true, password: { select: { hash: true } }, username: true },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(password, userWithPassword.password.hash);

  if (!isValid) {
    return null;
  }

  return { id: userWithPassword.id, username: userWithPassword.username }; // Makes sense to get username for redirect here...
}

export async function login({ email, password }: AuthCredentials) {
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
  const cookieSession = await getSession(request);
  const sessionId = cookieSession.get(SESSION_KEY);

  void prisma.session
    .delete({
      where: {
        id: sessionId,
      },
    })
    .catch(() => {});

  throw redirect('/', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(cookieSession),
    },
  });
}

export async function requireAnonymous(request: Request) {
  const userId = await getUserId(request);

  if (userId) {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        username: true,
      },
    });

    throw redirect(`/${user?.username}`);
  }
}

export async function requireUserId(request: Request) {
  const userId = await getUserId(request);

  if (!userId) {
    throw redirect('/login');
  }

  return userId;
}

export async function getUserId(request: Request) {
  const cookieSession = await getSession(request);
  const sessionId = cookieSession.get(SESSION_KEY);

  if (!sessionId) return null;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { userId: true },
  });

  if (!session) {
    throw await logout(request);
  }

  return session.userId;
}
