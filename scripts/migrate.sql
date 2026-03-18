-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);

-- Create password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS sessions_token_idx ON sessions(session_token);

-- Create cities table
CREATE TABLE IF NOT EXISTS cities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  address VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  geojson_data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS cities_name_idx ON cities(name);

-- Create demographics table
CREATE TABLE IF NOT EXISTS demographics (
  id SERIAL PRIMARY KEY,
  city_id INTEGER NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  total_population INTEGER NOT NULL,
  total_households INTEGER NOT NULL,
  avg_household_size DECIMAL(5, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS demographics_city_idx ON demographics(city_id);

-- Create gender breakdown table
CREATE TABLE IF NOT EXISTS gender_breakdown (
  id SERIAL PRIMARY KEY,
  city_id INTEGER NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  male INTEGER NOT NULL,
  female INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create marital status breakdown table
CREATE TABLE IF NOT EXISTS marital_status_breakdown (
  id SERIAL PRIMARY KEY,
  city_id INTEGER NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  married INTEGER NOT NULL,
  single INTEGER NOT NULL,
  widow INTEGER NOT NULL,
  divorced INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create occupation status breakdown table
CREATE TABLE IF NOT EXISTS occupation_status_breakdown (
  id SERIAL PRIMARY KEY,
  city_id INTEGER NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  employed INTEGER NOT NULL,
  unemployed INTEGER NOT NULL,
  student INTEGER NOT NULL,
  retired INTEGER NOT NULL,
  other INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create job occupations table
CREATE TABLE IF NOT EXISTS job_occupations (
  id SERIAL PRIMARY KEY,
  city_id INTEGER NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  occupation VARCHAR(255) NOT NULL,
  count INTEGER NOT NULL,
  percentage DECIMAL(5, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create age group data table
CREATE TABLE IF NOT EXISTS age_group_data (
  id SERIAL PRIMARY KEY,
  city_id INTEGER NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  age_group VARCHAR(50) NOT NULL,
  generation VARCHAR(50) NOT NULL,
  count INTEGER NOT NULL,
  percentage DECIMAL(5, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create socioeconomic data table
CREATE TABLE IF NOT EXISTS socioeconomic_data (
  id SERIAL PRIMARY KEY,
  city_id INTEGER NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  category VARCHAR(255) NOT NULL,
  value INTEGER NOT NULL,
  percentage DECIMAL(5, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create income data table
CREATE TABLE IF NOT EXISTS income_data (
  id SERIAL PRIMARY KEY,
  city_id INTEGER NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  income_range VARCHAR(255) NOT NULL,
  count INTEGER NOT NULL,
  percentage DECIMAL(5, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create food expenditure data table
CREATE TABLE IF NOT EXISTS food_expenditure_data (
  id SERIAL PRIMARY KEY,
  city_id INTEGER NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  category VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  percentage DECIMAL(5, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create points of interest table
CREATE TABLE IF NOT EXISTS points_of_interest (
  id SERIAL PRIMARY KEY,
  city_id INTEGER NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  poi_type VARCHAR(100) NOT NULL,
  count INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
