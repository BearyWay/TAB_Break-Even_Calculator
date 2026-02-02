import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in: string;
}

export interface CalculatorData {
  id: string;
  user_id: string;
  facilities_location: number;
  salaries_benefits: number;
  sales_marketing: number;
  general_admin: number;
  desired_profit: number;
  cogs_percent: number;
  variable_op_costs_percent: number;
  updated_at: string;
  created_at: string;
}
