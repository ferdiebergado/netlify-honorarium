import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { type Database } from '../db';
import { assertTimestamps, assertUser, seedDb, setupTestDb, type BaseRow } from '../test-utils';
import { createPosition } from './position-repo';

describe('createPosition', () => {
  let db: Database;

  beforeEach(async () => {
    db = await setupTestDb();
    await seedDb(db);
  });

  afterEach(() => {
    db.close();
  });

  it('should insert the position and return the new ID', async () => {
    const startTime = Date.now();
    const name = 'Supervising Admin Support';
    const userId = 1;
    const positionId = await createPosition(db, name, userId);

    expect(positionId).toBeTypeOf('number');
    expect(positionId).toBeGreaterThan(0);

    const sql = 'SELECT * FROM positions WHERE id = ?';
    const { rows } = await db.execute(sql, [positionId]);
    expect(rows.length).toBe(1);

    const position = rows[0];
    expect(position.name).toBe(name);
    assertTimestamps(position as unknown as BaseRow, startTime);
    assertUser(position as unknown as BaseRow, userId);
  });

  it('should throw an error if the user does not exist', async () => {
    const nonExistentUserId = 999;

    await expect(createPosition(db, 'Ghost Position', nonExistentUserId)).rejects.toThrow();
  });
});
