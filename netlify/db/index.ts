import {
  createClient,
  type Client,
  type InArgs,
  type InStatement,
  type ResultSet,
} from '@libsql/client';

const DEFAULT_DB = 'file:local.db';

export interface Database {
  execute(stmt: InStatement): Promise<ResultSet>;
  execute(sql: string, args?: InArgs): Promise<ResultSet>;
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
