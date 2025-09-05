import { formatDate, getDaysRemaining } from '../../utils/dateUtils'

const WelcomeSection = ({ employee }) => {
  if (!employee) return null

  const daysRemaining = getDaysRemaining(employee.start_date)
  const isComplete = employee.onboarding_completed

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome, {employee.full_name}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            {isComplete
              ? 'Congratulations! You have completed your onboarding journey.'
              : `You started your onboarding journey on ${formatDate(employee.start_date)}`
            }
          </p>
        </div>
        <div className="text-left sm:text-right mt-4 sm:mt-0">
          {!isComplete && (
            <>
              <div className="text-2xl font-bold text-blue-600">{daysRemaining}</div>
              <div className="text-sm text-gray-500">days remaining</div>
            </>
          )}
          {isComplete && (
            <div className="flex items-center text-green-600">
              <svg className="w-8 h-8 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Completed</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800">Department</h3>
          <p className="text-lg font-semibold text-blue-900">{employee.department || 'Not specified'}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-800">Position</h3>
          <p className="text-lg font-semibold text-green-900">{employee.position || 'Not specified'}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-800">Start Date</h3>
          <p className="text-lg font-semibold text-purple-900">{formatDate(employee.start_date)}</p>
        </div>
      </div>
    </div>
  )
}

export default WelcomeSection