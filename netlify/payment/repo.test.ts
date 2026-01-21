import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type {
  ActivityFormValues,
  CreatePayeeFormValues,
  PaymentFormValues,
} from '../../src/shared/schema';
import { create } from '../activity/repo';
import type { Database } from '../db';
import { createPayee } from '../payee/repo';
import { createRole } from '../role/repo';
import { assertTimestamps, assertUser, seedDb, setupTestDb, type BaseRow } from '../test-utils';
import { computeHonorarium } from './payments';
import { createPayment } from './repo';

describe('createPayment', () => {
  const userId = 1;
  let db: Database;

  beforeEach(async () => {
    db = await setupTestDb();
    await seedDb(db);
  });

  afterEach(() => {
    db.close();
  });

  it('should insert payment and return the new id', async () => {
    const startTime = Date.now();
    const mockActivity: ActivityFormValues = {
      title: 'test',
      venueId: 1,
      startDate: new Date(2026, 0, 21).toISOString(),
      endDate: new Date(2026, 0, 23).toISOString(),
      code: 'AC-26-ABC-DEF-GHIJ-001',
      focalId: 1,
    };
    const activityId = await create(db, mockActivity, userId);

    const mockPayee: CreatePayeeFormValues = {
      name: 'Mr. Jones',
      office: 'Cloud 11',
      position: 'CEO',
      bankId: 1,
      bankBranch: 'Governors Drive',
      accountName: 'Palito',
      accountNo: '445566',
      salary: 30000,
      tin: '3332211',
    };

    const { payeeId, accountId, salaryId, tinId } = await createPayee(db, mockPayee, userId);

    const roleId = await createRole(db, { name: 'Developer' }, userId);
    const mockPayment: PaymentFormValues = {
      activityId,
      payeeId,
      honorarium: 30000,
      taxRate: 10,
      salaryId,
      accountId,
      roleId,
      tinId,
    };

    const paymentId = await createPayment(db, mockPayment, userId);

    expect(paymentId).toBeTypeOf('number');
    expect(paymentId).toBeGreaterThan(0);

    const sql = 'SELECT * FROM payments WHERE id = ?';
    const { rows } = await db.execute(sql, [paymentId]);
    expect(rows.length).toBe(1);

    const newPayment = rows[0];
    expect(newPayment.activity_id).toBe(activityId);
    expect(newPayment.payee_id).toBe(payeeId);
    expect(newPayment.salary_id).toBe(salaryId);
    expect(newPayment.role_id).toBe(roleId);
    expect(newPayment.honorarium).toBe(mockPayment.honorarium);

    const { actualHonorarium, netHonorarium, hoursRendered } = computeHonorarium(
      mockPayment.honorarium,
      mockPayee.salary,
      mockPayment.taxRate
    );
    expect(newPayment.hours_rendered).toBe(hoursRendered);
    expect(newPayment.actual_honorarium).toBe(actualHonorarium);
    expect(newPayment.net_honorarium).toBe(netHonorarium);
    expect(newPayment.tax_rate).toBe(mockPayment.taxRate);
    expect(newPayment.account_id).toBe(accountId);
    expect(newPayment.tin_id).toBe(tinId);

    assertTimestamps(newPayment as unknown as BaseRow, startTime);
    assertUser(newPayment as unknown as BaseRow, userId);
  });
});
