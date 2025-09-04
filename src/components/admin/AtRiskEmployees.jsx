import React from 'react';
import { calculateOnboardingDay, calculateProgress } from '../../utils/dateUtils';

const AtRiskEmployees = ({ employees }) => {
  const atRiskEmployees = employees
    .map(employee => {
      if (employee.onboarding_completed) return null;

      const currentDay = calculateOnboardingDay(employee.start_date);
      const overdueTasks = employee.employee_tasks.filter(et =>
        !et.completed && et.tasks && et.tasks.day_number < currentDay
      );
      
      if (overdueTasks.length > 0) {
        return {
          ...employee,
          overdueCount: overdueTasks.length,
          progress: calculateProgress(employee.employee_tasks)
        };
      }
      return null;
    })
    .filter(Boolean) // Remove nulls
    .sort((a, b) => b.overdueCount - a.overdueCount); // Show most at-risk first

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">At-Risk Employees</h3>
        <p className="text-sm text-gray-600">Employees with overdue tasks who may need support.</p>
      </div>
      
      {atRiskEmployees.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-gray-500">🎉 Everyone is on track!</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {atRiskEmployees.map(employee => (
            <div key={employee.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div>
                <p className="font-medium text-gray-900">{employee.full_name}</p>
                <p className="text-sm text-gray-500">{employee.email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-red-600">{employee.overdueCount} overdue task(s)</p>
                <p className="text-xs text-gray-500">{employee.progress}% complete</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AtRiskEmployees;