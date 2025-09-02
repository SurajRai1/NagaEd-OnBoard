import { useState, useEffect, createContext, useContext } from 'react';
import { getEmployee, getEmployeeTasks } from '../lib/supabase';
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

  const fetchEmployeeData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      const { data: employeeData, error: employeeError } = await getEmployee(user.id);
      if (employeeError && employeeError.code !== 'PGRST116') { // Ignore "no rows found" error
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
  };

  useEffect(() => {
    fetchEmployeeData();
  }, [user]);

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