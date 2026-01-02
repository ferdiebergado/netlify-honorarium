import type { Config } from '@netlify/functions';
import cookie from 'cookie';
import crypto from 'crypto';
import { oauth2Client, scopes } from '../google';

export const config: Config = {
  method: 'GET',
  path: '/api/oauth/google/login',
};

export default () => {
  // Generate a secure random state value.
  const state = crypto.randomBytes(32).toString('hex');

  // Store state in a cookie
  const setCookieHeader = cookie.stringifySetCookie({
    httpOnly: true,
    secure: true,
    name: 'state',
    value: state,
    path: '/',
    maxAge: 5 * 60 * 60,
    sameSite: 'lax',
  });

  // Generate a url that asks permissions for the Drive activity and Google Calendar scope
  const authorizationUrl = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',
    /** Pass in the scopes array defined above.
     * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
    scope: scopes,
    // Enable incremental authorization. Recommended as a best practice.
    include_granted_scopes: true,
    // Include the state parameter to reduce the risk of CSRF attacks.
    state: state,
  });

  return Response.json(null, {
    headers: {
      Location: authorizationUrl,
      'Set-Cookie': setCookieHeader,
    },
    status: 307,
  });
};
