import type { Row } from '@libsql/client';
import type { Activity, ActivityFormValues, VenueFormValues } from '../../src/shared/schema';
import { db } from '../db';
import { keysToCamel } from '../lib';
import { getFundCluster } from './activity';
import { create, find, softDelete, update } from './repo';
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

export function rowToActivity(row: Row): Activity {
  return {
    ...(keysToCamel(row) as Activity),
    fundCluster: getFundCluster(row.code as string),
  };
}

export async function findActivity(id: number): Promise<Activity> {
  const row = await find(db, id);

  return rowToActivity(row);
}
