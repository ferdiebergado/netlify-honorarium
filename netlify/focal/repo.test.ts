import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { Focal } from '../../src/shared/schema';
import { type Database } from '../db';
import { assertTimestamps, assertUser, seedUser, setupTestDb, type BaseRow } from '../test-utils';
import { createPosition } from './position-repo';
import { createFocal, findActiveFocals } from './repo';

describe('focal repo', () => {
  let db: Database;
  let userId: number;
  let positionId: number;

  beforeEach(async () => {
    db = await setupTestDb();
    userId = await seedUser(db);
    positionId = await createPosition(db, 'Dragon Fruit Monster', userId);
  });

  afterEach(() => {
    db.close();
  });

  describe('createFocal', () => {
    it('should insert the focal and return the new ID', async () => {
      const startTime = Date.now();

      const focal: Pick<Focal, 'name' | 'positionId'> = {
        name: 'Jimmy Basilio',
        positionId,
      };
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

  describe('findActiveFocals', () => {
    it('should return only active focals (where deleted_at is null)', async () => {
      await db.execute(
        `INSERT INTO focals (name, position_id, created_by, updated_by, deleted_at) VALUES 
      ('Active Focal', ?, ?, ?, NULL),
      ('Deleted Focal', ?, ?, ?, CURRENT_TIMESTAMP)`,
        [positionId, userId, userId, positionId, userId, userId]
      );

      const result = await findActiveFocals(db);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(result[0].name).toBe('Active Focal');
    });

    it('should return focals ordered alphabetically by name', async () => {
      await db.execute(
        `INSERT INTO focals (name, position_id, created_by, updated_by) VALUES 
      ('Zebra', ?, ?, ?),
      ('Apple', ?, ?, ?),
      ('Banana', ?, ?, ?)`,
        [positionId, userId, userId, positionId, userId, userId, positionId, userId, userId]
      );

      const result = await findActiveFocals(db);

      const names = result.map(f => f.name);
      expect(names).toEqual(['Apple', 'Banana', 'Zebra']);
    });

    it('should correctly map database snake_case to camelCase', async () => {
      await db.execute(
        `INSERT INTO focals (name, position_id, created_by, updated_by) 
       VALUES ('Test Mapping', ?, ?, ?)`,
        [positionId, userId, userId]
      );

      const result = await findActiveFocals(db);

      const focal = result[0];
      expect(focal).toHaveProperty('positionId'); // Check camelCase
      expect(focal).not.toHaveProperty('position_id'); // Ensure snake_case is gone
      expect(focal.positionId).toBe(positionId);
    });

    it('should return an empty array if no active focals exist', async () => {
      const result = await findActiveFocals(db);
      expect(result).toEqual([]);
    });
  });
});
