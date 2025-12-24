import { mergeDocx } from '@benedicte/docx-merge';
import type { Config, Context } from '@netlify/functions';
import { cert } from './cert';
import { errorResponse, NotFoundError } from './errors';
import { amountToWords, formatDate, formatToPhp, toDateRange } from './lib';
import { getPayments, type PaymentTags } from './payments';
import { patchDoc } from './word';

export const config: Config = {
  method: 'POST',
  path: '/api/certification/:activity_id',
};

export default async (_req: Request, ctx: Context) => {
  console.log('Generating certification...');

  try {
    const { activity_id } = ctx.params;
    const activityId = parseInt(activity_id);
    if (isNaN(activityId)) throw new Error('invalid activity id');

    const payments = await getPayments(activityId);

    if (payments.length === 0) throw new NotFoundError();

    const firstPayment = payments[0];
    const activityCode = firstPayment.activityCode;

    const tags: PaymentTags = {
      payee: firstPayment.payee,
      role: firstPayment.role,
      activity: firstPayment.activity,
      venue: firstPayment.venue,
      end_date: formatDate(firstPayment.endDate),
      amount: formatToPhp(firstPayment.honorarium),
      tax: firstPayment.taxRate.toString(),
      focal: firstPayment.focal.toLocaleUpperCase(),
      position: firstPayment.position,
      date: toDateRange(firstPayment.startDate, firstPayment.endDate),
      amount_words: amountToWords(firstPayment.honorarium),
    };

    const firstCert = await patchDoc(cert, tags);

    if (!firstCert) throw new Error('failed to patch document');

    if (payments.length === 1) return docxResponse(firstCert, activityCode);

    const patchDocs = payments.slice(1).map(async payment => {
      const tags: PaymentTags = {
        payee: payment.payee,
        role: payment.role,
        activity: payment.activity,
        venue: payment.venue,
        end_date: formatDate(payment.endDate),
        amount: formatToPhp(payment.honorarium),
        tax: payment.taxRate.toString(),
        focal: payment.focal.toLocaleUpperCase(),
        position: payment.position,
        date: toDateRange(payment.startDate, payment.endDate),
        amount_words: amountToWords(payment.honorarium),
      };

      const patched = await patchDoc(cert, tags);
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

function docxResponse(body: Buffer, suffix: string) {
  return new Response(body, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="certification-ac-${suffix}.docx"`,
    },
  });
}
