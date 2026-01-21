import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { ActivityFormValues } from '../../src/shared/schema';
import type { Database } from '../db';
import { assertTimestamps, assertUser, seedDb, setupTestDb, type BaseRow } from '../test-utils';
import { create, find, findAll, softDelete, update } from './repo';

describe('activity repo', () => {
  const mockActivity: ActivityFormValues = {
    title: 'Test workshop',
    startDate: new Date(2026, 11, 26).toISOString(),
    endDate: new Date(2026, 11, 26).toISOString(),
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

  describe('create', () => {
    it('should insert the activity and return the new ID', async () => {
      const startTime = Date.now();

      const activityId = await create(db, mockActivity, userId);
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

      await expect(create(db, mockActivity, nonExistentUserId)).rejects.toThrow();
    });
  });

  describe('softDelete', () => {
    it('should soft delete the activity', async () => {
      const startTime = Date.now();
      const id = await create(db, mockActivity, userId);
      await softDelete(db, id, userId);

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

  describe('update', () => {
    it('should update the activity', async () => {
      const startTime = Date.now();
      const title = 'Test writeshop';

      const id = await create(db, mockActivity, userId);
      await update(db, id, { ...mockActivity, title }, userId);

      const sql = 'SELECT * FROM activities WHERE id = ?';
      const { rows } = await db.execute(sql, [id]);
      expect(rows.length).toBe(1);

      const activity = rows[0];
      expect(activity.title).toBe(title);

      const updatedAtCol = activity.updated_at as string;
      const updatedAt = new Date(updatedAtCol + 'Z');
      const diff = Math.abs(updatedAt.getTime() - startTime);
      expect(diff).toBeLessThan(1000);

      assertUser(activity as unknown as BaseRow, userId);
    });
  });

  describe('find', () => {
    it('should find and return the activity', async () => {
      const id = await create(db, mockActivity, userId);
      const activity = await find(db, id);

      expect(activity.title).toBe(mockActivity.title);
      expect(activity.venue_id).toBe(mockActivity.venueId);
      expect(activity.start_date).toBe(mockActivity.startDate);
      expect(activity.end_date).toBe(mockActivity.endDate);
      expect(activity.code).toBe(mockActivity.code);
      expect(activity.focal_id).toBe(mockActivity.focalId);
    });
  });

  describe('findAll', () => {
    it('should find and return all activities', async () => {
      const mockActivity2: ActivityFormValues = {
        title: 'test 2',
        venueId: 1,
        startDate: new Date(2026, 1, 10).toISOString(),
        endDate: new Date(2026, 1, 13).toISOString(),
        code: 'AC-26-MNO-PQR-STU-333',
        focalId: 1,
      };

      const mockActivities = [mockActivity, mockActivity2];

      mockActivities.forEach(async activity => await create(db, activity, userId));

      const rows = await findAll(db);

      expect(rows.length).toBe(mockActivities.length);

      let i = 0;

      rows.forEach(row => {
        expect(row.title).toBe(mockActivities[i].title);
        expect(row.venue_id).toBe(mockActivities[i].venueId);
        expect(row.start_date).toBe(mockActivities[i].startDate);
        expect(row.end_date).toBe(mockActivities[i].endDate);
        expect(row.code).toBe(mockActivities[i].code);
        expect(row.focal_id).toBe(mockActivities[i].focalId);
        i++;
      });
    });
  });
});
