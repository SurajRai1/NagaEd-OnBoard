import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useEmployee } from '../../hooks/useEmployee'
import WelcomeSection from './WelcomeSection'
import OnboardingTimeline from './OnboardingTimeline'
import DailyTasks from './DailyTasks'
import ProgressOverview from './ProgressOverview'
import Navigation from '../layout/Navigation'

const EmployeeDashboard = () => {
  const { user } = useAuth()
  const { employee, tasks, loading, error, refreshEmployeeData } = useEmployee()
  const [activeTab, setActiveTab] = useState('dashboard')

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error: {error}</p>
          <button 
            onClick={refreshEmployeeData}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <WelcomeSection employee={employee} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <OnboardingTimeline employee={employee} tasks={tasks} />
              <DailyTasks 
                employee={employee} 
                tasks={tasks} 
                onTaskComplete={refreshEmployeeData}
              />
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <ProgressOverview employee={employee} tasks={tasks} />
        )}
      </main>
    </div>
  )
}

export default EmployeeDashboard