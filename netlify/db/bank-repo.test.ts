import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { type Database } from '.';
import { assertTimestamps, assertUser, seedDb, setupTestDb, type BaseRow } from '../test-utils';
import { createBank } from './bank-repo';

describe('createBank', () => {
  let db: Database;

  beforeEach(async () => {
    db = await setupTestDb();
    await seedDb(db);
  });

  afterEach(() => {
    db.close();
  });

  it('should insert the bank and return the new ID', async () => {
    const startTime = Date.now();
    const name = 'Banco Bergado';
    const userId = 1;
    const positionId = await createBank(db, name, userId);

    expect(positionId).toBeTypeOf('number');
    expect(positionId).toBeGreaterThan(0);

    const sql = 'SELECT * FROM banks WHERE id = ?';
    const { rows } = await db.execute(sql, [positionId]);
    expect(rows.length).toBe(1);

    const bank = rows[0];
    expect(bank.name).toBe(name);
    assertTimestamps(bank as unknown as BaseRow, startTime);
    assertUser(bank as unknown as BaseRow, userId);
  });

  it('should throw an error if the user does not exist', async () => {
    const nonExistentUserId = 999;

    await expect(createBank(db, 'Ghost Bank', nonExistentUserId)).rejects.toThrow();
  });
});
