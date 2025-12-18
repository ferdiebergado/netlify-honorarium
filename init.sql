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
, deleted_at TEXT);
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
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  venue_id INTEGER NOT NULL,
  code TEXT NOT NULL,
  fund TEXT NOT NULL,
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
INSERT INTO venues VALUES(1,'Tanza Oasis Hotel and Resort, Tanza, Cavite','2025-12-18 07:32:23','2025-12-18 07:32:23',NULL);
INSERT INTO venues VALUES(2,'NEAP NCR, Marikina City','2025-12-18 07:32:23','2025-12-18 07:32:23',NULL);
INSERT INTO venues VALUES(3,'Ecotech Center, Cebu City','2025-12-18 07:32:23','2025-12-18 07:32:23',NULL);
CREATE TABLE IF NOT EXISTS positions (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TEXT,
  updated_at TEXT,
  deleted_at TEXT
);
INSERT INTO positions VALUES(1,'Senior Education Program Specialist','2025-12-18 07:32:22','2025-12-18 07:32:22',NULL);
INSERT INTO positions VALUES(2,'Supervising Education Program Specialist','2025-12-18 07:32:22','2025-12-18 07:32:22',NULL);
CREATE TABLE IF NOT EXISTS focals (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  position_id INTEGER NOT NULL,
  created_at TEXT,
  updated_at TEXT,
  deleted_at TEXT,
  FOREIGN KEY (position_id) REFERENCES positions (id)
);
INSERT INTO focals VALUES(1,'Joselita B. Gulapa',1,'2025-12-18 07:32:25','2025-12-18 07:32:25',NULL);
INSERT INTO focals VALUES(2,'Xyphrone A. Angelo Ortiz',1,'2025-12-18 07:32:25','2025-12-18 07:32:25',NULL);
INSERT INTO focals VALUES(3,'Ernani O. Jaime',2,'2025-12-18 07:32:25','2025-12-18 07:32:25',NULL);
INSERT INTO focals VALUES(4,'Forcefina E. Frias',1,'2025-12-18 07:32:25','2025-12-18 07:32:25',NULL);
INSERT INTO focals VALUES(5,'Jerome C. Hilario',2,'2025-12-18 07:32:25','2025-12-18 07:32:25',NULL);
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
CREATE TRIGGER focals_set_timestamps_after_insert
AFTER INSERT ON focals
FOR EACH ROW
BEGIN
    UPDATE focals
    SET
        created_at = COALESCE(NEW.created_at, CURRENT_TIMESTAMP),
        updated_at = COALESCE(NEW.updated_at, CURRENT_TIMESTAMP)
    WHERE id = NEW.id;
END;
CREATE TRIGGER positions_set_timestamps_after_insert
AFTER INSERT ON positions
FOR EACH ROW
BEGIN
    UPDATE positions
    SET
        created_at = COALESCE(NEW.created_at, CURRENT_TIMESTAMP),
        updated_at = COALESCE(NEW.updated_at, CURRENT_TIMESTAMP)
    WHERE id = NEW.id;
END;
CREATE TRIGGER venues_set_timestamps_after_insert
AFTER INSERT ON venues
FOR EACH ROW
BEGIN
    UPDATE venues
    SET
        created_at = COALESCE(NEW.created_at, CURRENT_TIMESTAMP),
        updated_at = COALESCE(NEW.updated_at, CURRENT_TIMESTAMP)
    WHERE id = NEW.id;
END;
CREATE TRIGGER venues_set_updated_at_after_update
AFTER UPDATE ON venues
FOR EACH ROW
BEGIN
    UPDATE venues
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.id;
END;
CREATE TRIGGER focals_set_updated_at_after_update
AFTER UPDATE ON focals
FOR EACH ROW
BEGIN
    UPDATE focals
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.id;
END;
COMMIT;
