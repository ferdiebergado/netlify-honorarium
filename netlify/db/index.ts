import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';

const migrationFile = 'init.sql';

export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL ?? 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function ensureDBReady() {
  try {
    const sql = readFileSync(migrationFile);
    await turso.executeMultiple(sql.toString('utf-8'));
  } catch (error) {
    console.error('Failed to migrate database:', error);
    throw error;
  }
}

export async function seedDb(): Promise<number> {
  try {
    const sql =
      'INSERT INTO users (google_id, name, email, picture) VALUES (?, ?, ?, ?) RETURNING id';

    const { rows } = await turso.execute(sql, [
      '9876543210',
      'test user',
      'test@example.com',
      'http://example.com/avatar.jpg',
    ]);

    const { id } = rows[0] as unknown as { id: number };

    return id;
  } catch (error) {
    console.error('Failed to seed database:', error);
    throw error;
  }
}
