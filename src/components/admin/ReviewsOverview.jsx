import { formatDateTime } from '../../utils/dateUtils'

const ReviewsOverview = ({ reviews }) => {
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.overall_rating, 0) / reviews.length).toFixed(1)
    : 0

  const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
    rating,
    count: reviews.filter(review => review.overall_rating === rating).length
  }))

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Onboarding Reviews</h2>
          <p className="text-gray-600">Employee feedback and ratings</p>
        </div>

        {/* Rating Summary */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">{averageRating}</div>
              <div className="text-gray-600">Average Rating</div>
              <div className="flex justify-center mt-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Rating Distribution</h4>
              <div className="space-y-2">
                {ratingDistribution.reverse().map(({ rating, count }) => (
                  <div key={rating} className="flex items-center">
                    <span className="text-sm text-gray-600 w-8">{rating}★</span>
                    <div className="flex-1 mx-2 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ 
                          width: reviews.length > 0 ? `${(count / reviews.length) * 100}%` : '0%' 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="divide-y divide-gray-200">
          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No reviews yet</h3>
              <p className="text-gray-600">Reviews will appear here once employees complete their onboarding.</p>
            </div>
          ) : (
            reviews.map(review => (
              <div key={review.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h4 className="font-medium text-gray-900">
                        {review.employees?.full_name || 'Unknown Employee'}
                      </h4>
                      <div className="flex ml-4">
                        {[1, 2, 3, 4, 5].map(star => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.overall_rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{review.employees?.email}</p>
                    
                    {review.feedback && (
                      <div className="mb-3">
                        <h5 className="text-sm font-medium text-gray-700">Feedback:</h5>
                        <p className="text-gray-600 mt-1">{review.feedback}</p>
                      </div>
                    )}
                    
                    {review.suggestions && (
                      <div className="mb-3">
                        <h5 className="text-sm font-medium text-gray-700">Suggestions:</h5>
                        <p className="text-gray-600 mt-1">{review.suggestions}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right text-sm text-gray-500">
                    {formatDateTime(review.submitted_at)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter task title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Enter task description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Day Number *
                </label>
                <select
                  required
                  value={formData.day_number}
                  onChange={(e) => setFormData({ ...formData, day_number: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day}>Day {day}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Saving...' : (editingTask ? 'Update Task' : 'Create Task')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReviewsOverview