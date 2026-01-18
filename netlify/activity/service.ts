import type { ActivityFormValues, VenueFormValues } from '../../src/shared/schema';
import { db } from '../db';
import { createActivity } from './repo';
import { createVenue } from './venue-repo';

export async function newActivity(activity: ActivityFormValues, userId: number) {
  await createActivity(db, activity, userId);
}

export async function newVenue(venue: VenueFormValues, userId: number) {
  await createVenue(db, venue.name, userId);
}
