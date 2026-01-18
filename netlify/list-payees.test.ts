import { describe, expect, it } from 'vitest';
import type { Payee } from '../src/shared/schema';
import { rowsToPayees, type PayeeData } from './functions/list-payees';
import { serializeDetails } from './payee/account';

describe('rowsToPayees', () => {
  it('returns payee data correctly', () => {
    const given: PayeeData[] = [
      {
        id: 1,
        name: 'agnis',
        position: 'Student',
        office: 'CNHS',
        salary: 13000,
        bank: 'LBP',
        details: serializeDetails({
          accountName: 'agnis',
          accountNo: '4444',
          bankBranch: 'lantic',
        }),
        salaryId: 1,
        accountId: 1,
      },
      {
        id: 1,
        name: 'agnis',
        position: 'Student',
        office: 'CNHS',
        salary: 13000,
        bank: 'BDO',
        details: serializeDetails({
          accountName: 'agnis',
          accountNo: '5555',
          bankBranch: 'milagrosa',
        }),
        tinId: 1,
        tin: '1313',
        salaryId: 1,
        accountId: 2,
      },
    ];

    const got = rowsToPayees(given);
    const want: Payee[] = [
      {
        id: 1,
        name: 'agnis',
        position: 'Student',
        office: 'CNHS',
        salaries: [{ salary: 13000, id: 1 }],
        accounts: [
          {
            id: 1,
            accountName: 'agnis',
            accountNo: '4444',
            bank: 'LBP',
            bankBranch: 'lantic',
          },
          {
            id: 2,
            accountName: 'agnis',
            accountNo: '5555',
            bank: 'BDO',
            bankBranch: 'milagrosa',
          },
        ],
        tins: [{ id: 1, tin: '1313' }],
      },
    ];

    expect(got).toEqual(want);
  });
});
