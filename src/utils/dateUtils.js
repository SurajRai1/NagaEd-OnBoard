import { differenceInDays, addDays, format, isAfter } from 'date-fns'

export const calculateOnboardingDay = (startDate) => {
  const today = new Date()
  const start = new Date(startDate)
  const dayNumber = differenceInDays(today, start) + 1
  
  // Ensure day number is between 1 and 30
  return Math.max(1, Math.min(30, dayNumber))
}

export const getTasksForCurrentDay = (tasks, startDate) => {
  const currentDay = calculateOnboardingDay(startDate)
  return tasks.filter(task => task.tasks?.day_number === currentDay)
}

export const calculateProgress = (tasks) => {
  if (!tasks || tasks.length === 0) return 0
  const completedTasks = tasks.filter(task => task.completed)
  return Math.round((completedTasks.length / tasks.length) * 100)
}

export const getUpcomingTasks = (tasks, startDate, days = 3) => {
  const currentDay = calculateOnboardingDay(startDate)
  return tasks.filter(task => {
    const taskDay = task.tasks?.day_number
    return taskDay > currentDay && taskDay <= currentDay + days
  })
}

export const formatDate = (date) => {
  return format(new Date(date), 'MMM dd, yyyy')
}

export const formatDateTime = (date) => {
  return format(new Date(date), 'MMM dd, yyyy HH:mm')
}

export const isOnboardingComplete = (startDate) => {
  const completionDate = addDays(new Date(startDate), 30)
  return isAfter(new Date(), completionDate)
}

export const getDaysRemaining = (startDate) => {
  const completionDate = addDays(new Date(startDate), 30)
  const today = new Date()
  const remaining = differenceInDays(completionDate, today)
  return Math.max(0, remaining)
}