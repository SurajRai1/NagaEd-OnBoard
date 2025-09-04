import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// --- All other functions (signIn, signOut, getEmployee, etc.) remain the same ---

// Auth helpers
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/dashboard`
    }
  })
  return { data, error }
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

// Employee helpers
export const createEmployee = async (employeeData) => {
  const { data, error } = await supabase
    .from('employees')
    .insert([employeeData])
    .select()
    .single()
  return { data, error }
}

export const getEmployee = async (userId) => {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

export const updateEmployee = async (userId, updates) => {
  const { data, error } = await supabase
    .from('employees')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  return { data, error }
}

// Task helpers
export const getTasks = async () => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('is_active', true)
    .order('day_number')
  return { data, error }
}

export const getTasksForDay = async (dayNumber) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('day_number', dayNumber)
    .eq('is_active', true)
    .order('created_at')
  return { data, error }
}

export const getEmployeeTasks = async (employeeId) => {
  const { data, error } = await supabase
    .from('employee_tasks')
    .select(`
      *,
      tasks (*)
    `)
    .eq('employee_id', employeeId)
    .order('created_at')
  return { data, error }
}

export const completeTask = async (employeeId, taskId, notes = '') => {
  const { data, error } = await supabase
    .from('employee_tasks')
    .upsert({
      employee_id: employeeId,
      task_id: taskId,
      completed: true,
      completed_at: new Date().toISOString(),
      notes
    }, {
      onConflict: 'employee_id,task_id'
    })
    .select()
  return { data, error }
}


export const createEmployeeTasks = async (employeeId) => {
  const { data: tasks, error: tasksError } = await getTasks()
  if (tasksError) return { error: tasksError }

  const employeeTasks = tasks.map(task => ({
    employee_id: employeeId,
    task_id: task.id,
    completed: false
  }))

  const { data, error } = await supabase
    .from('employee_tasks')
    .insert(employeeTasks)
    .select()
  return { data, error }
}

// Admin helpers
export const getAllEmployees = async () => {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('created_at', { ascending: false })
  return { data, error }
}

export const getEmployeesWithProgress = async () => {
  const { data, error } = await supabase
    .from('employees')
    .select(`
      *,
      employee_tasks (
        completed,
        tasks ( day_number )
      )
    `)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const getEmployeeProgress = async (employeeId) => {
  const { data, error } = await supabase
    .from('employee_tasks')
    .select('*, tasks(*)')
    .eq('employee_id', employeeId)
  return { data, error }
}

export const createTask = async (taskData) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert([taskData])
    .select()
    .single()
  return { data, error }
}

export const updateTask = async (taskId, updates) => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single()
  return { data, error }
}

// Review helpers
export const submitOnboardingReview = async (reviewData) => {
  const { data, error } = await supabase
    .from('onboarding_reviews')
    .insert([reviewData])
    .select()
    .single()
  return { data, error }
}

export const getAllReviews = async () => {
  const { data, error } = await supabase
    .from('onboarding_reviews')
    .select(`
      *,
      employees (full_name, email)
    `)
    .order('submitted_at', { ascending: false })
  return { data, error }
}

// This function is no longer needed, as its logic is now in `createAndAssignTask`
// export const createCustomTask = ...

export const assignTaskToEmployee = async (employeeId, taskId) => {
  const { data, error } = await supabase
    .from('employee_tasks')
    .insert([{
      employee_id: employeeId,
      task_id: taskId,
      completed: false
    }])
    .select();
  return { data, error };
};

// --- NEW HELPER FUNCTION ---
// This function combines creating and assigning a task.
export const createAndAssignTask = async (taskData, employeeId) => {
  // 1. Create the new task in the 'tasks' table
  const { data: createdTask, error: createTaskError } = await supabase
    .from('tasks')
    .insert([taskData])
    .select()
    .single();

  if (createTaskError) {
    console.error("Error creating task:", createTaskError);
    return { error: createTaskError };
  }

  if (!createdTask) {
    const error = new Error("Task created, but no data returned.");
    console.error(error);
    return { error };
  }

  // 2. Assign the newly created task to the employee in 'employee_tasks'
  const { data: assignedTask, error: assignTaskError } = await assignTaskToEmployee(
    employeeId,
    createdTask.id
  );
  
  if (assignTaskError) {
    console.error("Error assigning task:", assignTaskError);
    // Optional: You might want to delete the created task here if assignment fails
    return { error: assignTaskError };
  }

  return { data: assignedTask, error: null };
};