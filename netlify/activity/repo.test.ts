import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { ActivityFormValues } from '../../src/shared/schema';
import type { Database } from '../db';
import { assertTimestamps, assertUser, seedDb, setupTestDb, type BaseRow } from '../test-utils';
import { createActivity, softDeleteActivity } from './repo';

describe('activity-repo', () => {
  const mockActivity: ActivityFormValues = {
    title: 'Test workshop',
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    code: 'AC-26-ABC-DEF-GHI-123',
    venueId: 1,
    focalId: 1,
  };
  const userId = 1;

  let db: Database;
  beforeEach(async () => {
    db = await setupTestDb();
    await seedDb(db);
  });

  afterEach(() => {
    db.close();
  });

  describe('createActivity', () => {
    it('should insert the activity and return the new ID', async () => {
      const startTime = Date.now();

      const activityId = await createActivity(db, mockActivity, userId);
      expect(activityId).toBeTypeOf('number');
      expect(activityId).toBeGreaterThan(0);

      const sql = 'SELECT * FROM activities WHERE id = ?';
      const { rows } = await db.execute(sql, [activityId]);
      expect(rows.length).toBe(1);

      const newActivity = rows[0];
      expect(newActivity.title).toBe(mockActivity.title);
      expect(newActivity.venue_id).toBe(mockActivity.venueId);
      expect(newActivity.focal_id).toBe(mockActivity.focalId);
      expect(newActivity.start_date).toBe(mockActivity.startDate);
      expect(newActivity.end_date).toBe(mockActivity.endDate);
      expect(newActivity.code).toBe(mockActivity.code);
      assertTimestamps(newActivity as unknown as BaseRow, startTime);
      assertUser(newActivity as unknown as BaseRow, userId);
    });

    it('should throw an error if the user does not exist', async () => {
      const nonExistentUserId = 999;

      await expect(createActivity(db, mockActivity, nonExistentUserId)).rejects.toThrow();
    });
  });

  describe('softDeleteActivity', () => {
    it('should soft delete the activity', async () => {
      const startTime = Date.now();
      const id = await createActivity(db, mockActivity, userId);
      await softDeleteActivity(db, id, userId);

      const sql = 'SELECT * FROM activities WHERE id = ?';
      const { rows } = await db.execute(sql, [id]);
      expect(rows.length).toBe(1);

      const deletedAtColumn = rows[0].deleted_at as string;
      expect(deletedAtColumn).toBeDefined();

      const deletedAt = new Date(deletedAtColumn + 'Z');
      const diff = Math.abs(deletedAt.getTime() - startTime);
      expect(diff).toBeLessThan(1000);
    });
  });
});
