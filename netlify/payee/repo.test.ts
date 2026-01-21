import type { Client } from '@libsql/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { CreatePayeeFormValues, Salary, Tin } from '../../src/shared/schema';
import { runInTransaction, type Database } from '../db';
import { assertTimestamps, assertUser, seedDb, setupTestDb, type BaseRow } from '../test-utils';
import { deserializeDetails } from './account';
import {
  createPayee,
  findPayeeAccounts,
  insertAccount,
  insertPayee,
  insertSalary,
  insertTin,
  type AccountData,
  type PayeeData,
} from './repo';

const userId = 1;
const bankId = 1;
const tin = '4444556';

const mockPayee: PayeeData = {
  name: 'Jimmy Basilio',
  office: 'KKK Warehouse',
  position: 'Manager',
};

const mockAccountData: AccountData = {
  bankBranch: 'Lantic',
  accountName: 'Melchora Aquino',
  accountNo: '123456',
  payeeId: 0,
  bankId,
};

const mockPayeeData: CreatePayeeFormValues = {
  ...mockPayee,
  ...mockAccountData,
  salary: 20000,
  tin,
};

describe('payee-repo', () => {
  let db: Database;

  beforeEach(async () => {
    db = await setupTestDb();
    await seedDb(db);
  });

  afterEach(() => {
    db.close();
  });

  describe('insertPayee', () => {
    it('should insert payee and return the new id', async () => {
      const startTime = Date.now();

      const payeeId = await insertPayee(db, mockPayee, userId);
      expect(payeeId).toBeTypeOf('number');
      expect(payeeId).toBeGreaterThan(0);

      assertPayee(db, payeeId, startTime);
    });

    it('should throw an error if the user does not exist', async () => {
      const nonExistentUserId = 999;

      await expect(insertPayee(db, mockPayee, nonExistentUserId)).rejects.toThrow();
    });
  });

  describe('insertAccount', () => {
    it('should insert account and return the new id', async () => {
      const startTime = Date.now();

      const payeeId = await insertPayee(db, mockPayee, userId);
      const accountId = await insertAccount(db, { ...mockAccountData, bankId, payeeId }, userId);
      expect(accountId).toBeTypeOf('number');
      expect(accountId).toBeGreaterThan(0);

      assertAccount(db, accountId, mockAccountData, startTime);
    });

    it('should throw an error if the user does not exist', async () => {
      const nonExistentUserId = 999;

      await expect(
        insertAccount(db, { ...mockAccountData, bankId, payeeId: 1 }, nonExistentUserId)
      ).rejects.toThrow();
    });
  });

  describe('insertSalary', () => {
    it('should insert salary and return the new id', async () => {
      const startTime = Date.now();

      const payeeId = await insertPayee(db, mockPayee, userId);

      const mockSalary: Omit<Salary, 'id'> = { salary: 25000, payeeId };
      const salaryId = await insertSalary(db, mockSalary, userId);
      expect(salaryId).toBeTypeOf('number');
      expect(salaryId).toBeGreaterThan(0);

      assertSalary(db, salaryId, mockSalary, startTime);
    });

    it('should throw an error if the user does not exist', async () => {
      const nonExistentUserId = 999;

      await expect(
        insertSalary(db, { salary: 10000, payeeId: 1 }, nonExistentUserId)
      ).rejects.toThrow();
    });
  });

  describe('insertTin', () => {
    it('should insert tin and return the new id', async () => {
      const startTime = Date.now();

      const payeeId = await insertPayee(db, mockPayee, userId);

      const mockTin: Omit<Tin, 'id'> = {
        tin: '1111223',
        payeeId,
      };
      const tinId = await insertTin(db, mockTin, userId);

      expect(tinId).toBeTypeOf('number');
      expect(tinId).toBeGreaterThan(0);

      assertTin(db, tinId, mockTin, startTime);
    });

    it('should throw an error if the user does not exist', async () => {
      const nonExistentUserId = 999;

      await expect(
        insertTin(db, { tin: '4444556', payeeId: 1 }, nonExistentUserId)
      ).rejects.toThrow();
    });
  });

  describe('createPayee', () => {
    it('should create payee and return the new ids', async () => {
      const startTime = Date.now();

      const { payeeId, salaryId, accountId, tinId } = await runInTransaction(
        db as Client,
        createPayee,
        [mockPayeeData, userId]
      );
      expect(payeeId).toBeTypeOf('number');
      expect(payeeId).toBe(1);
      assertPayee(db, payeeId, startTime);

      expect(accountId).toBeTypeOf('number');
      expect(accountId).toBe(1);
      assertAccount(db, accountId, mockAccountData, startTime);

      expect(salaryId).toBeTypeOf('number');
      expect(salaryId).toBe(1);
      assertSalary(db, salaryId, { salary: mockPayeeData.salary, payeeId }, startTime);

      if (tinId) {
        expect(tinId).toBeTypeOf('number');
        expect(tinId).toBe(1);
        if (mockPayeeData.tin) assertTin(db, tinId, { tin: mockPayeeData.tin, payeeId }, startTime);
      }
    });
  });

  describe('findPayeeAccounts', () => {
    it('should return the accounts of the payee', async () => {
      const { payeeId } = await createPayee(db, mockPayeeData, userId);
      const accounts = await findPayeeAccounts(db, payeeId);
      expect(accounts.length).toBe(1);
    });
  });
});

async function assertPayee(db: Database, id: number, startTime: number) {
  const { rows } = await db.execute('SELECT * FROM payees WHERE id = ?', [id]);
  expect(rows.length).toBe(1);

  const newPayee = rows[0];
  expect(newPayee.name).toBe(mockPayee.name);
  expect(newPayee.office).toBe(mockPayee.office);
  expect(newPayee.position).toBe(mockPayee.position);

  assertTimestamps(newPayee as unknown as BaseRow, startTime);
  assertUser(newPayee as unknown as BaseRow, userId);
}

async function assertAccount(
  db: Database,
  id: number,
  mockAccountData: AccountData,
  startTime: number
) {
  const { rows } = await db.execute('SELECT * FROM accounts WHERE id = ?', [id]);
  expect(rows.length).toBe(1);

  const newAccount = rows[0];
  expect(newAccount.bank_id).toBe(bankId);

  const { bankBranch, accountName, accountNo } = deserializeDetails(
    newAccount.details as unknown as Buffer
  );

  expect(bankBranch).toBe(mockAccountData.bankBranch);
  expect(accountName).toBe(mockAccountData.accountName);
  expect(accountNo).toBe(mockAccountData.accountNo);

  assertTimestamps(newAccount as unknown as BaseRow, startTime);
  assertUser(newAccount as unknown as BaseRow, userId);
}

async function assertSalary(
  db: Database,
  id: number,
  mockSalary: Omit<Salary, 'id'>,
  startTime: number
) {
  const { rows } = await db.execute('SELECT * FROM salaries WHERE id = ?', [id]);
  expect(rows.length).toBe(1);

  const newSalary = rows[0];
  expect(newSalary.salary).toBe(mockSalary.salary);
  expect(newSalary.payee_id).toBe(mockSalary.payeeId);

  assertTimestamps(newSalary as unknown as BaseRow, startTime);
  assertUser(newSalary as unknown as BaseRow, userId);
}

async function assertTin(db: Database, id: number, mockData: Omit<Tin, 'id'>, startTime: number) {
  const { rows } = await db.execute('SELECT * FROM tins WHERE id = ?', [id]);
  expect(rows.length).toBe(1);

  const newTin = rows[0];
  expect(newTin.tin).toBe(mockData.tin);
  expect(newTin.payee_id).toBe(mockData.payeeId);

  assertTimestamps(newTin as unknown as BaseRow, startTime);
  assertUser(newTin as unknown as BaseRow, userId);
}
