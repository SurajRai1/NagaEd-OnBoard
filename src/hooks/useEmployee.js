import { useState, useEffect } from 'react'
import { getEmployee, getEmployeeTasks } from '../lib/supabase'
import { useAuth } from './useAuth'

export const useEmployee = () => {
  const { user } = useAuth()
  const [employee, setEmployee] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetchEmployeeData = async () => {
      try {
        setLoading(true)
        
        // Fetch employee details
        const { data: employeeData, error: employeeError } = await getEmployee(user.id)
        if (employeeError && employeeError.code !== 'PGRST116') {
          throw employeeError
        }
        
        setEmployee(employeeData)

        // Fetch employee tasks if employee exists
        if (employeeData) {
          const { data: tasksData, error: tasksError } = await getEmployeeTasks(user.id)
          if (tasksError) throw tasksError
          setTasks(tasksData || [])
        }
      } catch (err) {
        setError(err.message)
        console.error('Error fetching employee data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEmployeeData()
  }, [user])

  const refreshEmployeeData = async () => {
    if (!user) return
    
    try {
      const { data: employeeData, error: employeeError } = await getEmployee(user.id)
      if (employeeError && employeeError.code !== 'PGRST116') {
        throw employeeError
      }
      setEmployee(employeeData)

      const { data: tasksData, error: tasksError } = await getEmployeeTasks(user.id)
      if (tasksError) throw tasksError
      setTasks(tasksData || [])
    } catch (err) {
      setError(err.message)
    }
  }

  return {
    employee,
    tasks,
    loading,
    error,
    refreshEmployeeData
  }
}