import { createClient } from '@libsql/client';

export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL ?? 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export function parseId(id: string): number | null {
  const parsedId = id ? parseInt(id) : null;

  if (parsedId && isNaN(parsedId)) throw new Error('invalid id');

  return parsedId;
}
