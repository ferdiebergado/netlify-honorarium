import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { Focal } from '../../src/shared/schema';
import { type Database } from '../db';
import { assertTimestamps, assertUser, seedDb, setupTestDb, type BaseRow } from '../test-utils';
import { createFocal } from './repo';

describe('createFocal', () => {
  const positionId = 1;

  let db: Database;

  beforeEach(async () => {
    db = await setupTestDb();
    await seedDb(db);
  });

  afterEach(() => {
    db.close();
  });

  it('should insert the focal and return the new ID', async () => {
    const startTime = Date.now();

    const focal: Pick<Focal, 'name' | 'positionId'> = {
      name: 'Jimmy Basilio',
      positionId,
    };
    const userId = 1;
    const focalId = await createFocal(db, focal, userId);

    expect(focalId).toBeTypeOf('number');
    expect(focalId).toBeGreaterThan(0);

    const sql = 'SELECT * FROM focals WHERE id = ?';
    const { rows } = await db.execute(sql, [focalId]);
    expect(rows.length).toBe(1);

    const newFocal = rows[0];
    expect(newFocal.name).toBe(focal.name);
    expect(newFocal.position_id).toBe(focal.positionId);
    assertTimestamps(newFocal as unknown as BaseRow, startTime);
    assertUser(newFocal as unknown as BaseRow, userId);
  });

  it('should throw an error if the user does not exist', async () => {
    const nonExistentUserId = 999;

    await expect(
      createFocal(db, { name: 'Ghost Focal', positionId }, nonExistentUserId)
    ).rejects.toThrow();
  });
});
