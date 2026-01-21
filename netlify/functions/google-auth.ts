import type { Config } from '@netlify/functions';
import { stringifySetCookie } from 'cookie';
import { OAuth2Client, type TokenPayload } from 'google-auth-library';
import { SESSION_COOKIE_NAME } from '../constants';
import { db } from '../db';
import { upsertUser } from '../db/user-repo';
import { errorResponse, UnauthorizedError } from '../errors';
import { createSession } from '../session/repo';

const clientId = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(clientId);

type Body = {
  id_token?: string;
};

export const config: Config = {
  method: 'POST',
  path: '/api/auth/google',
};

export default async (req: Request) => {
  try {
    const { id_token } = (await req.json()) as Body;

    if (!id_token) throw new UnauthorizedError('Missing id token');

    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: clientId,
    });

    const payload: TokenPayload | undefined = ticket.getPayload();

    if (!payload) throw new UnauthorizedError('Invalid token payload');

    console.debug('payload:', payload);
    const { sub, name, email, picture, iss } = payload;

    if (!name || !email || !picture) throw new UnauthorizedError('Insufficient scope');

    if (iss !== 'https://accounts.google.com') throw new UnauthorizedError('Invalid issuer');

    const userId = await upsertUser(db, { googleId: sub, name, email, picture });

    const { sessionId, maxAge } = await createSession(userId, req);

    const sessionCookie = stringifySetCookie({
      name: SESSION_COOKIE_NAME,
      value: sessionId,
      path: '/',
      maxAge: maxAge,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    return Response.json(
      { message: 'Logged in.' },
      {
        headers: {
          'Set-Cookie': sessionCookie,
        },
      }
    );
  } catch (error) {
    return errorResponse(error);
  }
};
