import { mergeDocx } from '@benedicte/docx-merge';
import type { Config, Context } from '@netlify/functions';
import type { Payment } from '../../src/shared/schema';
import { errorResponse, NotFoundError } from '../errors';
import { amountToWords, docxResponse, formatToPhp, parseId, patchDoc, toDateRange } from '../lib';
import { cert } from '../payment/certification';
import { getPayments } from '../payment/payments';

type CertificationPatches = {
  payee: string;
  role: string;
  activity: string;
  venue: string;
  date: string;
  end_date: string;
  amount_words: string;
  amount: string;
  tax: string;
  focal: string;
  position: string;
};

export const config: Config = {
  method: 'POST',
  path: '/api/certification/:activity_id',
};

export default async (_req: Request, ctx: Context) => {
  console.log('Generating certification...');

  try {
    const activityId = parseId(ctx.params.activity_id);

    const payments = await getPayments(activityId);

    if (payments.length === 0) throw new NotFoundError();

    const firstPayment = payments[0];
    const activityCode = firstPayment.activityCode;
    const filename = 'certification-' + activityCode;

    const patches = createPatches(firstPayment);
    const firstCert = await patchDoc(cert, patches);

    if (!firstCert) throw new Error('failed to patch document');

    if (payments.length === 1) return docxResponse(firstCert, filename);

    const patchDocs = payments.slice(1).map(async payment => {
      const patches = createPatches(payment);
      const patched = await patchDoc(cert, patches);

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

function createPatches(payment: Payment): CertificationPatches {
  return {
    payee: payment.payee.toLocaleUpperCase(),
    role: payment.role,
    activity: payment.activity,
    venue: payment.venue,
    end_date: new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    amount: formatToPhp(payment.honorarium),
    tax: payment.taxRate.toString(),
    focal: payment.focal.toLocaleUpperCase(),
    position: payment.position,
    date: toDateRange(payment.startDate, payment.endDate),
    amount_words: amountToWords(payment.honorarium),
  };
}
