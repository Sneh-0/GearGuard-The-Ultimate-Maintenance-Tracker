import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authHelper } from '../utils/mockData'

export const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!email.trim()) {
      setError('Email is required')
      return
    }
    if (!password.trim()) {
      setError('Password is required')
      return
    }

    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      const result = authHelper.login(email, password)
      
      if (result.success) {
        authHelper.setUser(result.user)
        navigate('/dashboard')
      } else {
        setError(result.error)
      }
      
      setIsLoading(false)
    }, 500)
  }

  const demoAccounts = [
    { email: 'admin@gearguard.com', password: 'admin123', role: 'Admin' },
    { email: 'manager@gearguard.com', password: 'manager123', role: 'Manager' },
    { email: 'tech@gearguard.com', password: 'tech123', role: 'Technician' }
  ]

  const fillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">GearGuard</h1>
          <p className="text-gray-600">The Ultimate Maintenance Tracker</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Demo Accounts */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
            Demo Accounts
          </p>
          <div className="space-y-2">
            {demoAccounts.map((account, idx) => (
              <button
                key={idx}
                onClick={() => fillDemo(account.email, account.password)}
                className="w-full text-left text-sm p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition"
              >
                <div className="font-medium text-gray-700">{account.role}</div>
                <div className="text-xs text-gray-500">{account.email}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <a href="#" className="text-blue-600 hover:underline">
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  )
}
