import type { Config, Context } from '@netlify/functions';
import Excel from 'exceljs';
import { parseActivityCode } from './activity';
import { turso } from './db';
import { errorResponse, NotFoundError } from './errors';
import { toDateRange } from './lib';
import { ors } from './ors';

type ORSPaymentRow = {
  activity: string;
  start_date: string;
  end_date: string;
  venue: string;
  honorarium: number;
  payee: string;
  code: string;
};

type ORSPayment = {
  activity: string;
  startDate: string;
  endDate: string;
  venue: string;
  honorarium: number;
  payee: string;
  activityCode: string;
};

export const config: Config = {
  method: 'POST',
  path: '/api/ors/:activity_id',
};

export default async (_req: Request, ctx: Context) => {
  try {
    const { activity_id } = ctx.params;
    const activityId = parseInt(activity_id);
    if (isNaN(activityId)) throw new Error('invalid activity id');

    const sql = `
SELECT 
p.honorarium,
a.title         AS activity,
a.start_date,
a.end_date,
a.code,
pay.name        AS payee,
v.name          AS venue
FROM payments p
LEFT JOIN activities a ON a.id = p.activity_id
LEFT JOIN payees pay ON pay.id = p.payee_id
LEFT JOIN venues v ON v.id = a.venue_id 
WHERE p.activity_id = ?
`;

    const { rows } = await turso.execute(sql, [activityId]);
    const payments: ORSPayment[] = (rows as unknown as ORSPaymentRow[]).map(payment => ({
      ...payment,
      startDate: payment.start_date,
      endDate: payment.end_date,
      activityCode: payment.code,
    }));

    if (rows.length === 0) throw new NotFoundError();

    const excelBuffer = await createORS(payments);

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    return new Response(blob, {
      status: 200,
      headers: {
        'Content-Disposition': `attachment; filename="ORS-${payments[0].activityCode}.xlsx"`,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
};

async function createORS(payments: ORSPayment[]) {
  const workbook = new Excel.Workbook();
  const buf = Buffer.from(ors, 'base64');
  const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

  await workbook.xlsx.load(arrayBuffer);

  const orsSheet = workbook.getWorksheet('ORS');
  if (!orsSheet) throw new Error('Workbook does not have a sheet named ORS.');

  const dvSheet = workbook.getWorksheet('DV');
  if (!dvSheet) throw new Error('Workbook does not have a sheet named DV.');

  let payee = payments[0].payee.toLocaleUpperCase();
  const numPayees = payments.length;
  let other = 'OTHER';
  if (numPayees > 2) other += 'S';
  if (numPayees > 1) payee += ` AND ${(numPayees - 1).toString()} ${other}`;

  orsSheet.getCell('E7').value = payee;
  dvSheet.getCell('F11').value = payee;

  const particulars = `To payment of honorarium as Resource Person during the ${payments[0].activity} held at ${payments[0].venue} on ${toDateRange(payments[0].startDate, payments[0].endDate)}`;
  orsSheet.getCell('E16').value = particulars;
  dvSheet.getCell('B16').value = particulars;

  const amount = payments.reduce((acc, payment) => acc + payment.honorarium, 0);
  orsSheet.getCell('N16').value = amount;
  dvSheet.getCell('AC17').value = amount;

  orsSheet.getCell('E34').value = payments[0].activityCode;
  orsSheet.getCell('K16').value = parseActivityCode(payments[0].activityCode).mfoCode;

  return await workbook.xlsx.writeBuffer();
}
