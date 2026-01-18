import type { Config, Context } from '@netlify/functions';
import type { Activity } from '../../src/shared/schema';
import { getFundCluster } from '../activity/activity';
import { authCheck } from '../auth-check';
import { db } from '../db';
import { errorResponse, NotFoundError } from '../errors';
import { keysToCamel, parseId } from '../lib';
import { activitiesSql } from './list-activities';

export const config: Config = {
  method: 'GET',
  path: '/api/activities/:id',
};

export default async (req: Request, ctx: Context) => {
  console.log('Retrieving activity...');

  try {
    await authCheck(req);

    const accountId = parseId(ctx.params.id);

    const sql = `${activitiesSql} WHERE a.id = ? AND a.deleted_at IS NULL`;
    const { rows } = await db.execute(sql, [accountId]);

    if (rows.length === 0) throw new NotFoundError();

    const data = {
      ...(keysToCamel(rows[0]) as Activity),
      fundCluster: getFundCluster(rows[0].code as string),
    };

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};
