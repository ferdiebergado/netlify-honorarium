import type { Config, Context } from '@netlify/functions';
import { errorResponse, NotFoundError } from './errors';
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

    const payment = payments[0];

    const tags: PaymentTags = {
      payee: payment.payee,
      role: payment.role,
      activity: payment.activity,
      venue: payment.venue,
      end_date: payment.endDate,
      amount: payment.honorarium.toString(),
      tax: payment.taxRate.toString(),
      focal: payment.focal,
      position: payment.position,
      date: '',
      amount_words: '',
    };

    const cert = await patchDoc(tags);

    if (!cert) throw new Error('failed to patch document');

    return new Response(cert, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="certification-ac-${activity_id}.docx"`,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
};
