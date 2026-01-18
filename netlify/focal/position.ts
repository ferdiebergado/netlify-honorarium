import { db } from '../db';
import { createPosition } from './position-repo';

export async function newPosition(position: string, userId: number) {
  await createPosition(db, position, userId);
}
