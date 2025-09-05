import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { calculateProgress, formatDate } from '../../utils/dateUtils'

const ProgressOverview = ({ employee, tasks }) => {
  if (!employee) return null

  const overallProgress = calculateProgress(tasks)
  const completedTasks = tasks.filter(task => task.completed)
  const pendingTasks = tasks.filter(task => !task.completed)

  // Prepare data for charts
  const weeklyProgress = []
  for (let week = 1; week <= 5; week++) {
    const weekStart = (week - 1) * 6 + 1
    const weekEnd = Math.min(week * 6, 30)

    const weekTasks = tasks.filter(task => {
      const dayNumber = task.tasks?.day_number
      return dayNumber >= weekStart && dayNumber <= weekEnd
    })

    const weekCompleted = weekTasks.filter(task => task.completed).length
    const weekTotal = weekTasks.length
    const weekProgress = weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0

    weeklyProgress.push({
      week: `Week ${week}`,
      progress: weekProgress,
      completed: weekCompleted,
      total: weekTotal
    })
  }

  const dailyCompletions = []
  for (let day = 1; day <= 30; day++) {
    const dayTasks = tasks.filter(task => task.tasks?.day_number === day)
    const completionsOnDay = dayTasks.filter(task => task.completed).length

    dailyCompletions.push({
      day: day,
      completions: completionsOnDay
    })
  }

  return (
    <div className="space-y-8">
      {/* Progress Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Overall Progress</h3>
              <p className="text-3xl font-bold text-blue-600">{overallProgress}%</p>
            </div>
            <div className="text-blue-500">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1V8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Completed Tasks</h3>
              <p className="text-3xl font-bold text-green-600">{completedTasks.length}</p>
            </div>
            <div className="text-green-500">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">out of {tasks.length} total tasks</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Pending Tasks</h3>
              <p className="text-3xl font-bold text-orange-600">{pendingTasks.length}</p>
            </div>
            <div className="text-orange-500">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">remaining to complete</p>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Progress</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [`${value}%`, 'Progress']}
                labelFormatter={(label) => label}
              />
              <Bar dataKey="progress" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Completions Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Task Completions</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyCompletions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [value, 'Tasks Completed']}
                labelFormatter={(label) => `Day ${label}`}
              />
              <Line
                type="monotone"
                dataKey="completions"
                stroke="#16a34a"
                strokeWidth={2}
                dot={{ fill: '#16a34a', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Completions */}
      {completedTasks.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Completions</h3>
          <div className="space-y-3">
            {completedTasks
              .slice()
              .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))
              .slice(0, 5)
              .map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-green-900">{task.tasks.title}</h4>
                    <p className="text-sm text-green-700">
                      Completed on {formatDate(task.completed_at)}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProgressOverview