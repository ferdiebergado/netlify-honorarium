import { mergeDocx } from '@benedicte/docx-merge';
import type { Config, Context } from '@netlify/functions';
import type { Payment } from '../../src/shared/schema';
import { errorResponse, NotFoundError } from '../errors';
import { docxResponse, formatToPhp, parseId, patchDoc, toDateRange } from '../lib';
import { comp } from '../payment/computation';
import { getMaxSalary, getPayments } from '../payment/payments';

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
    const activityId = parseId(ctx.params.activity_id);

    const payments = await getPayments(activityId);

    if (payments.length === 0) throw new NotFoundError();

    const firstPayment = payments[0];
    const activityCode = firstPayment.activityCode;
    const filename = 'computation-' + activityCode;

    const patches = createPatches(firstPayment);
    const firstCert = await patchDoc(comp, patches);

    if (!firstCert) throw new Error('failed to patch document');

    if (payments.length === 1) return docxResponse(firstCert, filename);

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

    return docxResponse(merged, filename);
  } catch (error) {
    return errorResponse(error);
  }
};

function createPatches(payment: Payment): ComputationPatches {
  const salary = getMaxSalary(payment.salary);

  const tags: ComputationPatches = {
    ...payment,
    payee: payment.payee.toLocaleUpperCase(),
    honorarium: formatToPhp(payment.honorarium),
    focal: payment.focal.toLocaleUpperCase(),
    date: toDateRange(payment.startDate, payment.endDate),
    bank_branch: payment.bankBranch,
    account_name: payment.accountName,
    account_no: payment.accountNo,
    actual_honorarium: formatToPhp(payment.actualHonorarium),
    net_honorarium: formatToPhp(payment.netHonorarium),
    salary: formatToPhp(salary),
    hours: payment.hoursRendered.toString(),
  };

  return tags;
}
