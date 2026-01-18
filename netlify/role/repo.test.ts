import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { type Database } from '../db';
import { assertTimestamps, assertUser, seedDb, setupTestDb, type BaseRow } from '../test-utils';
import { createRole } from './repo';

describe('createRole', () => {
  let db: Database;

  beforeEach(async () => {
    db = await setupTestDb();
    await seedDb(db);
  });

  afterEach(() => {
    db.close();
  });

  it('should insert a role and return the new ID', async () => {
    const startTime = Date.now();
    const name = 'Coder';
    const userId = 1;
    const roleId = await createRole(db, { name }, userId);

    expect(roleId).toBeTypeOf('number');
    expect(roleId).toBeGreaterThan(0);

    const sql = 'SELECT * FROM roles WHERE id = ?';
    const { rows } = await db.execute(sql, [roleId]);
    expect(rows.length).toBe(1);

    const role = rows[0];
    expect(role.name).toBe(name);
    assertTimestamps(role as unknown as BaseRow, startTime);
    assertUser(role as unknown as BaseRow, userId);
  });

  it('should throw an error if the user does not exist', async () => {
    const nonExistentUserId = 999;

    await expect(createRole(db, { name: 'Ghost Role' }, nonExistentUserId)).rejects.toThrow();
  });
});
