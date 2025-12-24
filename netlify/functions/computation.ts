import { mergeDocx } from '@benedicte/docx-merge';
import type { Config, Context } from '@netlify/functions';
import { comp } from './comp';
import { errorResponse, NotFoundError } from './errors';
import { docxResponse, formatToPhp, toDateRange } from './lib';
import { getPayments, SG29, type Payment } from './payments';
import { patchDoc } from './word';

type ComputationPatches = {
  payee: string;
  role: string;
  activity: string;
  bank: string;
  bank_branch: string;
  date: string;
  account_name: string;
  account_no: string;
  honorarium: string;
  actual_honorarium: string;
  net_honorarium: string;
  tin: string;
  focal: string;
  position: string;
  salary: string;
  hours: string;
};

export const config: Config = {
  method: 'POST',
  path: '/api/computations/:activity_id',
};

export default async (_req: Request, ctx: Context) => {
  console.log('Generating computation...');

  try {
    const { activity_id } = ctx.params;
    const activityId = parseInt(activity_id);
    if (isNaN(activityId)) throw new Error('invalid activity id');

    const payments = await getPayments(activityId);

    if (payments.length === 0) throw new NotFoundError();

    const firstPayment = payments[0];
    const activityCode = firstPayment.activityCode;

    const patches = createPatches(firstPayment);
    const firstCert = await patchDoc(comp, patches);

    if (!firstCert) throw new Error('failed to patch document');

    if (payments.length === 1) return docxResponse(firstCert, activityCode);

    const patchDocs = payments.slice(1).map(async payment => {
      const patches = createPatches(payment);
      const patched = await patchDoc(comp, patches);
      if (!patched) throw new Error('failed to patch document');
      return patched;
    });

    const patchedDocs = await Promise.all(patchDocs);

    const merged = patchedDocs.reduce((acc, curr) => {
      const merged = mergeDocx(acc, curr, { insertEnd: true });
      if (!merged) throw new Error('failed to merge documents');
      return merged;
    }, firstCert);

    return docxResponse(merged, activityCode);
  } catch (error) {
    return errorResponse(error);
  }
};

function createPatches(payment: Payment): ComputationPatches {
  const salary = payment.salary > SG29 ? SG29 : payment.salary;

  const tags: ComputationPatches = {
    payee: payment.payee,
    role: payment.role,
    activity: payment.activity,
    honorarium: formatToPhp(payment.honorarium),
    tin: payment.tin,
    focal: payment.focal.toLocaleUpperCase(),
    position: payment.position,
    date: toDateRange(payment.startDate, payment.endDate),
    bank_branch: payment.bankBranch,
    account_name: payment.accountName,
    account_no: payment.accountNo,
    bank: payment.bank,
    actual_honorarium: formatToPhp(payment.actualHonorarium),
    net_honorarium: formatToPhp(payment.netHonorarium),
    salary: formatToPhp(salary),
    hours: payment.hoursRendered.toString(),
  };

  return tags;
}
