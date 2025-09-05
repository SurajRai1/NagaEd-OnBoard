import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { supabase, getEmployee, getEmployeeTasks } from '../lib/supabase';
import { useAuth } from './useAuth';

const EmployeeContext = createContext({});

export const useEmployee = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployee must be used within an EmployeeProvider');
  }
  return context;
};

export const EmployeeProvider = ({ children }) => {
  const { user } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmployeeData = useCallback(async () => {
    if (!user) {
      setEmployee(null);
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: employeeData, error: employeeError } = await getEmployee(user.id);
      if (employeeError && employeeError.code !== 'PGRST116') { // Ignore "no rows found"
        throw employeeError;
      }
      setEmployee(employeeData);

      if (employeeData) {
        const { data: tasksData, error: tasksError } = await getEmployeeTasks(user.id);
        if (tasksError) throw tasksError;
        setTasks(tasksData || []);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching employee data:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchEmployeeData();
  }, [user, fetchEmployeeData]);

  // --- NEW REALTIME SUBSCRIPTION ---
  useEffect(() => {
    if (!user) return;

    // Listen for new tasks being assigned to the current employee
    const subscription = supabase.channel(`employee_tasks_for_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'employee_tasks',
          filter: `employee_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Change received!', payload);
          // When a change is detected, refresh the tasks
          fetchEmployeeData();
        }
      )
      .subscribe();

    // Cleanup function to remove the subscription when the component unmounts
    return () => {
      supabase.removeChannel(subscription);
    };

  }, [user, fetchEmployeeData]);


  const value = {
    employee,
    tasks,
    loading,
    error,
    refreshEmployeeData: fetchEmployeeData
  };

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  );
};