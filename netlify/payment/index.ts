import { mergeDocx } from '@benedicte/docx-merge';
import type { Payment } from '../../src/shared/schema';
import { amountToWords, formatToPhp, patchDoc, toDateRange } from '../lib';
import { certification } from './certification';

type Certification = {
  filename: string;
  doc: Buffer;
};

export async function generateCertification(data: CertificationData[]): Promise<Certification> {
  if (data.length === 0) {
    throw new Error('cannot generate certification: no data provided');
  }

  const firstPayment = data[0];
  const filename = 'certification-' + firstPayment.activityCode;

  const patches = createPatches(firstPayment);
  const firstCert = await patchDoc(certification, patches);

  if (data.length === 1) return { doc: firstCert, filename };

  const patchDocs = data.slice(1).map(async payment => {
    const patches = createPatches(payment);
    const patched = await patchDoc(certification, patches);

    return patched;
  });

  const patchedDocs = await Promise.all(patchDocs);

  const doc = patchedDocs.reduce((acc, curr) => {
    const merged = mergeDocx(acc, curr, { insertEnd: true });
    if (!merged) throw new Error('failed to merge documents');
    return merged;
  }, firstCert);

  return { doc, filename };
}

export type CertificationData = Pick<
  Payment,
  | 'payee'
  | 'role'
  | 'activity'
  | 'venue'
  | 'honorarium'
  | 'taxRate'
  | 'focal'
  | 'position'
  | 'startDate'
  | 'endDate'
  | 'activityCode'
>;

type CertificationPatches = Pick<
  Payment,
  'payee' | 'role' | 'activity' | 'venue' | 'focal' | 'position'
> & {
  date: string;
  end_date: string;
  amount_words: string;
  amount: string;
  tax: string;
};

function createPatches(data: CertificationData): CertificationPatches {
  return {
    payee: data.payee.toLocaleUpperCase(),
    role: data.role,
    activity: data.activity,
    venue: data.venue,
    end_date: new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    amount: formatToPhp(data.honorarium),
    tax: data.taxRate.toString(),
    focal: data.focal.toLocaleUpperCase(),
    position: data.position,
    date: toDateRange(data.startDate, data.endDate),
    amount_words: amountToWords(data.honorarium),
  };
}
