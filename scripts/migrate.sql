DROP TABLE IF EXISTS surveyor_population_fact CASCADE;
DROP TABLE IF EXISTS poi_type_master CASCADE;
DROP TABLE IF EXISTS food_preferences_master CASCADE;
DROP TABLE IF EXISTS housing_status_master CASCADE;
DROP TABLE IF EXISTS monthly_income_master CASCADE;
DROP TABLE IF EXISTS education_master CASCADE;
DROP TABLE IF EXISTS socioeconomy_master CASCADE;
DROP TABLE IF EXISTS occupation_type_master CASCADE;
DROP TABLE IF EXISTS occupation_status_master CASCADE;
DROP TABLE IF EXISTS marital_status_master CASCADE;
DROP TABLE IF EXISTS gender_master CASCADE;
DROP TABLE IF EXISTS points_of_interest CASCADE;
DROP TABLE IF EXISTS food_expenditure_data CASCADE;
DROP TABLE IF EXISTS income_data CASCADE;
DROP TABLE IF EXISTS socioeconomic_data CASCADE;
DROP TABLE IF EXISTS age_group_data CASCADE;
DROP TABLE IF EXISTS job_occupations CASCADE;
DROP TABLE IF EXISTS occupation_status_breakdown CASCADE;
DROP TABLE IF EXISTS marital_status_breakdown CASCADE;
DROP TABLE IF EXISTS gender_breakdown CASCADE;
DROP TABLE IF EXISTS demographics CASCADE;
DROP TABLE IF EXISTS cities CASCADE;

ALTER TABLE IF EXISTS password_reset_tokens RENAME TO surveyor_password_reset_tokens;
ALTER TABLE IF EXISTS sessions RENAME TO surveyor_sessions;
ALTER TABLE IF EXISTS users RENAME TO surveyor_users;

CREATE TABLE IF NOT EXISTS surveyor_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS surveyor_users_email_idx ON surveyor_users(email);

CREATE TABLE IF NOT EXISTS surveyor_password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES surveyor_users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS surveyor_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES surveyor_users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS surveyor_sessions_token_idx ON surveyor_sessions(session_token);

CREATE TABLE IF NOT EXISTS gender_master (
  id SERIAL PRIMARY KEY,
  gender VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS marital_status_master (
  id SERIAL PRIMARY KEY,
  status VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS occupation_status_master (
  id SERIAL PRIMARY KEY,
  status VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS occupation_type_master (
  id SERIAL PRIMARY KEY,
  type VARCHAR(150) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS socioeconomy_master (
  id SERIAL PRIMARY KEY,
  class VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS education_master (
  id SERIAL PRIMARY KEY,
  grade VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS monthly_income_master (
  id SERIAL PRIMARY KEY,
  income VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS housing_status_master (
  id SERIAL PRIMARY KEY,
  status VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS food_preferences_master (
  id SERIAL PRIMARY KEY,
  preference VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS poi_type_master (
  id SERIAL PRIMARY KEY,
  poi VARCHAR(150) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS surveyor_population_fact (
  id SERIAL PRIMARY KEY,
  no_kk VARCHAR(50) NOT NULL UNIQUE,
  jumlah_anggota INTEGER NOT NULL,
  gender_id INTEGER NOT NULL REFERENCES gender_master(id),
  usia INTEGER NOT NULL,
  housing_status_id INTEGER NOT NULL REFERENCES housing_status_master(id),
  kecamatan VARCHAR(150) NOT NULL,
  kabkot_id INTEGER NOT NULL,
  marital_status_id INTEGER NOT NULL REFERENCES marital_status_master(id),
  education_id INTEGER NOT NULL REFERENCES education_master(id),
  occupation_status_id INTEGER NOT NULL REFERENCES occupation_status_master(id),
  occupation_type_id INTEGER NOT NULL REFERENCES occupation_type_master(id),
  monthly_income_id INTEGER NOT NULL REFERENCES monthly_income_master(id),
  food_preference_id INTEGER NOT NULL REFERENCES food_preferences_master(id),
  monthly_food_expenditure DECIMAL(14, 2) NOT NULL,
  socioclass_id INTEGER NOT NULL REFERENCES socioeconomy_master(id),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
  -- kabkot_id is intended to reference another schema and is therefore stored as-is here.
);

CREATE INDEX IF NOT EXISTS surveyor_population_fact_kecamatan_idx
  ON surveyor_population_fact(kecamatan);
CREATE INDEX IF NOT EXISTS surveyor_population_fact_kabkot_idx
  ON surveyor_population_fact(kabkot_id);
CREATE INDEX IF NOT EXISTS surveyor_population_fact_gender_idx
  ON surveyor_population_fact(gender_id);
CREATE INDEX IF NOT EXISTS surveyor_population_fact_marital_idx
  ON surveyor_population_fact(marital_status_id);
