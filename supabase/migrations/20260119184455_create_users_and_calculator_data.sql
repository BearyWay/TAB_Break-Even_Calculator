/*
  # Create Users and Calculator Data Tables

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique) - User's email address for authentication
      - `created_at` (timestamptz) - When the user first signed in
      - `last_sign_in` (timestamptz) - Last time user accessed the app
    
    - `calculator_data`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users) - Links to the user who owns this data
      - `fixed_expenses` (numeric) - Fixed business expenses
      - `labor_costs` (numeric) - Labor costs
      - `desired_profit` (numeric) - Desired profit amount
      - `cogs_percent` (numeric) - Cost of goods sold percentage
      - `variable_op_costs_percent` (numeric) - Variable operating costs percentage
      - `updated_at` (timestamptz) - Last update timestamp
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on both tables
    - Users can only read and update their own data
    - Automatic user creation on first sign-in
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_sign_in timestamptz DEFAULT now()
);

-- Create calculator_data table
CREATE TABLE IF NOT EXISTS calculator_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  fixed_expenses numeric DEFAULT 60000,
  labor_costs numeric DEFAULT 26880,
  desired_profit numeric DEFAULT 50000,
  cogs_percent numeric DEFAULT 57,
  variable_op_costs_percent numeric DEFAULT 11,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculator_data ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING (email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Users can insert own data"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  TO authenticated
  USING (email = current_setting('request.jwt.claims', true)::json->>'email')
  WITH CHECK (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Calculator data policies
CREATE POLICY "Users can read own calculator data"
  ON calculator_data FOR SELECT
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
  ));

CREATE POLICY "Users can insert own calculator data"
  ON calculator_data FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (
    SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
  ));

CREATE POLICY "Users can update own calculator data"
  ON calculator_data FOR UPDATE
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
  ))
  WITH CHECK (user_id IN (
    SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
  ));

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_calculator_data_user_id ON calculator_data(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);