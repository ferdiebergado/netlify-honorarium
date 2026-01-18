import { describe, expect, it } from 'vitest';
import { computeHonorarium, type Honorarium } from './payments';

type Given = {
  honorarium: number;
  salary: number;
  taxRate: number;
};

type TestCase = { given: Given; want: Honorarium };

const testCases: TestCase[] = [
  {
    given: {
      honorarium: 30000,
      salary: 41633.47,
      taxRate: 10,
    },
    want: {
      hoursRendered: 32,
      actualHonorarium: 30642.23,
      netHonorarium: 27000,
    },
  },
  {
    given: {
      honorarium: 25000,
      salary: 78642,
      taxRate: 10,
    },
    want: {
      hoursRendered: 14,
      actualHonorarium: 25322.72,
      netHonorarium: 22500,
    },
  },
  {
    given: {
      honorarium: 30000,
      salary: 200000,
      taxRate: 10,
    },
    want: {
      hoursRendered: 8,
      actualHonorarium: 33210.53,
      netHonorarium: 27000,
    },
  },
];

describe('computeHonorarium', () => {
  it.each(testCases)(
    'computes hours rendered and actual honorarium correctly',
    ({ given, want }) => {
      const { honorarium, salary, taxRate } = given;

      const got = computeHonorarium(honorarium, salary, taxRate);
      expect(got).toEqual(want);
    }
  );
});
