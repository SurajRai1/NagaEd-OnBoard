import { useState, useEffect } from 'react'
import { getAllEmployees, getAllReviews, getTasks } from '../../lib/supabase'
import EmployeesList from './EmployeesList'
import TasksManagement from './TasksManagement'
import ReviewsOverview from './ReviewsOverview'
import Navigation from '../layout/Navigation'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('admin')
  const [adminView, setAdminView] = useState('employees')
  const [employees, setEmployees] = useState([])
  const [reviews, setReviews] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      
      const [employeesResult, reviewsResult, tasksResult] = await Promise.all([
        getAllEmployees(),
        getAllReviews(),
        getTasks()
      ])

      if (employeesResult.error) throw employeesResult.error
      if (reviewsResult.error) throw reviewsResult.error
      if (tasksResult.error) throw tasksResult.error

      setEmployees(employeesResult.data || [])
      setReviews(reviewsResult.data || [])
      setTasks(tasksResult.data || [])
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const adminTabs = [
    { id: 'employees', name: 'Employees', icon: 'users' },
    { id: 'tasks', name: 'Tasks', icon: 'clipboard' },
    { id: 'reviews', name: 'Reviews', icon: 'star' }
  ]

  const renderIcon = (iconType) => {
    switch (iconType) {
      case 'users':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
        )
      case 'clipboard':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2v1a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd" />
          </svg>
        )
      case 'star':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage employees, tasks, and onboarding progress</p>
        </div>

        {/* Admin Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {adminTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setAdminView(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    adminView === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {renderIcon(tab.icon)}
                  <span className="ml-2">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Admin Content */}
        <div className="space-y-6">
          {adminView === 'employees' && (
            <EmployeesList employees={employees} onRefresh={fetchAdminData} />
          )}
          {adminView === 'tasks' && (
            <TasksManagement tasks={tasks} onRefresh={fetchAdminData} />
          )}
          {adminView === 'reviews' && (
            <ReviewsOverview reviews={reviews} />
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard