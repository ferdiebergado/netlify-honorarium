import { describe, expect, it } from 'vitest';
import { computeHonorarium, type Honorarium } from './payments';

type Given = {
  honorarium: number;
  salary: number;
};

type TestCase = { given: Given; want: Honorarium };

const testCases: TestCase[] = [
  {
    given: {
      honorarium: 30000,
      salary: 41633.47,
    },
    want: {
      hoursRendered: 32,
      actualHonorarium: 30642.23,
    },
  },
  {
    given: {
      honorarium: 25000,
      salary: 78642,
    },
    want: {
      hoursRendered: 14,
      actualHonorarium: 25322.72,
    },
  },
  {
    given: {
      honorarium: 30000,
      salary: 200000,
    },
    want: {
      hoursRendered: 8,
      actualHonorarium: 33210.53,
    },
  },
];

describe('computeHonorarium', () => {
  it.each(testCases)(
    'computes hours rendered and actual honorarium correctly',
    ({ given, want }) => {
      const { honorarium, salary } = given;

      const got = computeHonorarium(honorarium, salary);
      expect(got).toEqual(want);
    }
  );
});
