// import { Authenticator } from 'remix-auth';
// import { FacebookStrategy, SocialsProvider, type FacebookProfile, type GoogleProfile } from 'remix-auth-socials';
// import { SESSION_KEY } from './config';
// import { ENV } from './env';
// import { sessionStorage } from './session';

// type AuthUser = FacebookProfile;

// // Create an instance of the authenticator
// export const authenticator = new Authenticator<AuthUser>(sessionStorage, { sessionKey: SESSION_KEY });

// function getCallback(provider: SocialsProvider) {
//   return `http://localhost:3000/auth/${provider}/callback`;
// }

// authenticator.use(
//   new FacebookStrategy(
//     {
//       clientID: ENV.FACEBOOK_CLIENT_ID,
//       clientSecret: ENV.FACEBOOK_CLIENT_SECRET,
//       callbackURL: getCallback(SocialsProvider.FACEBOOK),
//     },
//     async ({ profile }) => {
//       return profile;
//     }
//   )
// );
