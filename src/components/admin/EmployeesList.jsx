import { useState } from 'react';
// Import our new helper and remove createCustomTask
import { getEmployeeProgress, getTasks, createAndAssignTask, assignTaskToEmployee } from '../../lib/supabase';
import { calculateProgress, formatDate } from '../../utils/dateUtils';

const EmployeesList = ({ employees, onRefresh }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeProgress, setEmployeeProgress] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [allTasks, setAllTasks] = useState([]);

  const [selectedExistingTask, setSelectedExistingTask] = useState('');
  const [newCustomTask, setNewCustomTask] = useState({ 
    title: '', 
    description: '', 
    day_number: 1,
    link_text: '',
    link_url: ''
  });
  const [isAssigning, setIsAssigning] = useState(false);

  const handleViewProgress = async (employee) => {
    setSelectedEmployee(employee);
    setLoadingProgress(true);
    setShowAssignForm(false);

    try {
      const [{ data: progressData, error: progressError }, { data: tasksData, error: tasksError }] = await Promise.all([
        getEmployeeProgress(employee.id),
        getTasks()
      ]);
      
      if (progressError) throw progressError;
      if (tasksError) throw tasksError;

      setEmployeeProgress(progressData || []);
      setAllTasks(tasksData || []);
    } catch (error) {
      console.error('Error fetching employee data:', error);
    } finally {
      setLoadingProgress(false);
    }
  };

  const closeModal = () => {
    setSelectedEmployee(null);
    setEmployeeProgress(null);
    setAllTasks([]);
    setShowAssignForm(false);
    setNewCustomTask({ title: '', description: '', day_number: 1, link_text: '', link_url: '' });
    setSelectedExistingTask('');
  };

  const handleAssignExistingTask = async (e) => {
    e.preventDefault();
    if (!selectedExistingTask) return;
    setIsAssigning(true);
    try {
      await assignTaskToEmployee(selectedEmployee.id, selectedExistingTask);
      await handleViewProgress(selectedEmployee); // Refresh progress
    } catch (error) {
      console.error('Error assigning task:', error);
    } finally {
      setIsAssigning(false);
      setSelectedExistingTask('');
    }
  };

  // --- UPDATED HANDLER ---
  const handleCreateAndAssignTask = async (e) => {
    e.preventDefault();
    if (!newCustomTask.title || !selectedEmployee) return;
    setIsAssigning(true);
    
    try {
      // Use the single, reliable function
      const { error } = await createAndAssignTask(newCustomTask, selectedEmployee.id);
      
      if (error) {
        throw error; // Let the catch block handle it
      }
      
      // If successful, refresh the view and close the form
      await handleViewProgress(selectedEmployee);
      setShowAssignForm(false);
    } catch (error) {
      console.error('Error in create/assign process:', error.message);
      // Optionally: show an error message to the user
    } finally {
      setIsAssigning(false);
      setNewCustomTask({ title: '', description: '', day_number: 1, link_text: '', link_url: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md">
        {/* ... table header and body ... */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Employees</h2>
          <p className="text-gray-600">Manage employee onboarding progress and assign tasks</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map(employee => {
                const progress = calculateProgress(employee.employee_tasks);
                return (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{employee.full_name}</div>
                        <div className="text-sm text-gray-500">{employee.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {employee.department || 'Not specified'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${progress > 80 ? 'bg-green-600' : 'bg-blue-600'}`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {employee.onboarding_completed ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">In Progress</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => handleViewProgress(employee)} className="text-blue-600 hover:text-blue-900">
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL SECTION (No changes to the JSX structure, only the handler function above) --- */}
      {selectedEmployee && (
         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedEmployee.full_name}'s Progress</h3>
                <p className="text-gray-600">{selectedEmployee.email}</p>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </button>
            </div>

            {loadingProgress ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading progress...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="max-h-64 overflow-y-auto pr-2">
                  <div className="space-y-2">
                    {employeeProgress?.map(task => (
                      <div key={task.id} className={`p-4 rounded-lg border ${task.completed ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className={`font-medium ${task.completed ? 'text-green-800' : 'text-gray-900'}`}>
                              {task.tasks.day_number ? `Day ${task.tasks.day_number}: ` : 'Ad-hoc: '}{task.tasks.title}
                            </h5>
                            <p className={`text-sm ${task.completed ? 'text-green-600' : 'text-gray-600'}`}>{task.tasks.description}</p>
                            {task.tasks.link_url && (
                              <a href={task.tasks.link_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline mt-1 block">
                                {task.tasks.link_text || 'View Link'}
                              </a>
                            )}
                            {task.completed && task.completed_at && (<p className="text-xs text-green-600 mt-1">Completed on {formatDate(task.completed_at)}</p>)}
                          </div>
                          {task.completed && (<svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  {!showAssignForm ? (
                    <button onClick={() => setShowAssignForm(true)} className="w-full bg-blue-50 text-blue-700 py-2 rounded-md hover:bg-blue-100">Assign New Task</button>
                  ) : (
                    <div className="space-y-6">
                      <form onSubmit={handleAssignExistingTask} className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Assign an Existing Task</h4>
                        <div className="flex items-center space-x-2">
                          <select value={selectedExistingTask} onChange={(e) => setSelectedExistingTask(e.target.value)} className="flex-grow w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Select a task...</option>
                            {allTasks.map(task => <option key={task.id} value={task.id}>{task.title}</option>)}
                          </select>
                          <button type="submit" disabled={isAssigning || !selectedExistingTask} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">{isAssigning ? '...' : 'Assign'}</button>
                        </div>
                      </form>

                      <form onSubmit={handleCreateAndAssignTask} className="p-4 bg-gray-50 rounded-lg space-y-3">
                        <h4 className="font-medium">Or, Create a New Task and Assign It</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <input
                            type="text"
                            placeholder="New Task Title *"
                            required
                            value={newCustomTask.title}
                            onChange={(e) => setNewCustomTask({...newCustomTask, title: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md md:col-span-2"
                          />
                          <select
                            value={newCustomTask.day_number}
                            onChange={(e) => setNewCustomTask({...newCustomTask, day_number: parseInt(e.target.value)})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          >
                            {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                              <option key={day} value={day}>Day {day}</option>
                            ))}
                          </select>
                        </div>
                        <textarea
                          placeholder="Description (optional)"
                          rows="2"
                          value={newCustomTask.description}
                          onChange={(e) => setNewCustomTask({...newCustomTask, description: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Link Text (e.g., Coursera)"
                            value={newCustomTask.link_text}
                            onChange={(e) => setNewCustomTask({...newCustomTask, link_text: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                          <input
                            type="url"
                            placeholder="Link URL (https://...)"
                            value={newCustomTask.link_url}
                            onChange={(e) => setNewCustomTask({...newCustomTask, link_url: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600">Cancel</button>
                            <button type="submit" disabled={isAssigning || !newCustomTask.title} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50">{isAssigning ? '...' : 'Create & Assign'}</button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeesList;