-- Safely add the 'role' column to the 'employees' table if it doesn't already exist
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS role text DEFAULT 'employee';

--------------------------------------------------------------------------------
-- Re-apply RLS Policies to ensure they are up-to-date
-- We DROP them first and then CREATE them again to avoid the "already exists" error
--------------------------------------------------------------------------------

-- Policies for 'employees' table
DROP POLICY IF EXISTS "Employees can read own data" ON public.employees;
CREATE POLICY "Employees can read own data" ON public.employees
  FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Employees can update own data" ON public.employees;
CREATE POLICY "Employees can update own data" ON public.employees
  FOR UPDATE TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "New employees can insert their own data" ON public.employees;
CREATE POLICY "New employees can insert their own data" ON public.employees
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can read all employees" ON public.employees;
CREATE POLICY "Admins can read all employees" ON public.employees
  FOR SELECT TO authenticated USING ((SELECT role FROM public.employees WHERE id = auth.uid()) = 'admin');


-- Policies for 'tasks' table
DROP POLICY IF EXISTS "Everyone can read active tasks" ON public.tasks;
CREATE POLICY "Everyone can read active tasks" ON public.tasks
  FOR SELECT TO authenticated USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage tasks" ON public.tasks;
CREATE POLICY "Admins can manage tasks" ON public.tasks
  FOR ALL TO authenticated USING ((SELECT role FROM public.employees WHERE id = auth.uid()) = 'admin');


-- Policies for 'employee_tasks' table
DROP POLICY IF EXISTS "Employees can read own tasks" ON public.employee_tasks;
CREATE POLICY "Employees can read own tasks" ON public.employee_tasks
  FOR SELECT TO authenticated USING (employee_id = auth.uid());

DROP POLICY IF EXISTS "Employees can update own tasks" ON public.employee_tasks;
CREATE POLICY "Employees can update own tasks" ON public.employee_tasks
  FOR UPDATE TO authenticated USING (employee_id = auth.uid());
  
DROP POLICY IF EXISTS "System can insert employee tasks" ON public.employee_tasks;
CREATE POLICY "System can insert employee tasks" ON public.employee_tasks
  FOR INSERT TO authenticated WITH CHECK (employee_id = auth.uid());

DROP POLICY IF EXISTS "Admins can read all employee tasks" ON public.employee_tasks;
CREATE POLICY "Admins can read all employee tasks" ON public.employee_tasks
  FOR ALL TO authenticated USING ((SELECT role FROM public.employees WHERE id = auth.uid()) = 'admin');


-- Policies for 'onboarding_reviews' table
DROP POLICY IF EXISTS "Employees can read own reviews" ON public.onboarding_reviews;
CREATE POLICY "Employees can read own reviews" ON public.onboarding_reviews
  FOR SELECT TO authenticated USING (employee_id = auth.uid());

DROP POLICY IF EXISTS "Employees can insert own reviews" ON public.onboarding_reviews;
CREATE POLICY "Employees can insert own reviews" ON public.onboarding_reviews
  FOR INSERT TO authenticated WITH CHECK (employee_id = auth.uid());

DROP POLICY IF EXISTS "Admins can read all reviews" ON public.onboarding_reviews;
CREATE POLICY "Admins can read all reviews" ON public.onboarding_reviews
  FOR SELECT TO authenticated USING ((SELECT role FROM public.employees WHERE id = auth.uid()) = 'admin');