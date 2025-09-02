import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useEmployee } from '../../hooks/useEmployee'
import AuthForm from '../auth/AuthForm'
import EmployeeDetailsForm from '../onboarding/EmployeeDetailsForm'
import EmployeeDashboard from '../dashboard/EmployeeDashboard'
import AdminDashboard from '../admin/AdminDashboard'
import OnboardingReviewForm from '../review/OnboardingReviewForm'
import ProtectedRoute from './ProtectedRoute'
import { isOnboardingComplete } from '../../utils/dateUtils'

const AppRouter = () => {
  const { user, loading: authLoading } = useAuth()
  const { employee, loading: employeeLoading } = useEmployee()

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route
          path="/auth"
          element={user ? <Navigate to="/dashboard" replace /> : <AuthForm />}
        />

        {/* Protected routes */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              {employeeLoading ? (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                  </div>
                </div>
              ) : employee ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <EmployeeDetailsForm />
              )}
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {employeeLoading ? (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                  </div>
                </div>
              ) : !employee ? (
                <Navigate to="/onboarding" replace />
              ) : (
                <EmployeeDashboard />
              )}
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              {employeeLoading ? (
                 <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                 <div className="text-center">
                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                   <p className="mt-4 text-gray-600">Loading...</p>
                 </div>
               </div>
              ) : employee && employee.role === 'admin' ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/dashboard" replace />
              )}
            </ProtectedRoute>
          }
        />

        <Route
          path="/review"
          element={
            <ProtectedRoute>
              {employeeLoading ? (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                  </div>
                </div>
              ) : !employee ? (
                <Navigate to="/onboarding" replace />
              ) : employee.onboarding_completed ? (
                <Navigate to="/dashboard" replace />
              ) : !isOnboardingComplete(employee.start_date) ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <OnboardingReviewForm />
              )}
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route
          path="/"
          element={<Navigate to={user ? "/dashboard" : "/auth"} replace />}
        />

        {/* Catch all route */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  )
}

export default AppRouter