/*
  # Employee Onboarding System Schema

  1. New Tables
    - `employees`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text, required)
      - `email` (text, required)
      - `bank_account_number` (text, required)
      - `ifsc_code` (text, required)
      - `phone_number` (text, optional)
      - `department` (text, optional)
      - `position` (text, optional)
      - `start_date` (date, default today)
      - `onboarding_completed` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `tasks`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, optional)
      - `day_number` (integer, 1-30)
      - `is_active` (boolean, default true)
      - `created_by` (uuid, references auth.users)
      - `created_at` (timestamp)
    
    - `employee_tasks`
      - `id` (uuid, primary key)
      - `employee_id` (uuid, references employees)
      - `task_id` (uuid, references tasks)
      - `completed` (boolean, default false)
      - `completed_at` (timestamp, optional)
      - `notes` (text, optional)
      - `created_at` (timestamp)
    
    - `onboarding_reviews`
      - `id` (uuid, primary key)
      - `employee_id` (uuid, references employees)
      - `overall_rating` (integer, 1-5)
      - `feedback` (text, optional)
      - `suggestions` (text, optional)
      - `submitted_at` (timestamp, default now)

  2. Security
    - Enable RLS on all tables
    - Add policies for employees to access their own data
    - Add policies for admins to access all data

  3. Indexes
    - Add indexes for frequently queried columns
    - Add composite indexes for employee_tasks lookups
*/

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  bank_account_number text NOT NULL,
  ifsc_code text NOT NULL,
  phone_number text,
  department text,
  position text,
  start_date date DEFAULT CURRENT_DATE,
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  day_number integer NOT NULL CHECK (day_number >= 1 AND day_number <= 30),
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create employee_tasks junction table
CREATE TABLE IF NOT EXISTS employee_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(employee_id, task_id)
);

-- Create onboarding_reviews table
CREATE TABLE IF NOT EXISTS onboarding_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  overall_rating integer NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  feedback text,
  suggestions text,
  submitted_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for employees table
CREATE POLICY "Employees can read own data"
  ON employees
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Employees can update own data"
  ON employees
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "New employees can insert their own data"
  ON employees
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for tasks table
CREATE POLICY "Everyone can read active tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage tasks"
  ON tasks
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for employee_tasks table
CREATE POLICY "Employees can read own tasks"
  ON employee_tasks
  FOR SELECT
  TO authenticated
  USING (employee_id = auth.uid());

CREATE POLICY "Employees can update own tasks"
  ON employee_tasks
  FOR UPDATE
  TO authenticated
  USING (employee_id = auth.uid());

CREATE POLICY "System can insert employee tasks"
  ON employee_tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (employee_id = auth.uid());

-- RLS Policies for onboarding_reviews table
CREATE POLICY "Employees can read own reviews"
  ON onboarding_reviews
  FOR SELECT
  TO authenticated
  USING (employee_id = auth.uid());

CREATE POLICY "Employees can insert own reviews"
  ON onboarding_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (employee_id = auth.uid());

-- Admin policies (assuming admin role is stored in JWT)
CREATE POLICY "Admins can read all employees"
  ON employees
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can read all employee tasks"
  ON employee_tasks
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can read all reviews"
  ON onboarding_reviews
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_employee_tasks_employee_id ON employee_tasks(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_tasks_task_id ON employee_tasks(task_id);
CREATE INDEX IF NOT EXISTS idx_tasks_day_number ON tasks(day_number);
CREATE INDEX IF NOT EXISTS idx_employees_start_date ON employees(start_date);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for employees table
DROP TRIGGER IF EXISTS update_employees_updated_at ON employees;
CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();