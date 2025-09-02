import { useState } from 'react'
import { createTask, updateTask } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

const TasksManagement = ({ tasks, onRefresh }) => {
  const { user } = useAuth()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    day_number: 1
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingTask) {
        const { error } = await updateTask(editingTask.id, formData)
        if (error) throw error
      } else {
        const { error } = await createTask({
          ...formData,
          created_by: user.id
        })
        if (error) throw error
      }

      // Reset form and refresh data
      setFormData({ title: '', description: '', day_number: 1 })
      setShowAddForm(false)
      setEditingTask(null)
      onRefresh()
    } catch (error) {
      console.error('Error saving task:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description || '',
      day_number: task.day_number
    })
    setShowAddForm(true)
  }

  const handleCancel = () => {
    setShowAddForm(false)
    setEditingTask(null)
    setFormData({ title: '', description: '', day_number: 1 })
  }

  // Group tasks by day
  const tasksByDay = tasks.reduce((acc, task) => {
    const day = task.day_number
    if (!acc[day]) acc[day] = []
    acc[day].push(task)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Task Management</h2>
            <p className="text-gray-600">Create and manage onboarding tasks</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Add New Task
          </button>
        </div>

        {/* Add/Edit Task Form */}
        {showAddForm && (
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-md font-medium text-gray-900 mb-4">
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter task title"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Enter task description"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Day Number *
                  </label>
                  <select
                    required
                    value={formData.day_number}
                    onChange={(e) => setFormData({ ...formData, day_number: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                      <option key={day} value={day}>Day {day}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Saving...' : (editingTask ? 'Update Task' : 'Create Task')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tasks List */}
        <div className="p-6">
          <div className="space-y-4">
            {Object.entries(tasksByDay)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([day, dayTasks]) => (
                <div key={day} className="border border-gray-200 rounded-lg">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h4 className="font-medium text-gray-900">Day {day}</h4>
                  </div>
                  <div className="p-4 space-y-3">
                    {dayTasks.map(task => (
                      <div key={task.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{task.title}</h5>
                          {task.description && (
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleEdit(task)}
                          className="text-blue-600 hover:text-blue-900 text-sm"
                        >
                          Edit
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TasksManagement