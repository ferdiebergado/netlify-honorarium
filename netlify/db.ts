import {
  createClient,
  type Client,
  type InArgs,
  type InStatement,
  type ResultSet,
  type Row,
} from '@libsql/client';

const DEFAULT_DB = 'file:local.db';

export type TResultSet<T> = Omit<ResultSet, 'rows'> & {
  rows: T[];
};

export interface Database {
  execute<T = Row>(stmt: InStatement): Promise<TResultSet<T>>;
  execute<T = Row>(sql: string, args?: InArgs): Promise<TResultSet<T>>;
  close: () => void;
}

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL ?? DEFAULT_DB,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function runInTransaction<TArgs extends unknown[], TReturn>(
  db: Client,
  fn: (tx: Database, ...args: TArgs) => Promise<TReturn>,
  args: TArgs
): Promise<TReturn> {
  console.log('Beginning transaction...');

  const tx = await db.transaction();

  try {
    const res = await fn(tx, ...args);
    console.log('Committing transaction...');
    await tx.commit();
    return res;
  } catch (error) {
    console.error('Transaction failed:', error);
    console.log('Rolling back transaction...');
    await tx.rollback();
    throw error;
  } finally {
    console.log('Closing transaction...');
    tx.close();
  }
}
