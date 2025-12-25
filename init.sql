PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS activities (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  venue_id INTEGER NOT NULL,
  code TEXT NOT NULL,
  focal_id INTEGER NOT NULL,
  created_at TEXT,
  updated_at TEXT,
  deleted_at TEXT, start_date TEXT NOT NULL, end_date TEXT NOT NULL,
  FOREIGN KEY (venue_id) REFERENCES venues (id),
  FOREIGN KEY (focal_id) REFERENCES focals (id)
);
CREATE TABLE IF NOT EXISTS venues (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TEXT,
  updated_at TEXT,
  deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS positions (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TEXT,
  updated_at TEXT,
  deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS focals (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  position_id INTEGER NOT NULL,
  created_at TEXT,
  updated_at TEXT,
  deleted_at TEXT,
  FOREIGN KEY (position_id) REFERENCES positions (id)
);

CREATE TABLE IF NOT EXISTS payees (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TEXT,
  updated_at TEXT,
  deleted_at TEXT
, office TEXT, position TEXT);

CREATE TABLE IF NOT EXISTS accounts (
  id INTEGER PRIMARY KEY,
  payee_id INTEGER NOT NULL,
  bank_id INTEGER NOT NULL,
  bank_branch TEXT NOT NULL,
  account_no TEXT NOT NULL,
  account_name TEXT NOT NULL,
  created_at TEXT,
  updated_at TEXT,
  deleted_at TEXT,
  FOREIGN KEY (payee_id) REFERENCES payees (id),
  FOREIGN KEY (bank_id) REFERENCES banks (id)
);
CREATE TABLE IF NOT EXISTS banks (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
    created_at TEXT,
  updated_at TEXT,
  deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS salaries (
  id INTEGER PRIMARY KEY,
  payee_id INTEGER NOT NULL,
  salary REAL NOT NULL,
    created_at TEXT,
  updated_at TEXT,
    deleted_at TEXT,
  FOREIGN KEY (payee_id) REFERENCES payees (id)
);
CREATE TABLE IF NOT EXISTS roles (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
      created_at TEXT,
  updated_at TEXT,
    deleted_at TEXT
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
  created_at TEXT,
  updated_at TEXT, 
  deleted_at TEXT, 
  FOREIGN KEY (activity_id) REFERENCES activities (id),
  FOREIGN KEY (payee_id) REFERENCES payees (id)
  FOREIGN KEY (salary_id) REFERENCES salaries (id)
  FOREIGN KEY (role_id) REFERENCES roles (id)
  FOREIGN KEY (account_id) REFERENCES accounts (id)
);

CREATE TABLE IF NOT EXISTS tins (
  id INTEGER PRIMARY KEY,
  tin TEXT NOT NULL,
  payee_id INTEGER NOT NULL,
  created_at TEXT,
  updated_at TEXT,
  deleted_at TEXT,
  FOREIGN KEY (payee_id) REFERENCES payees (id)
);

CREATE TRIGGER IF NOT EXISTS focals_set_timestamps_after_insert
AFTER INSERT ON focals
FOR EACH ROW
BEGIN
    UPDATE focals
    SET
        created_at = COALESCE(NEW.created_at, CURRENT_TIMESTAMP),
        updated_at = COALESCE(NEW.updated_at, CURRENT_TIMESTAMP)
    WHERE id = NEW.id;
END;
CREATE TRIGGER IF NOT EXISTS positions_set_timestamps_after_insert
AFTER INSERT ON positions
FOR EACH ROW
BEGIN
    UPDATE positions
    SET
        created_at = COALESCE(NEW.created_at, CURRENT_TIMESTAMP),
        updated_at = COALESCE(NEW.updated_at, CURRENT_TIMESTAMP)
    WHERE id = NEW.id;
END;
CREATE TRIGGER IF NOT EXISTS venues_set_timestamps_after_insert
AFTER INSERT ON venues
FOR EACH ROW
BEGIN
    UPDATE venues
    SET
        created_at = COALESCE(NEW.created_at, CURRENT_TIMESTAMP),
        updated_at = COALESCE(NEW.updated_at, CURRENT_TIMESTAMP)
    WHERE id = NEW.id;
END;
CREATE TRIGGER IF NOT EXISTS venues_set_updated_at_after_update
AFTER UPDATE ON venues
FOR EACH ROW
BEGIN
    UPDATE venues
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.id;
END;
CREATE TRIGGER IF NOT EXISTS focals_set_updated_at_after_update
AFTER UPDATE ON focals
FOR EACH ROW
BEGIN
    UPDATE focals
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.id;
END;
CREATE TRIGGER IF NOT EXISTS banks_set_timestamps_after_insert
AFTER INSERT ON banks
FOR EACH ROW
BEGIN
    UPDATE banks
    SET
        created_at = COALESCE(NEW.created_at, CURRENT_TIMESTAMP),
        updated_at = COALESCE(NEW.updated_at, CURRENT_TIMESTAMP)
    WHERE id = NEW.id;
END;
CREATE TRIGGER IF NOT EXISTS banks_set_updated_at_after_update
AFTER UPDATE ON banks
FOR EACH ROW
BEGIN
    UPDATE banks
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.id;
END;
CREATE TRIGGER IF NOT EXISTS payees_set_timestamps_after_insert
AFTER INSERT ON payees
FOR EACH ROW
BEGIN
    UPDATE payees
    SET
        created_at = COALESCE(NEW.created_at, CURRENT_TIMESTAMP),
        updated_at = COALESCE(NEW.updated_at, CURRENT_TIMESTAMP)
    WHERE id = NEW.id;
END;
CREATE TRIGGER IF NOT EXISTS accounts_set_timestamps_after_insert
AFTER INSERT ON accounts
FOR EACH ROW
BEGIN
    UPDATE accounts
    SET
        created_at = COALESCE(NEW.created_at, CURRENT_TIMESTAMP),
        updated_at = COALESCE(NEW.updated_at, CURRENT_TIMESTAMP)
    WHERE id = NEW.id;
END;
CREATE TRIGGER IF NOT EXISTS activities_set_timestamps_after_insert 
  AFTER INSERT ON activities 
  FOR EACH ROW BEGIN
UPDATE activities
SET
  created_at = COALESCE(NEW.created_at, CURRENT_TIMESTAMP),
  updated_at = COALESCE(NEW.updated_at, CURRENT_TIMESTAMP)
WHERE
  id = NEW.id;
END;
CREATE TRIGGER IF NOT EXISTS salaries_set_timestamps_after_insert 
  AFTER INSERT ON salaries 
  FOR EACH ROW BEGIN
UPDATE salaries
SET
  created_at = COALESCE(NEW.created_at, CURRENT_TIMESTAMP),
  updated_at = COALESCE(NEW.updated_at, CURRENT_TIMESTAMP)
WHERE
  id = NEW.id;
END;
CREATE TRIGGER IF NOT EXISTS roles_set_timestamps_after_insert 
  AFTER INSERT ON roles 
  FOR EACH ROW BEGIN
UPDATE roles
SET
  created_at = COALESCE(NEW.created_at, CURRENT_TIMESTAMP),
  updated_at = COALESCE(NEW.updated_at, CURRENT_TIMESTAMP)
WHERE
  id = NEW.id;
END;
CREATE TRIGGER IF NOT EXISTS tins_set_timestamps_after_insert 
  AFTER INSERT ON tins 
  FOR EACH ROW BEGIN
UPDATE tins
SET
  created_at = COALESCE(NEW.created_at, CURRENT_TIMESTAMP),
  updated_at = COALESCE(NEW.updated_at, CURRENT_TIMESTAMP)
WHERE
  id = NEW.id;
END;
CREATE TRIGGER IF NOT EXISTS tins_set_updated_at_after_update 
AFTER UPDATE ON tins 
  FOR EACH ROW BEGIN
UPDATE tins
SET
  updated_at = CURRENT_TIMESTAMP
WHERE
  id = NEW.id;
END;
CREATE TRIGGER IF NOT EXISTS payments_set_timestamps_after_insert 
  AFTER INSERT ON payments 
  FOR EACH ROW BEGIN
UPDATE payments
SET
  created_at = COALESCE(NEW.created_at, CURRENT_TIMESTAMP),
  updated_at = COALESCE(NEW.updated_at, CURRENT_TIMESTAMP)
WHERE
  id = NEW.id;
END;
CREATE TRIGGER IF NOT EXISTS payments_set_updated_at_after_update 
AFTER UPDATE ON payments 
  FOR EACH ROW BEGIN
UPDATE payments
SET
  updated_at = CURRENT_TIMESTAMP
WHERE
  id = NEW.id;
END;

COMMIT;
