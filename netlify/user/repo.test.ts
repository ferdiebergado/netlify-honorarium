import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { User } from '../../src/shared/schema';
import { type Database } from '../db';
import { assertTimestamps, seedDb, setupTestDb, type BaseRow } from '../test-utils';
import { upsertUser } from './repo';

describe('upsertUser', () => {
  let db: Database;

  beforeEach(async () => {
    db = await setupTestDb();
    await seedDb(db);
  });

  afterEach(() => {
    db.close();
  });

  it('should insert a user and return the new ID', async () => {
    const startTime = Date.now();
    const user: Omit<User, 'id'> = {
      googleId: '123456789',
      name: 'Bryan Ureta',
      email: 'idol@example.com',
      picture: 'http://example.com/idol.png',
    };
    const userId = await upsertUser(db, user);

    expect(userId).toBeTypeOf('number');
    expect(userId).toBeGreaterThan(0);

    const sql = 'SELECT * FROM users WHERE id = ?';
    const { rows } = await db.execute(sql, [userId]);
    expect(rows).toHaveLength(1);

    const newUser = rows[0];

    expect(newUser.google_id).toBe(user.googleId);
    expect(newUser.name).toBe(user.name);
    expect(newUser.email).toBe(user.email);
    expect(newUser.picture).toBe(user.picture);

    assertTimestamps(newUser as unknown as BaseRow, startTime);
  });
});
