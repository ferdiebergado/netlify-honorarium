import type { Activity, ActivityFormValues, VenueFormValues } from '../../src/shared/schema';
import { db } from '../db';
import { create, findActiveActivities, findActiveActivity, softDelete, update } from './repo';
import { createVenue } from './venue-repo';

const mfoCodes = {
  BEC: '310100100003000',
  ELLN: '310100100007000',
  FLO: '310300100003000',
} as const satisfies Record<string, string>;

type Appropriation = 'Current' | 'Continuing';
type Program = keyof typeof mfoCodes;

export type FundCluster = {
  year: number;
  appropriation: Appropriation;
  program: Program;
  mfoCode: (typeof mfoCodes)[Program];
};

export function parseActivityCode(activityCode: string): FundCluster {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, year, _bureau, _division, pap, code] = activityCode.split('-');

  const program = pap as Program;
  const mfoCode = mfoCodes[program];
  const appropriation: Appropriation = code.startsWith('P') ? 'Continuing' : 'Current';
  return {
    year: parseInt(year) + 2000,
    appropriation,
    program,
    mfoCode,
  };
}

export function getFundCluster(activityCode: string): string {
  const { year, appropriation, program } = parseActivityCode(activityCode);

  return `${year.toString()} ${program} ${appropriation}`;
}

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

export async function getActivity(id: number): Promise<Activity> {
  return await findActiveActivity(db, id);
}

export async function getActivities(): Promise<Activity[]> {
  return await findActiveActivities(db);
}
