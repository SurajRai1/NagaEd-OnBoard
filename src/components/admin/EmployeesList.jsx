import { useState } from 'react'
import { getEmployeeProgress } from '../../lib/supabase'
import { calculateProgress, formatDate } from '../../utils/dateUtils'

const EmployeesList = ({ employees, onRefresh }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [employeeProgress, setEmployeeProgress] = useState(null)
  const [loadingProgress, setLoadingProgress] = useState(false)

  const handleViewProgress = async (employee) => {
    setSelectedEmployee(employee)
    setLoadingProgress(true)
    
    try {
      const { data, error } = await getEmployeeProgress(employee.id)
      if (error) throw error
      setEmployeeProgress(data || [])
    } catch (error) {
      console.error('Error fetching employee progress:', error)
    } finally {
      setLoadingProgress(false)
    }
  }

  const closeModal = () => {
    setSelectedEmployee(null)
    setEmployeeProgress(null)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Employees</h2>
          <p className="text-gray-600">Manage employee onboarding progress</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map(employee => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{employee.full_name}</div>
                      <div className="text-sm text-gray-500">{employee.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {employee.department || 'Not specified'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(employee.start_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {employee.onboarding_completed ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        In Progress
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewProgress(employee)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Progress
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Progress Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedEmployee.full_name}'s Progress
                </h3>
                <p className="text-gray-600">{selectedEmployee.email}</p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {loadingProgress ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading progress...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Progress Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-800">Overall Progress</h4>
                    <p className="text-2xl font-bold text-blue-900">
                      {calculateProgress(employeeProgress)}%
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-green-800">Completed</h4>
                    <p className="text-2xl font-bold text-green-900">
                      {employeeProgress?.filter(task => task.completed).length || 0}
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-orange-800">Pending</h4>
                    <p className="text-2xl font-bold text-orange-900">
                      {employeeProgress?.filter(task => !task.completed).length || 0}
                    </p>
                  </div>
                </div>

                {/* Task List */}
                <div className="max-h-96 overflow-y-auto">
                  <div className="space-y-2">
                    {employeeProgress?.map(task => (
                      <div
                        key={task.id}
                        className={`p-4 rounded-lg border ${
                          task.completed 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className={`font-medium ${
                              task.completed ? 'text-green-800' : 'text-gray-900'
                            }`}>
                              Day {task.tasks.day_number}: {task.tasks.title}
                            </h5>
                            <p className={`text-sm ${
                              task.completed ? 'text-green-600' : 'text-gray-600'
                            }`}>
                              {task.tasks.description}
                            </p>
                            {task.completed && task.completed_at && (
                              <p className="text-xs text-green-600 mt-1">
                                Completed on {formatDate(task.completed_at)}
                              </p>
                            )}
                          </div>
                          {task.completed && (
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default EmployeesList