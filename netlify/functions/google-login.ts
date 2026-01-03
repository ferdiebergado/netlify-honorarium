import type { Config } from '@netlify/functions';
import { stringifySetCookie } from 'cookie';
import { randomBytes } from 'crypto';
import { oauth2Client, scopes } from '../google';
import { RANDOM_BYTES_SIZE } from './constants';

export const config: Config = {
  method: 'GET',
  path: '/api/oauth/google/login',
};

export default () => {
  const state = randomBytes(RANDOM_BYTES_SIZE).toString('hex');

  const stateCookie = stringifySetCookie({
    name: 'state',
    value: state,
    path: '/api/oauth/google',
    maxAge: 5 * 60,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  });

  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    include_granted_scopes: true,
    state: state,
  });

  return Response.json(null, {
    headers: {
      Location: authorizationUrl,
      'Set-Cookie': stateCookie,
    },
    status: 307,
  });
};
