import { Authenticator } from 'remix-auth';
import { OAuth2Strategy } from 'remix-auth-oauth2';
import { z } from 'zod';
import { type ProviderName } from '~/components/forms/ProviderConnectionForm';
import { COOKIE_PREFIX } from './config';
import { ENV } from './env';

const OAUTH2_KEY = 'oauth2';

interface OAuth2Tokens {
  data: object;
  tokenType: () => string;
  accessToken: () => string;
  accessTokenExpiresInSeconds: () => number;
  accessTokenExpiresAt: () => Date;
  hasRefreshToken: () => boolean;
  refreshToken: () => string;
  hasScopes: () => boolean;
  scopes: () => string[];
  idToken: () => string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

const FacebookResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  picture: z.object({
    data: z.object({
      height: z.number(),
      is_silhouette: z.boolean(),
      url: z.string().url().optional(),
      width: z.number(),
    }),
  }),
  first_name: z.string(),
  last_name: z.string(),
});

const GoogleResponseSchema = z.object({
  sub: z.string(),
  name: z.string(),
  given_name: z.string(),
  family_name: z.string(),
  picture: z.string().url().optional(),
  email: z.string().email(),
  email_verified: z.boolean(),
});

export const authenticator = new Authenticator();

const cookie = {
  name: `${COOKIE_PREFIX}_${OAUTH2_KEY}`,
  maxAge: 60 * 60 * 24 * 7,
  path: '/',
  httpOnly: true as const,
  sameSite: 'Lax' as const,
  secure: true as const,
};

// Facebook
authenticator.use(
  new OAuth2Strategy(
    {
      cookie,
      authorizationEndpoint: 'https://www.facebook.com/v22.0/dialog/oauth',
      tokenEndpoint: 'https://graph.facebook.com/v22.0/oauth/access_token',
      clientId: ENV.FACEBOOK_CLIENT_ID,
      clientSecret: ENV.FACEBOOK_CLIENT_SECRET,
      redirectURI: getCallback('facebook'),
      scopes: ['email', 'public_profile'],
    },
    async ({ tokens }) => {
      const url = new URL('https://graph.facebook.com/me');
      url.searchParams.set('fields', 'id,name,email,picture.type(large),first_name,last_name');
      const rawUser = await fetchOAuthUserProfile(tokens, url);
      const user = FacebookResponseSchema.parse(rawUser);

      return {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        avatarUrl: user.picture.data.url,
      };
    }
  ),

  'facebook'
);

// Google
authenticator.use(
  new OAuth2Strategy(
    {
      cookie,
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
      clientId: ENV.GOOGLE_CLIENT_ID,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET,
      redirectURI: getCallback('google'),
      scopes: ['openid', 'profile', 'email'],
    },
    async ({ tokens }) => {
      const url = new URL('https://www.googleapis.com/oauth2/v3/userinfo');
      const rawUser = await fetchOAuthUserProfile(tokens, url);

      const user = GoogleResponseSchema.parse(rawUser);

      return {
        id: user.sub,
        email: user.email,
        firstName: user.given_name,
        lastName: user.family_name,
        avatarUrl: user.picture,
      };
    }
  ),
  'google'
);

export async function fetchOAuthUserProfile(tokens: OAuth2Tokens, url: URL) {
  const userResponse = await fetch(url, {
    headers: {
      Authorization: `Bearer ${tokens.accessToken()}`,
    },
  });

  return await userResponse.json();
}

function getCallback(provider: ProviderName) {
  return process.env.NODE_ENV === 'production'
    ? `https://notely.ca/auth/${provider}/callback`
    : `http://localhost:3000/auth/${provider}/callback`;
}
