import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import path from 'path';
import { expect } from 'vitest';
import type { User } from '../src/shared/schema';
import { createVenue } from './activity/venue-repo';
import type { Database } from './db';
import { upsertUser } from './db/user-repo';
import { createPosition } from './focal/position-repo';
import { createFocal } from './focal/repo';

const schemaPath = path.join(__dirname, '../init.sql');
const schemaSql = readFileSync(schemaPath, { encoding: 'utf-8' });

export type BaseRow = {
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
};

export async function seedDb(db: Database): Promise<void> {
  try {
    const user: Omit<User, 'id'> = {
      googleId: '9876543210',
      name: 'test user',
      email: 'test@example.com',
      picture: 'http://example.com/avatar.jpg',
    };

    const userId = await upsertUser(db, user);

    await createVenue(db, 'Hotel Example', userId);

    const positionId = await createPosition(db, 'Dragon Fruit Monster', userId);

    await createFocal(db, { name: 'Bryan Ureta', positionId }, userId);

    const bankSql = 'INSERT INTO banks (name, created_by, updated_by) VALUES (?, ?, ?)';

    const bankArgs = ['Bank of the Universe', userId, userId];
    await db.execute({
      sql: bankSql,
      args: bankArgs,
    });
  } catch (error) {
    console.error('Failed to seed database:', error);
    throw error;
  }
}

export async function setupTestDb(): Promise<Database> {
  const client = createClient({ url: ':memory:' });

  try {
    await client.executeMultiple(schemaSql);
  } catch (error) {
    console.error('Failed to migrate database:', error);
    throw error;
  }

  return client;
}

export function assertTimestamps(row: BaseRow, startTime: number) {
  expect(row.created_at).toBeDefined();
  expect(row.updated_at).toBeDefined();

  const createdAt = new Date(row.created_at + 'Z');
  const diff = Math.abs(createdAt.getTime() - startTime);
  expect(diff).toBeLessThan(1000);

  expect(row.created_at).toBe(row.updated_at);
}

export function assertUser(row: BaseRow, userId: number) {
  expect(row.created_by).toBe(userId);
  expect(row.updated_by).toBe(userId);
}
