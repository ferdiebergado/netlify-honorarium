import * as z from 'zod';

// TODO: validate range and length
export const schema = z.object({
  title: z.string().min(1),
  venueId: z.number().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  code: z.string().min(1),
  focalId: z.number().min(1),
});

const mfoCodes = {
  BEC: '310100100003000',
  ELLN: '310100100007000',
  FLO: '310300100003000',
} as const satisfies Record<string, string>;

type Appropriation = 'current' | 'continuing';
type Program = keyof typeof mfoCodes;

export type FundCluster = {
  year: number;
  appropriationType: Appropriation;
  program: Program;
  mfoCode: (typeof mfoCodes)[Program];
};

export function parseActivityCode(activityCode: string): FundCluster {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, year, _bureau, _division, pap, code] = activityCode.split('-');

  const program = pap as Program;
  const mfoCode = mfoCodes[program];
  const appropriationType: Appropriation = code.startsWith('P') ? 'continuing' : 'current';
  return {
    year: parseInt(year) + 2000,
    appropriationType,
    program,
    mfoCode,
  };
}
