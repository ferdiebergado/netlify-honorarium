import type { RoleFormValues } from '../../src/shared/schema';
import { db } from '../db';
import { createRole } from './repo';

export async function newRole(data: RoleFormValues, userId: number): Promise<number> {
  return await createRole(db, data, userId);
}
