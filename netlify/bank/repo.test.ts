import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { type Database } from '../db';
import { assertTimestamps, assertUser, seedDb, setupTestDb, type BaseRow } from '../test-utils';
import { createBank, findBanks } from './repo';

describe('bank repo', () => {
  let db: Database;

  beforeEach(async () => {
    db = await setupTestDb();
    await seedDb(db);
  });

  afterEach(() => {
    db.close();
  });

  describe('createBank', () => {
    it('should insert the bank and return the new ID', async () => {
      const startTime = Date.now();
      const name = 'Banco Bergado';
      const userId = 1;
      const positionId = await createBank(db, name, userId);

      expect(positionId).toBeTypeOf('number');
      expect(positionId).toBeGreaterThan(0);

      const sql = 'SELECT * FROM banks WHERE id = ?';
      const { rows } = await db.execute(sql, [positionId]);
      expect(rows).toHaveLength(1);

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

  describe('findBanks', () => {
    it('returns all banks that are not soft-deleted', async () => {
      await db.execute(`DELETE FROM banks`);

      await db.execute(
        `
      INSERT INTO banks (name, created_by, updated_by)
      VALUES
        ('BPI', 1, 1),
        ('BDO', 1, 1),
        ('UnionBank', 1, 1)
      `
      );

      await db.execute(
        `
      UPDATE banks
      SET deleted_at = CURRENT_TIMESTAMP, deleted_by = 1
      WHERE id = 2
      `
      );

      const rows = await findBanks(db);

      expect(rows).toHaveLength(2);
      expect(rows.map(b => b.name)).toEqual(['BPI', 'UnionBank']);
    });

    it('orders banks by name ascending', async () => {
      await db.execute(`DELETE FROM banks`);

      await db.execute(
        `
      INSERT INTO banks (name, created_by, updated_by)
      VALUES
        ('UnionBank', 1, 1),
        ('BPI', 1, 1),
        ('BDO', 1, 1)
      `
      );

      const rows = await findBanks(db);

      expect(rows.map(b => b.name)).toEqual(['BDO', 'BPI', 'UnionBank']);
    });

    it('returns an empty array when no banks exist', async () => {
      await db.execute(`DELETE FROM banks`);

      const rows = await findBanks(db);

      expect(rows).toEqual([]);
    });
  });
});
