import type { FocalFormValues } from '../../src/shared/schema';
import { db } from '../db';
import { createFocal, findActiveFocals } from './repo';

export async function newFocal(focal: FocalFormValues, userId: number) {
  await createFocal(db, focal, userId);
}

export async function getActiveFocals() {
  return await findActiveFocals(db);
}
