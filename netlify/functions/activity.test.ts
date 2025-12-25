import { describe, expect, it } from 'vitest';
import { parseActivityCode, type FundCluster } from './activity';

describe('parseActivityCode', () => {
  it('parses year correctly', () => {
    const activityCode = 'AC-24-LDB-LDT-FLO-091';
    const got = parseActivityCode(activityCode);
    const want: FundCluster = {
      year: 2024,
      appropriationType: 'current',
      program: 'FLO',
      mfoCode: '310300100003000',
    };
    expect(got).toEqual(want);
  });

  it('parses continuing funds correctly', () => {
    const activityCode = 'AC-25-LDB-LDT-FLO-P091';
    const got = parseActivityCode(activityCode);
    const want: FundCluster = {
      year: 2025,
      appropriationType: 'continuing',
      program: 'FLO',
      mfoCode: '310300100003000',
    };
    expect(got).toEqual(want);
  });

  it('parses current funds correctly', () => {
    const activityCode = 'AC-25-LDB-LDT-FLO-091';
    const got = parseActivityCode(activityCode);
    const want: FundCluster = {
      year: 2025,
      appropriationType: 'current',
      program: 'FLO',
      mfoCode: '310300100003000',
    };
    expect(got).toEqual(want);
  });

  it('parses program correctly', () => {
    const activityCode = 'AC-24-LDB-LDT-BEC-091';
    const got = parseActivityCode(activityCode);
    const want: FundCluster = {
      year: 2024,
      appropriationType: 'current',
      program: 'BEC',
      mfoCode: '310100100003000',
    };
    expect(got).toEqual(want);
  });

  it('parses alternative activity code format correctly', () => {
    const activityCode = 'AC-24-LDB-LDT-BEC-2-001';
    const got = parseActivityCode(activityCode);
    const want: FundCluster = {
      year: 2024,
      appropriationType: 'current',
      program: 'BEC',
      mfoCode: '310100100003000',
    };
    expect(got).toEqual(want);
  });
});
