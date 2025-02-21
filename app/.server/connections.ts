import { Authenticator } from 'remix-auth';
import { OAuth2Strategy } from 'remix-auth-oauth2';
import { ENV } from './env';

export const authenticator = new Authenticator();

authenticator.use(
  new OAuth2Strategy(
    {
      authorizationEndpoint: 'https://www.facebook.com/v22.0/dialog/oauth',
      tokenEndpoint: 'https://graph.facebook.com/v22.0/oauth/access_token',
      clientId: ENV.FACEBOOK_CLIENT_ID,
      clientSecret: ENV.FACEBOOK_CLIENT_SECRET,
      redirectURI: 'http://localhost:3000/auth/facebook/callback',
    },
    async ({ tokens, request }) => {
      return {
        tokens,
        request,
      };
    }
  ),

  'facebook'
);
