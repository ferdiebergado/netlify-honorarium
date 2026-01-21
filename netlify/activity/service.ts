import type { ActivityFormValues, VenueFormValues } from '../../src/shared/schema';
import { db } from '../db';
import { create, softDelete, update } from './repo';
import { createVenue } from './venue-repo';

export async function newActivity(activity: ActivityFormValues, userId: number) {
  await create(db, activity, userId);
}

export async function newVenue(venue: VenueFormValues, userId: number) {
  await createVenue(db, venue.name, userId);
}

export async function deleteActivity(id: number, userId: number) {
  await softDelete(db, id, userId);
}

export async function updateActivity(id: number, data: ActivityFormValues, userId: number) {
  await update(db, id, data, userId);
}
