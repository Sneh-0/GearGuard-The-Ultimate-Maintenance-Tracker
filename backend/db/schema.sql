-- GearGuard PostgreSQL schema

CREATE TABLE IF NOT EXISTS users (
  email TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Admin','Manager','Technician'))
);

CREATE TABLE IF NOT EXISTS equipment (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Operational','Maintenance','Overdue')) DEFAULT 'Operational',
  last_maintenance DATE,
  maintenance_schedule INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS maintenance_requests (
  id SERIAL PRIMARY KEY,
  equipment_id INTEGER REFERENCES equipment(id) ON DELETE SET NULL,
  equipment_name TEXT,
  request_type TEXT NOT NULL CHECK (request_type IN ('Preventive','Corrective')),
  status TEXT NOT NULL CHECK (status IN ('New','In Progress','Repaired')) DEFAULT 'New',
  priority TEXT NOT NULL CHECK (priority IN ('Low','Medium','High')) DEFAULT 'Medium',
  description TEXT,
  requested_by TEXT,
  assigned_to TEXT,
  created_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  scheduled_date DATE
);

CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  lead TEXT
);

CREATE TABLE IF NOT EXISTS calendar_events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  equipment_id INTEGER REFERENCES equipment(id) ON DELETE SET NULL
);

-- Seed demo users (passwords are plain for demo; replace with hashing in production)
INSERT INTO users(email, password, name, role) VALUES
  ('admin@gearguard.com','admin123','Admin User','Admin'),
  ('manager@gearguard.com','manager123','Manager User','Manager'),
  ('tech@gearguard.com','tech123','Technician User','Technician')
ON CONFLICT (email) DO NOTHING;
