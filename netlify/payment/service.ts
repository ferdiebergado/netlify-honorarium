import type { PaymentFormValues } from '../../src/shared/schema';
import { db } from '../db';
import { createPayment } from './repo';

export async function newPayment(payment: PaymentFormValues, userId: number) {
  await createPayment(db, payment, userId);
}
