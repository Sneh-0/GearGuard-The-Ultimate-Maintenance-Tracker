import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../utils/api'

export const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [token, setToken] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setToken('')
    if (!email.trim()) {
      setError('Email is required')
      return
    }
    setIsLoading(true)
    try {
      const res = await api.forgotPassword(email)
      setMessage(res.message || 'If the email exists, a reset link was created.')
      if (res.token) {
        setToken(res.token)
      }
    } catch (e) {
      setError('Failed to request password reset')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Forgot Password</h1>
          <p className="text-gray-600">Enter your email to reset your password</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        {message && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-700 text-sm">{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition"
          >
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        {token && (
          <div className="mt-6 p-4 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">Demo token generated:</p>
            <p className="text-xs break-all font-mono bg-gray-50 p-2 rounded">{token}</p>
            <div className="mt-3 flex space-x-2">
              <button
                onClick={() => navigate(`/reset?token=${encodeURIComponent(token)}`)}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Continue to Reset
              </button>
            </div>
          </div>
        )}

        <div className="text-center mt-6 text-sm text-gray-600">
          <button onClick={() => navigate('/login')} className="text-blue-600 hover:underline">Back to Login</button>
        </div>
      </div>
    </div>
  )
}
