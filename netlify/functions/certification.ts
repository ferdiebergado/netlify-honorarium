import type { Config, Context } from '@netlify/functions';
import { errorResponse, ResourceNotFoundError } from '../errors';
import { docxResponse, parseId } from '../lib';
import { generateCertification } from '../payment';
import { getPayments } from '../payment/payments';

export const config: Config = {
  method: 'POST',
  path: '/api/activities/:activity_id/certification',
};

export default async (_req: Request, ctx: Context) => {
  console.log('Generating certification...');

  try {
    const activityId = parseId(ctx.params.activity_id);

    const payments = await getPayments(activityId);

    if (payments.length === 0)
      throw new ResourceNotFoundError(
        `No payments found for activity with id: ${activityId.toString()}`
      );

    const { doc, filename } = await generateCertification(payments);
    return docxResponse(doc, filename);
  } catch (error) {
    return errorResponse(error);
  }
};
