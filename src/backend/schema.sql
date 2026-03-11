-- Create tables for MediRecord

-- Hospital doctors table
CREATE TABLE IF NOT EXISTS hospital_doctors (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Patient records table
CREATE TABLE IF NOT EXISTS patient_records (
  id SERIAL PRIMARY KEY,
  patient_name TEXT NOT NULL,
  date_of_birth TEXT NOT NULL,
  gender TEXT NOT NULL,
  blood_type TEXT NOT NULL,
  diagnosis TEXT NOT NULL,
  treatment TEXT NOT NULL,
  medications TEXT NOT NULL,
  allergies TEXT NOT NULL,
  notes TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  record_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Patient credentials table
CREATE TABLE IF NOT EXISTS patient_credentials (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  record_id INTEGER REFERENCES patient_records(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_patient_credentials_record_id ON patient_credentials(record_id);
CREATE INDEX IF NOT EXISTS idx_hospital_doctors_username ON hospital_doctors(username);
CREATE INDEX IF NOT EXISTS idx_patient_credentials_username ON patient_credentials(username);
