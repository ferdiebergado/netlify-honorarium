PRAGMA foreign_keys = OFF;

BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS activities (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  venue_id INTEGER NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  code TEXT NOT NULL,
  focal_id INTEGER NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT,
  created_by INTEGER NOT NULL,
  updated_by INTEGER NOT NULL,
  deleted_by INTEGER,
  FOREIGN KEY (deleted_by) REFERENCES users (id),
  FOREIGN KEY (updated_by) REFERENCES users (id),
  FOREIGN KEY (created_by) REFERENCES users (id),
  FOREIGN KEY (venue_id) REFERENCES venues (id),
  FOREIGN KEY (focal_id) REFERENCES focals (id)
);

CREATE TABLE IF NOT EXISTS venues (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT,
  created_by INTEGER NOT NULL,
  updated_by INTEGER NOT NULL,
  deleted_by INTEGER,
  FOREIGN KEY (deleted_by) REFERENCES users (id),
  FOREIGN KEY (updated_by) REFERENCES users (id),
  FOREIGN KEY (created_by) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS positions (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT,
  created_by INTEGER NOT NULL,
  updated_by INTEGER NOT NULL,
  deleted_by INTEGER,
  FOREIGN KEY (deleted_by) REFERENCES users (id),
  FOREIGN KEY (updated_by) REFERENCES users (id),
  FOREIGN KEY (created_by) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS focals (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  position_id INTEGER NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT,
  created_by INTEGER NOT NULL,
  updated_by INTEGER NOT NULL,
  deleted_by INTEGER,
  FOREIGN KEY (deleted_by) REFERENCES users (id),
  FOREIGN KEY (created_by) REFERENCES users (id),
  FOREIGN KEY (updated_by) REFERENCES users (id),
  FOREIGN KEY (position_id) REFERENCES positions (id)
);

CREATE TABLE IF NOT EXISTS payees (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  office TEXT,
  position TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT,
  created_by INTEGER NOT NULL,
  updated_by INTEGER NOT NULL,
  deleted_by INTEGER,
  FOREIGN KEY (deleted_by) REFERENCES users (id),
  FOREIGN KEY (updated_by) REFERENCES users (id),
  FOREIGN KEY (created_by) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS accounts (
  id INTEGER PRIMARY KEY,
  payee_id INTEGER NOT NULL,
  bank_id INTEGER NOT NULL,
  details BLOB NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT,
  created_by INTEGER NOT NULL,
  updated_by INTEGER NOT NULL,
  deleted_by INTEGER,
  FOREIGN KEY (deleted_by) REFERENCES users (id),
  FOREIGN KEY (updated_by) REFERENCES users (id),
  FOREIGN KEY (created_by) REFERENCES users (id),
  FOREIGN KEY (payee_id) REFERENCES payees (id),
  FOREIGN KEY (bank_id) REFERENCES banks (id),
  UNIQUE (payee_id, details)
);

CREATE TABLE IF NOT EXISTS banks (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT,
  created_by INTEGER NOT NULL,
  updated_by INTEGER NOT NULL,
  deleted_by INTEGER,
  FOREIGN KEY (deleted_by) REFERENCES users (id),
  FOREIGN KEY (updated_by) REFERENCES users (id),
  FOREIGN KEY (created_by) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS salaries (
  id INTEGER PRIMARY KEY,
  payee_id INTEGER NOT NULL,
  salary REAL NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT,
  created_by INTEGER NOT NULL,
  updated_by INTEGER NOT NULL,
  deleted_by INTEGER,
  FOREIGN KEY (deleted_by) REFERENCES users (id),
  FOREIGN KEY (updated_by) REFERENCES users (id),
  FOREIGN KEY (created_by) REFERENCES users (id),
  FOREIGN KEY (payee_id) REFERENCES payees (id),
  UNIQUE (payee_id, salary)
);

CREATE TABLE IF NOT EXISTS roles (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT,
  created_by INTEGER NOT NULL,
  updated_by INTEGER NOT NULL,
  deleted_by INTEGER,
  FOREIGN KEY (deleted_by) REFERENCES users (id),
  FOREIGN KEY (updated_by) REFERENCES users (id),
  FOREIGN KEY (created_by) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY,
  activity_id INTEGER NOT NULL,
  payee_id INTEGER NOT NULL,
  salary_id INTEGER NOT NULL,
  role_id INTEGER NOT NULL,
  honorarium REAL NOT NULL,
  hours_rendered REAL NOT NULL,
  actual_honorarium REAL NOT NULL,
  net_honorarium REAL NOT NULL,
  tax_rate REAL NOT NULL,
  account_id INTEGER NOT NULL,
  tin_id INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT,
  created_by INTEGER NOT NULL,
  updated_by INTEGER NOT NULL,
  deleted_by INTEGER,
  FOREIGN KEY (deleted_by) REFERENCES users (id),
  FOREIGN KEY (updated_by) REFERENCES users (id),
  FOREIGN KEY (created_by) REFERENCES users (id),
  FOREIGN KEY (activity_id) REFERENCES activities (id),
  FOREIGN KEY (payee_id) REFERENCES payees (id),
  FOREIGN KEY (salary_id) REFERENCES salaries (id),
  FOREIGN KEY (role_id) REFERENCES roles (id),
  FOREIGN KEY (account_id) REFERENCES accounts (id)
);

CREATE TABLE IF NOT EXISTS tins (
  id INTEGER PRIMARY KEY,
  tin TEXT NOT NULL,
  payee_id INTEGER NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT,
  created_by INTEGER NOT NULL,
  updated_by INTEGER NOT NULL,
  deleted_by INTEGER,
  FOREIGN KEY (deleted_by) REFERENCES users (id),
  FOREIGN KEY (updated_by) REFERENCES users (id),
  FOREIGN KEY (created_by) REFERENCES users (id),
  FOREIGN KEY (payee_id) REFERENCES payees (id),
  UNIQUE (payee_id, tin)
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  google_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  picture TEXT NOT NULL,
  last_login_at TEXT DEFAULT CURRENT_TIMESTAMP,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  user_id INTEGER NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  expires_at TEXT NOT NULL,
  last_active_at TEXT DEFAULT CURRENT_TIMESTAMP,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT,
  is_revoked INTEGER DEFAULT 0 CHECK (is_revoked IN (0, 1)),
  FOREIGN KEY (user_id) REFERENCES users (id)
);

COMMIT;

PRAGMA foreign_keys = ON;
