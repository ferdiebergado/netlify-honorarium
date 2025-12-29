import type { Config, Context } from '@netlify/functions';
import Excel from 'exceljs';
import { parseActivityCode } from '../activity';
import { turso } from '../db';
import { errorResponse, NotFoundError } from '../errors';
import { toDateRange } from '../lib';
import { payroll } from '../payroll';
import { deserializeDetails } from './list-accounts';

type PayrollRow = {
  activity: string;
  start_date: string;
  end_date: string;
  venue: string;
  total_honorarium: number;
  payee: string;
  code: string;
  bank: string;
  account_details: Buffer;
  position: string;
  tin: string;
  tax_rate: number;
};

type PayrollPayment = {
  activity: string;
  startDate: string;
  endDate: string;
  venue: string;
  honorarium: number;
  payee: string;
  activityCode: string;
  bank: string;
  accountDetails: Buffer;
  position: string;
  tin: string;
  taxRate: number;
};

export const config: Config = {
  method: 'POST',
  path: '/api/payrolls/:activity_id',
};

export default async (_req: Request, ctx: Context) => {
  try {
    const { activity_id } = ctx.params;
    const activityId = parseInt(activity_id);
    if (isNaN(activityId)) throw new Error('invalid activity id');

    const sql = `
SELECT 
p.tax_rate,
a.title         AS activity,
a.start_date,
a.end_date,
a.code,
pay.name        AS payee,
pay.position,
v.name          AS venue,
acc.details     AS account_details,
b.name          AS bank,
t.tin,
SUM(p.honorarium)  AS total_honorarium
FROM payments p
JOIN activities a ON a.id = p.activity_id
JOIN payees pay ON pay.id = p.payee_id
JOIN venues v ON v.id = a.venue_id 
JOIN accounts acc ON acc.id = p.account_id
JOIN banks b ON b.id = acc.bank_id
JOIN tins t ON t.id = p.tin_id
WHERE p.activity_id = ?
GROUP BY pay.id
`;

    const { rows } = await turso.execute(sql, [activityId]);
    const payments: PayrollPayment[] = (rows as unknown as PayrollRow[]).map(payment => ({
      ...payment,
      startDate: payment.start_date,
      endDate: payment.end_date,
      activityCode: payment.code,
      accountDetails: payment.account_details,
      taxRate: payment.tax_rate,
      honorarium: payment.total_honorarium,
    }));

    if (rows.length === 0) throw new NotFoundError();

    const excelBuffer = await createPayroll(payments);

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    return new Response(blob, {
      status: 200,
      headers: {
        'Content-Disposition': `attachment; filename="payroll-${payments[0].activityCode}.xlsx"`,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
};

async function createPayroll(payments: PayrollPayment[]) {
  const workbook = new Excel.Workbook();
  const buf = Buffer.from(payroll, 'base64');
  const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

  await workbook.xlsx.load(arrayBuffer);

  const sheet = workbook.getWorksheet('PAYROLL');
  if (!sheet) throw new Error('Workbook does not have a sheet named PAYROLL.');

  const { year, program, appropriationType } = parseActivityCode(payments[0].activityCode);
  const fundClusterCell = sheet.getCell('A7');
  const fundCluster: string = `${fundClusterCell.text} ${year.toString()} ${program} ${appropriationType}`;
  sheet.getCell('A7').value = fundCluster;

  const particularsCell = sheet.getCell('A9');
  particularsCell.value = `${particularsCell.text} ${payments[0].activity} held at ${payments[0].venue} on ${toDateRange(payments[0].startDate, payments[0].endDate)}`;

  let currentRow = 13;

  payments.forEach((payment, index) => {
    if (index > 1) sheet.insertRow(currentRow, [], 'i');

    const num = index + 1;
    const { payee, position, accountDetails, bank, tin, honorarium } = payment;
    const { bankBranch, accountNo } = deserializeDetails(accountDetails);
    const cells: { cell: string; value: Excel.CellValue }[] = [
      {
        cell: 'A',
        value: num,
      },
      {
        cell: 'B',
        value: payee,
      },
      {
        cell: 'C',
        value: position,
      },
      {
        cell: 'D',
        value: accountNo,
      },
      {
        cell: 'E',
        value: bank,
      },
      {
        cell: 'F',
        value: bankBranch,
      },
      {
        cell: 'I',
        value: tin,
      },
      {
        cell: 'J',
        value: honorarium,
      },
      {
        cell: 'K',
        value: { formula: `J${currentRow.toString()}*${(payment.taxRate / 100).toString()}` },
      },
      {
        cell: 'L',
        value: { formula: `J${currentRow.toString()}-K${currentRow.toString()}` },
      },
      {
        cell: 'M',
        value: num,
      },
    ];

    cells.forEach(({ cell, value }) => (sheet.getRow(currentRow).getCell(cell).value = value));

    currentRow++;
  });

  return await workbook.xlsx.writeBuffer();
}
