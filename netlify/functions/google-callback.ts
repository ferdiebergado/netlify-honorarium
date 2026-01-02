import type { Config } from '@netlify/functions';
import { parseCookie } from 'cookie';
import { BadRequestError, errorResponse, InternalServerError, UnauthorizedError } from '../errors';
import { googlePeopleAPI, oauth2Client, scopes } from '../google';

export const config: Config = {
  method: 'GET',
  path: '/api/oauth/google/callback',
};

export default async (req: Request) => {
  try {
    const searchParams = new URL(req.url).searchParams;

    const code = searchParams.get('code');

    if (!code) throw new BadRequestError('missing code');

    const state = searchParams.get('state');
    const cookie = req.headers.get('cookie');
    console.debug('req.headers:', req.headers);
    console.debug('cookie:', req.headers.get('cookie'));
    if (!cookie) throw new UnauthorizedError('Invalid cookie');

    const cookieState = parseCookie(cookie);
    console.debug('state', state);
    console.debug('cookieState.state', cookieState.state);

    if (state !== cookieState.state) throw new UnauthorizedError('Invalid state');

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    if (!tokens.scope?.includes(scopes[0])) throw new UnauthorizedError('scope not granted');

    const res = await oauth2Client.fetch(googlePeopleAPI as string);

    if (!res.ok) throw new InternalServerError();

    console.log('res.data:', res.data);

    return Response.json({ message: 'Logged in.' });
  } catch (error) {
    return errorResponse(error);
  }
};
