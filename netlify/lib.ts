import { ToWords } from 'to-words';
import { NotFoundError } from './errors';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function toDateRange(startDate: string, endDate: string): string {
  console.debug('startDate:', startDate, 'endDate:', endDate);

  const start = new Date(startDate);
  const end = new Date(endDate);

  const startMonth = start.getMonth();
  const endMonth = end.getMonth();

  const startDay = start.getDate();
  const endDay = end.getDate();

  console.debug('startDay:', startDay, 'endDay:', endDay);
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();

  if (startYear === endYear) {
    if (startMonth === endMonth) {
      return `${months[startMonth]} ${startDay.toString()}-${endDay.toString()}, ${startYear.toString()}`;
    } else if (endMonth > startMonth) {
      return `${months[startMonth]} ${startDay.toString()}-${months[endMonth]} ${endDay.toString()}, ${startYear.toString()}`;
    }
  } else if (endYear > startYear) {
    if (startMonth === endMonth) {
      return `${months[startMonth]} ${startDay.toString()}-${endDay.toString()}, ${endYear.toString()}`;
    } else if (endMonth > startMonth) {
      return `${months[startMonth]} ${startDay.toString()}-${months[endMonth]} ${endDay.toString()}, ${endYear.toString()}`;
    }
  }

  throw new Error('invalid date range');
}

export function formatDate(date: string): string {
  const dateObject: Date = new Date(date + 'T00:00:00');

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat('en-US', options).format(dateObject);
}

export function formatToPhp(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    currencyDisplay: 'code',
  }).format(amount);
}

export function amountToWords(amount: number): string {
  return new ToWords({ localeCode: 'en-PH' }).convert(amount, {
    currency: true,
    doNotAddOnly: true,
  });
}

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function docxResponse(body: Buffer, filename: string) {
  return new Response(body, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${filename}.docx"`,
    },
  });
}

export function xlsxResponse(body: Buffer, filename: string) {
  return new Response(body, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}.docx"`,
    },
  });
}

export function toBuffer(value: ArrayBuffer | Uint8Array | Buffer): Buffer {
  if (Buffer.isBuffer(value)) {
    return value;
  }

  if (value instanceof ArrayBuffer) {
    return Buffer.from(value);
  }

  // Uint8Array (and other views)
  return Buffer.from(value.buffer, value.byteOffset, value.byteLength);
}

export function parseId(id: string): number {
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) throw new NotFoundError();

  return parsedId;
}
