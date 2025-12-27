const mfoCodes = {
  BEC: '310100100003000',
  ELLN: '310100100007000',
  FLO: '310300100003000',
} as const satisfies Record<string, string>;

type Appropriation = 'Current' | 'Continuing';
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
  const appropriationType: Appropriation = code.startsWith('P') ? 'Continuing' : 'Current';
  return {
    year: parseInt(year) + 2000,
    appropriationType,
    program,
    mfoCode,
  };
}
