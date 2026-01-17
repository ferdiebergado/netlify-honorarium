import { randomBytes } from 'crypto';

process.env.APP_KEY = randomBytes(32).toString('hex');
process.env.TURSO_DATABASE_URL = ':memory:';
