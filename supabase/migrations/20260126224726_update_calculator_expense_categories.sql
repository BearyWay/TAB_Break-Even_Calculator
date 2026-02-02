/*
  # Update Calculator Expense Categories

  1. Changes
    - Add four new expense category columns to `calculator_data` table:
      - `facilities_location` (numeric) - Facilities and location costs (rent, utilities, etc.)
      - `salaries_benefits` (numeric) - Fixed salaries and benefits
      - `sales_marketing` (numeric) - Fixed sales and marketing costs
      - `general_admin` (numeric) - General administrative expenses
    - Migrate existing data:
      - Move `labor_costs` to `salaries_benefits`
      - Move `fixed_expenses` to `general_admin`
    - Remove old columns:
      - Drop `fixed_expenses`
      - Drop `labor_costs`

  2. Notes
    - This migration preserves existing user data by transferring values to appropriate new columns
    - Default values are set to 0 for the new expense categories
*/

-- Add new expense category columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'calculator_data' AND column_name = 'facilities_location'
  ) THEN
    ALTER TABLE calculator_data ADD COLUMN facilities_location numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'calculator_data' AND column_name = 'salaries_benefits'
  ) THEN
    ALTER TABLE calculator_data ADD COLUMN salaries_benefits numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'calculator_data' AND column_name = 'sales_marketing'
  ) THEN
    ALTER TABLE calculator_data ADD COLUMN sales_marketing numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'calculator_data' AND column_name = 'general_admin'
  ) THEN
    ALTER TABLE calculator_data ADD COLUMN general_admin numeric DEFAULT 0;
  END IF;
END $$;

-- Migrate existing data
UPDATE calculator_data
SET 
  salaries_benefits = COALESCE(labor_costs, 0),
  general_admin = COALESCE(fixed_expenses, 0),
  facilities_location = 0,
  sales_marketing = 0
WHERE salaries_benefits = 0 AND general_admin = 0;

-- Drop old columns
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'calculator_data' AND column_name = 'fixed_expenses'
  ) THEN
    ALTER TABLE calculator_data DROP COLUMN fixed_expenses;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'calculator_data' AND column_name = 'labor_costs'
  ) THEN
    ALTER TABLE calculator_data DROP COLUMN labor_costs;
  END IF;
END $$;