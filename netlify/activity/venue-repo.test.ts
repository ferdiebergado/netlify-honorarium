import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { type Database } from '../db';
import { assertTimestamps, assertUser, seedDb, setupTestDb, type BaseRow } from '../test-utils';
import { createVenue } from './venue-repo';

describe('createVenue', () => {
  let db: Database;

  beforeEach(async () => {
    db = await setupTestDb();
    await seedDb(db);
  });

  afterEach(() => {
    db.close();
  });

  it('should insert a venue and return the new ID', async () => {
    const startTime = Date.now();
    const venueName = 'Example Hotel';
    const userId = 1;
    const venueId = await createVenue(db, venueName, userId);

    expect(venueId).toBeTypeOf('number');
    expect(venueId).toBeGreaterThan(0);

    const sql = 'SELECT * FROM venues WHERE id = ?';
    const { rows } = await db.execute(sql, [venueId]);
    expect(rows).toHaveLength(1);

    const venue = rows[0];
    expect(venue.name).toBe(venueName);
    assertTimestamps(venue as unknown as BaseRow, startTime);
    assertUser(venue as unknown as BaseRow, userId);
  });

  it('should throw an error if the user does not exist', async () => {
    const nonExistentUserId = 999;

    await expect(createVenue(db, 'Ghost Venue', nonExistentUserId)).rejects.toThrow();
  });
});
