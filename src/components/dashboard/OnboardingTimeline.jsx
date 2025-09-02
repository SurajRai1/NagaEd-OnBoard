import { calculateOnboardingDay, isOnboardingComplete } from '../../utils/dateUtils'

const OnboardingTimeline = ({ employee, tasks }) => {
  if (!employee) return null

  const currentDay = calculateOnboardingDay(employee.start_date)
  const isComplete = isOnboardingComplete(employee.start_date)
  
  // Group tasks by week
  const weeks = []
  for (let week = 0; week < 5; week++) {
    const weekTasks = tasks.filter(task => {
      const dayNumber = task.tasks?.day_number
      return dayNumber > week * 6 && dayNumber <= (week + 1) * 6
    })
    weeks.push({
      number: week + 1,
      days: Array.from({ length: 6 }, (_, day) => {
        const dayNumber = week * 6 + day + 1
        if (dayNumber > 30) return null
        
        const dayTasks = weekTasks.filter(task => task.tasks?.day_number === dayNumber)
        const completed = dayTasks.every(task => task.completed)
        const hasTasks = dayTasks.length > 0
        
        return {
          number: dayNumber,
          completed,
          current: dayNumber === currentDay,
          hasTasks,
          taskCount: dayTasks.length
        }
      }).filter(Boolean)
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">30-Day Onboarding Timeline</h2>
      
      <div className="space-y-6">
        {weeks.map(week => (
          <div key={week.number} className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Week {week.number}</h3>
            <div className="grid grid-cols-6 gap-2">
              {week.days.map(day => (
                <div
                  key={day.number}
                  className={`
                    aspect-square rounded-lg border-2 flex items-center justify-center text-sm font-medium transition-all
                    ${day.current 
                      ? 'border-blue-500 bg-blue-100 text-blue-700 ring-2 ring-blue-200' 
                      : day.completed 
                        ? 'border-green-500 bg-green-100 text-green-700'
                        : day.number < currentDay
                          ? 'border-gray-300 bg-gray-100 text-gray-500'
                          : 'border-gray-200 bg-white text-gray-400'
                    }
                  `}
                >
                  {day.completed ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    day.number
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Completed</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Current Day</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
              <span className="text-gray-600">Upcoming</span>
            </div>
          </div>
          <div className="text-gray-500">
            Day {Math.min(currentDay, 30)} of 30
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnboardingTimeline