import React from 'react';

const AdminOverview = ({ employees, tasks, reviews }) => {
  const activeOnboarding = employees.filter(e => !e.onboarding_completed).length;
  const completedOnboarding = employees.length - activeOnboarding;

  const totalTasks = tasks.length;
  // This is a simplified calculation. For a real-world scenario, you would likely
  // want to calculate this based on assigned employee tasks.
  const overallTaskCompletion = Math.round(
    (employees.reduce((acc, e) => acc + (e.onboarding_completed ? totalTasks : 0), 0) / (employees.length * totalTasks)) * 100
  ) || 0;

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.overall_rating, 0) / reviews.length).toFixed(1)
    : 'N/A';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Active Onboarding */}
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-600">Active Onboarding</h3>
          <p className="text-3xl font-bold text-blue-600">{activeOnboarding}</p>
        </div>
        <p className="text-xs text-gray-500 mt-2">Employees currently in their 30-day plan.</p>
      </div>

      {/* Completed Onboarding */}
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-600">Completed Onboarding</h3>
          <p className="text-3xl font-bold text-green-600">{completedOnboarding}</p>
        </div>
        <p className="text-xs text-gray-500 mt-2">Employees who finished the program.</p>
      </div>

      {/* Overall Task Completion */}
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-600">Overall Task Completion</h3>
          <p className="text-3xl font-bold text-purple-600">{overallTaskCompletion}%</p>
        </div>
        <p className="text-xs text-gray-500 mt-2">Across all active employees.</p>
      </div>

      {/* Average Feedback Rating */}
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-600">Average Feedback Rating</h3>
          <p className="text-3xl font-bold text-yellow-500">{averageRating}</p>
        </div>
        <p className="text-xs text-gray-500 mt-2">From completed employee reviews.</p>
      </div>
    </div>
  );
};

export default AdminOverview;