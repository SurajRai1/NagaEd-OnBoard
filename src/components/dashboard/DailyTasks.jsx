import { useState } from 'react'
import { calculateOnboardingDay, getTasksForCurrentDay } from '../../utils/dateUtils'
import { completeTask } from '../../lib/supabase'

const DailyTasks = ({ employee, tasks, onTaskComplete }) => {
  const [completing, setCompleting] = useState({})
  const [taskNotes, setTaskNotes] = useState({})

  if (!employee) return null

  const currentDay = calculateOnboardingDay(employee.start_date)
  const todaysTasks = getTasksForCurrentDay(tasks, employee.start_date)

  const handleCompleteTask = async (taskId) => {
    setCompleting(prev => ({ ...prev, [taskId]: true }))
    
    try {
      const { error } = await completeTask(employee.id, taskId, taskNotes[taskId] || '')
      if (error) throw error
      
      // Refresh the employee data to get updated task status
      await onTaskComplete()
      
      // Clear notes for this task
      setTaskNotes(prev => ({ ...prev, [taskId]: '' }))
    } catch (err) {
      console.error('Error completing task:', err)
    } finally {
      setCompleting(prev => ({ ...prev, [taskId]: false }))
    }
  }

  const handleNotesChange = (taskId, notes) => {
    setTaskNotes(prev => ({ ...prev, [taskId]: notes }))
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Today's Tasks</h2>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          Day {currentDay}
        </span>
      </div>

      {todaysTasks.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
          <p className="text-gray-600">No tasks scheduled for today. Great job staying on track!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {todaysTasks.map(employeeTask => {
            const task = employeeTask.tasks
            const isCompleted = employeeTask.completed
            const isCompletingTask = completing[task.id]

            return (
              <div
                key={employeeTask.id}
                className={`border rounded-lg p-4 transition-all ${
                  isCompleted 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className={`text-lg font-medium ${
                        isCompleted ? 'text-green-800 line-through' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </h3>
                      {isCompleted && (
                        <svg className="w-5 h-5 text-green-600 ml-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    {task.description && (
                      <p className={`mt-2 ${
                        isCompleted ? 'text-green-700' : 'text-gray-600'
                      }`}>
                        {task.description}
                      </p>
                    )}
                    
                    {!isCompleted && (
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Notes (optional)
                        </label>
                        <textarea
                          value={taskNotes[task.id] || ''}
                          onChange={(e) => handleNotesChange(task.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          rows={2}
                          placeholder="Add any notes about this task..."
                        />
                      </div>
                    )}
                    
                    {isCompleted && employeeTask.notes && (
                      <div className="mt-3 p-3 bg-green-100 rounded-md">
                        <p className="text-sm text-green-800">
                          <strong>Notes:</strong> {employeeTask.notes}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {!isCompleted && (
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      disabled={isCompletingTask}
                      className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isCompletingTask ? 'Completing...' : 'Complete'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default DailyTasks