import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useEmployee } from '../../hooks/useEmployee';
import AuthForm from '../auth/AuthForm';
import EmployeeDetailsForm from '../onboarding/EmployeeDetailsForm';
import EmployeeDashboard from '../dashboard/EmployeeDashboard';
import AdminDashboard from '../admin/AdminDashboard';
import OnboardingReviewForm from '../review/OnboardingReviewForm';
import ProtectedRoute from './ProtectedRoute';
import { isOnboardingComplete } from '../../utils/dateUtils';

const AppRouter = () => {
  const { user, loading: authLoading } = useAuth();
  const { employee, loading: employeeLoading } = useEmployee();

  // Show a global loading spinner while fetching user/employee data
  if (authLoading || (user && employeeLoading)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthForm />} />

        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              {employee ? <Navigate to="/" replace /> : <EmployeeDetailsForm />}
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {!employee ? (
                <Navigate to="/onboarding" replace />
              ) : employee.role === 'admin' ? (
                // If an admin tries to go to /dashboard, send them to /admin
                <Navigate to="/admin" replace />
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
              {!employee ? (
                <Navigate to="/onboarding" replace />
              ) : employee.role === 'admin' ? (
                <AdminDashboard />
              ) : (
                // If an employee tries to go to /admin, send them to /dashboard
                <Navigate to="/dashboard" replace />
              )}
            </ProtectedRoute>
          }
        />

        <Route
          path="/review"
          element={
            <ProtectedRoute>
              {!employee ? (
                <Navigate to="/onboarding" replace />
              ) : // Logic for review form remains the same
              employee.onboarding_completed || !isOnboardingComplete(employee.start_date) ? (
                <Navigate to="/" replace />
              ) : (
                <OnboardingReviewForm />
              )}
            </ProtectedRoute>
          }
        />

        {/* This is the main redirect logic */}
        <Route
          path="/"
          element={
            !user ? (
              <Navigate to="/auth" replace />
            ) : !employee ? (
              <Navigate to="/onboarding" replace />
            ) : employee.role === 'admin' ? (
              // If the user is an admin, default route is /admin
              <Navigate to="/admin" replace />
            ) : (
              // Otherwise, the default route is /dashboard
              <Navigate to="/dashboard" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;