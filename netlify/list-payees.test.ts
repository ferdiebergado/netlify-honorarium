import { describe, expect, it } from 'vitest';
import type { PayeeData } from '../src/shared/schema';
import { rowsToPayees, type PayeeRow } from './functions/list-payees';
import { encrypt } from './security';

describe('rowsToPayees', () => {
  it('returns payee data correctly', () => {
    const given: PayeeRow[] = [
      {
        id: 1,
        name: 'agnis',
        salary: 13000,
        bank_name: 'LBP',
        details: encrypt(
          Buffer.from(
            JSON.stringify({
              accountName: 'agnis',
              accountNo: '4444',
              bankBranch: 'lantic',
            })
          )
        ),
        salary_id: 1,
        account_id: 1,
      },
      {
        id: 1,
        name: 'agnis',
        salary: 13000,
        bank_name: 'BDO',
        details: encrypt(
          Buffer.from(
            JSON.stringify({
              accountName: 'agnis',
              accountNo: '5555',
              bankBranch: 'milagrosa',
            })
          )
        ),
        tin_id: 1,
        tin: '1313',
        salary_id: 1,
        account_id: 2,
      },
    ];

    const got = rowsToPayees(given);
    const want: PayeeData[] = [
      {
        id: 1,
        name: 'agnis',
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
