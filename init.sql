PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS payees (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT,
  bank TEXT NOT NULL,
  bank_branch TEXT NOT NULL,
  account_no TEXT NOT NULL,
  account_name TEXT NOT NULL,
  tin TEXT NOT NULL,
  created_at TEXT,
  updated_at TEXT
);
CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY,
  activity_id INTEGER NOT NULL,
  payee_id INTEGER NOT NULL,
  role TEXT NOT NULL,
  honorarium REAL NOT NULL,
  hours_rendered REAL NOT NULL,
  actual_honorarium REAL NOT NULL,
  net_honorarium REAL NOT NULL,
  created_at TEXT,
  updated_at TEXT, salary REAL NOT NULL,
  FOREIGN KEY (activity_id) REFERENCES activities (id),
  FOREIGN KEY (payee_id) REFERENCES payees (id)
);
CREATE TABLE IF NOT EXISTS "activities" (
	`id` integer PRIMARY KEY,
	`title` text NOT NULL,
	`venue` text NOT NULL,
	`code` text NOT NULL,
	`fund` text NOT NULL,
	`created_at` text,
	`updated_at` text,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	CONSTRAINT uc_activities_code UNIQUE(`code`)
);
CREATE TRIGGER activities_set_timestamps_after_insert
AFTER INSERT ON activities
FOR EACH ROW
BEGIN
    UPDATE activities
    SET
        created_at = COALESCE(NEW.created_at, CURRENT_TIMESTAMP),
        updated_at = COALESCE(NEW.updated_at, CURRENT_TIMESTAMP)
    WHERE id = NEW.id;
END;
CREATE TRIGGER payees_set_timestamps_after_insert
AFTER INSERT ON payees
FOR EACH ROW
BEGIN
    UPDATE payees
    SET
        created_at = COALESCE(NEW.created_at, CURRENT_TIMESTAMP),
        updated_at = COALESCE(NEW.updated_at, CURRENT_TIMESTAMP)
    WHERE id = NEW.id;
END;
CREATE TRIGGER transactions_set_timestamps_after_insert
AFTER INSERT ON transactions
FOR EACH ROW
BEGIN
    UPDATE transactions
    SET
        created_at = COALESCE(NEW.created_at, CURRENT_TIMESTAMP),
        updated_at = COALESCE(NEW.updated_at, CURRENT_TIMESTAMP)
    WHERE id = NEW.id;
END;
CREATE TRIGGER activities_set_updated_at_after_update
AFTER UPDATE ON activities
FOR EACH ROW
BEGIN
    UPDATE activities
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.id;
END;
CREATE TRIGGER payees_set_updated_at_after_update
AFTER UPDATE ON payees
FOR EACH ROW
BEGIN
    UPDATE payees
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.id;
END;
CREATE TRIGGER transactions_set_updated_at_after_update
AFTER UPDATE ON transactions
FOR EACH ROW
BEGIN
    UPDATE transactions
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.id;
END;
COMMIT;
