import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { submitOnboardingReview, updateEmployee } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

const OnboardingReviewForm = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    overall_rating: 5,
    feedback: '',
    suggestions: ''
  })

  const handleRatingChange = (rating) => {
    setFormData({ ...formData, overall_rating: rating })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Submit review
      const { error: reviewError } = await submitOnboardingReview({
        employee_id: user.id,
        ...formData
      })
      
      if (reviewError) throw reviewError

      // Mark onboarding as completed
      const { error: updateError } = await updateEmployee(user.id, {
        onboarding_completed: true
      })
      
      if (updateError) throw updateError

      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Onboarding Complete! 🎉</h1>
          <p className="text-gray-600 mt-2">Help us improve the onboarding experience</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Overall Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How would you rate your overall onboarding experience? *
              </label>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleRatingChange(rating)}
                    className={`p-2 rounded-full transition-colors ${
                      formData.overall_rating >= rating
                        ? 'text-yellow-400 hover:text-yellow-500'
                        : 'text-gray-300 hover:text-gray-400'
                    }`}
                  >
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
              <div className="text-center mt-2">
                <span className="text-sm text-gray-600">
                  {formData.overall_rating === 1 && 'Poor'}
                  {formData.overall_rating === 2 && 'Fair'}
                  {formData.overall_rating === 3 && 'Good'}
                  {formData.overall_rating === 4 && 'Very Good'}
                  {formData.overall_rating === 5 && 'Excellent'}
                </span>
              </div>
            </div>

            {/* Feedback */}
            <div>
              <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                What did you like most about your onboarding experience?
              </label>
              <textarea
                id="feedback"
                value={formData.feedback}
                onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Share what worked well for you..."
              />
            </div>

            {/* Suggestions */}
            <div>
              <label htmlFor="suggestions" className="block text-sm font-medium text-gray-700 mb-1">
                What could we improve for future new hires?
              </label>
              <textarea
                id="suggestions"
                value={formData.suggestions}
                onChange={(e) => setFormData({ ...formData, suggestions: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Share your suggestions for improvement..."
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Skip for Now
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default OnboardingReviewForm