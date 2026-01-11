import type { Config, Context } from '@netlify/functions';
import type { Activity, Payee, Payment, PaymentData } from '../../src/shared/schema';
import { getFundCluster } from '../activity';
import { authCheck } from '../auth-check';
import { turso } from '../db';
import { errorResponse } from '../errors';
import { keysToCamel, parseId } from '../lib';

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
    const data = rowsToActivity(rows);

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

type RawActivity = Activity &
  Pick<
    Payment,
    | 'honorarium'
    | 'hoursRendered'
    | 'role'
    | 'netHonorarium'
    | 'actualHonorarium'
    | 'taxRate'
    | 'accountId'
    | 'salaryId'
    | 'roleId'
    | 'tinId'
  > & {
    payeeId: number;
    payee: string;
    payeePosition: string;
    payeeOffice: string;
    paymentId: number;
    focalPosition: string;
  };

function rowsToActivity(rows: unknown[]): Activity {
  const payees: Payee[] = [];
  const payments: PaymentData[] = [];
  const {
    id,
    title,
    venue,
    venueId,
    startDate,
    endDate,
    code,
    focal,
    focalId,
    positionId,
    focalPosition,
  } = keysToCamel(rows[0]) as RawActivity;

  rows.forEach(row => {
    const {
      payeeId,
      payee,
      payeePosition,
      payeeOffice,
      honorarium,
      hoursRendered,
      actualHonorarium,
      taxRate,
      netHonorarium,
      role,
      paymentId,
      accountId,
      salaryId,
      id,
      roleId,
      title,
      tinId,
    } = keysToCamel(row) as RawActivity;
    if (!payeeId) return;

    const currentPayee: Payee = {
      id: payeeId,
      name: payee,
      position: payeePosition,
      office: payeeOffice,
      accounts: [],
      salaries: [],
      tins: [],
    };

    const existingPayee = payees.find(p => p.id === currentPayee.id);

    if (!existingPayee) payees.push(currentPayee);

    const payment: PaymentData = {
      honorarium,
      hoursRendered,
      actualHonorarium,
      taxRate,
      netHonorarium,
      payee,
      role,
      id: paymentId,
      payeeId,
      accountId,
      salaryId,
      activityId: id,
      roleId,
      activity: title,
      tinId,
    };

    payments.push(payment);
  });

  return {
    id,
    title,
    venue,
    venueId,
    startDate,
    endDate,
    code,
    focal,
    focalId,
    payees,
    payments,
    positionId,
    position: focalPosition,
    fundCluster: getFundCluster(code),
  };
}
