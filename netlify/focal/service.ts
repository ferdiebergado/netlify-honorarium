import type { FocalFormValues } from '../../src/shared/schema';
import { db } from '../db';
import { createFocal } from './repo';

export async function newFocal(focal: FocalFormValues, userId: number) {
  await createFocal(db, focal, userId);
}
