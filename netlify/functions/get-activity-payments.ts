import type { Config, Context } from '@netlify/functions';
import type { Activity, Payee, PaymentData } from '../../src/shared/schema';
import { authCheck } from '../auth-check';
import { turso } from '../db';
import { errorResponse } from '../errors';
import { parseId } from '../lib';

type ActivityRow = {
  id: number;
  title: string;
  code: string;
  start_date: string;
  end_date: string;
  venue_id: number;
  venue: string;
  focal_id: number;
  focal: string;
  payee_id: number;
  payee: string;
  payee_position: string;
  payee_office: string;
  hours_rendered: number;
  actual_honorarium: number;
  net_honorarium: number;
  tax_rate: number;
  honorarium: number;
  role: string;
  payment_id: number;
  account_id: number;
  salary_id: number;
  role_id: number;
  tin_id: number;
  focal_positionId: number;
  focal_position: string;
};

const fullActivitySql = `
SELECT
  a.id,
  a.title,
  a.code,
  a.start_date,
  a.end_date,

  v.id          AS venue_id,
  v.name        AS venue,

  f.id          AS focal_id,
  f.name        AS focal,

  p.id          AS payee_id,
  p.name        AS payee,
  p.position    AS payee_position,
  p.office      AS payee_office,

  pay.id        AS payment_id,
  pay.hours_rendered,
  pay.actual_honorarium,
  pay.net_honorarium,
  pay.tax_rate,
  pay.honorarium,
  pay.account_id,
  pay.salary_id,
  pay.tin_id,

  r.id          AS role_id,
  r.name        AS role,

  pos.name      AS focal_position
FROM activities a
JOIN focals f ON f.id = a.focal_id
JOIN positions pos ON pos.id = f.position_id
JOIN venues v ON v.id = a.venue_id
LEFT JOIN payments pay ON pay.activity_id = a.id
LEFT JOIN payees p ON p.id = pay.payee_id
LEFT JOIN roles r ON r.id = pay.role_id
WHERE a.id = ? AND a.deleted_at IS NULL`;

export const config: Config = {
  method: 'GET',
  path: '/api/activities/:id/payments',
};

export default async (req: Request, ctx: Context) => {
  try {
    await authCheck(req);

    const activityId = parseId(ctx.params.id);

    const { rows } = await turso.execute(fullActivitySql, [activityId]);
    const data = rowsToActivity(rows as unknown as ActivityRow[]);

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

function rowsToActivity(rows: ActivityRow[]): Activity {
  const payees: Payee[] = [];
  const payments: PaymentData[] = [];
  const firstRow = rows[0];

  rows.forEach(row => {
    if (!row.payee_id) return;

    const payee: Payee = {
      id: row.payee_id,
      name: row.payee,
      position: row.payee_position,
      office: row.payee_office,
      accounts: [],
      salaries: [],
      tins: [],
    };

    const existingPayee = payees.find(p => p.id === payee.id);

    if (!existingPayee) payees.push(payee);

    const payment: PaymentData = {
      honorarium: row.honorarium,
      hoursRendered: row.hours_rendered,
      actualHonorarium: row.actual_honorarium,
      taxRate: row.tax_rate,
      netHonorarium: row.net_honorarium,
      payee: row.payee,
      role: row.role,
      id: row.payment_id,
      payeeId: row.payee_id,
      accountId: row.account_id,
      salaryId: row.salary_id,
      activityId: row.id,
      roleId: row.role_id,
      activity: row.title,
      tinId: row.tin_id,
    };

    payments.push(payment);
  });

  return {
    id: firstRow.id,
    title: firstRow.title,
    venue: firstRow.venue,
    venueId: firstRow.venue_id,
    startDate: firstRow.start_date,
    endDate: firstRow.end_date,
    code: firstRow.code,
    focal: firstRow.focal,
    focalId: firstRow.focal_id,
    payees,
    payments,
    positionId: firstRow.focal_positionId,
    position: firstRow.focal_position,
  };
}
