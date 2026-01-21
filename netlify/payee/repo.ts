import type {
  CreateAccountFormValues,
  CreatePayeeFormValues,
  Payee,
  Salary,
  Tin,
} from '../../src/shared/schema';
import { type Database } from '../db';
import { ResourceNotFoundError } from '../errors';
import { serializeDetails, type AccountDetails } from './account';

type NewPayee = {
  payeeId: number;
  accountId: number;
  salaryId: number;
  tinId?: number;
};

export type PayeeData = Pick<Payee, 'name' | 'office' | 'position'>;

export async function createPayee(
  db: Database,
  data: CreatePayeeFormValues,
  userId: number
): Promise<NewPayee> {
  const {
    name,
    office,
    position,
    salary,
    bankId,
    bankBranch,
    accountNo,
    accountName,
    tin = null,
  } = data;

  const payeeId = await insertPayee(db, { name, office, position }, userId);

  const accountId = await insertAccount(
    db,
    { bankBranch, accountName, accountNo, payeeId, bankId },
    userId
  );

  const salaryId = await insertSalary(db, { salary, payeeId }, userId);

  let tinId;

  if (tin) tinId = await insertTin(db, { tin, payeeId }, userId);

  return { payeeId, accountId, salaryId, tinId };
}

export async function insertPayee(db: Database, payee: PayeeData, userId: number): Promise<number> {
  const sql = `
INSERT INTO
    payees 
        (
            name,
            office,
            position,
            created_by,
            updated_by
        ) 
VALUES 
    (?, ?, ?, ?, ?)
RETURNING
    id`;

  const { rows } = await db.execute(sql, [
    payee.name,
    payee.office,
    payee.position,
    userId,
    userId,
  ]);

  if (rows.length === 0) throw new Error('Failed to insert payee: no data returned.');

  return rows[0].id as number;
}

export type AccountData = CreateAccountFormValues & { payeeId: number };

export async function insertAccount(
  db: Database,
  { bankBranch, accountName, accountNo, payeeId, bankId }: AccountData,
  userId: number
): Promise<number> {
  const details: AccountDetails = { bankBranch, accountName, accountNo };
  const detailsBlob = serializeDetails(details);

  const sql = `
INSERT INTO
    accounts 
        (
            payee_id,
            bank_id,
            details,
            created_by,
            updated_by
        )
VALUES 
    (?, ?, ?, ?, ?)
RETURNING
    id`;

  const { rows } = await db.execute(sql, [payeeId, bankId, detailsBlob, userId, userId]);

  if (rows.length === 0) throw new Error('Failed to insert account: no data returned.');

  return rows[0].id as number;
}

export async function insertSalary(
  db: Database,
  { salary, payeeId }: Omit<Salary, 'id'>,
  userId: number
): Promise<number> {
  const sql = `
INSERT INTO
    salaries 
        (
            payee_id,
            salary,
            created_by,
            updated_by
        )
VALUES 
    (?, ?, ?, ?)
RETURNING
    id`;

  const { rows } = await db.execute(sql, [payeeId, salary, userId, userId]);

  if (rows.length === 0) throw new Error('Failed to insert salary: no data returned.');

  return rows[0].id as number;
}

export async function insertTin(db: Database, { tin, payeeId }: Omit<Tin, 'id'>, userId: number) {
  const sql = `
INSERT INTO
    tins
        (
          payee_id,
          tin,
          created_by,
          updated_by
        )
VALUES
    (?, ?, ?, ?)
RETURNING
    id`;

  const { rows } = await db.execute(sql, [payeeId, tin, userId, userId]);

  if (rows.length === 0) throw new Error('Failed to insert tin: no data returned.');

  return rows[0].id as number;
}

export async function findPayeeAccounts(db: Database, payeeId: number) {
  const sql = `
SELECT
  a.id,
  a.details,
  p.id AS payee_id,
  p.name AS payee,
  b.id AS bank_id,
  b.name AS bank
FROM
  accounts a
JOIN
  payees p
ON
  p.id = a.payee_id
JOIN
  banks b
ON
  b.id = a.bank_id
WHERE
  a.deleted_at IS NULL
AND 
  p.id = ?`;

  const { rows } = await db.execute(sql, [payeeId]);

  if (rows.length === 0)
    throw new ResourceNotFoundError(`Payee with id: ${payeeId.toString()} has no active accounts.`);

  return rows;
}
