import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/auth'
import { setToken, setRefreshToken, setUser, setAuthenticated } from '../store/authSlice'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { toast } from 'sonner'
import type { AppDispatch } from '../store'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedUserType, setSelectedUserType] = useState('SuperAdmin')
  const [credentialsFilled, setCredentialsFilled] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  // Prefill SuperAdmin credentials on component mount
  useEffect(() => {
    fillCredentials('SuperAdmin')
  }, [])

  // Quick fill credentials function
  const fillCredentials = (userType: string) => {
    setSelectedUserType(userType)
    setCredentialsFilled(true)

    if (userType === 'SuperAdmin') {
      setEmail('superadmin@default.local')
      setPassword('SuperAdmin123!')
    } else if (userType === 'TenantAdmin') {
      setEmail('tenantadmin@gmail.com')
      setPassword('12345678')
    }

    // Show success toast
    toast.success(`${userType} credentials filled`, {
      description: `Ready to login as ${userType}`,
      duration: 2000,
    })

    // Clear the success message after 2 seconds
    setTimeout(() => setCredentialsFilled(false), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Basic validation
      if (!email || !password) {
        toast.error('Validation Error', {
          description: 'Please fill in all fields',
        })
        setLoading(false)
        return
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        toast.error('Validation Error', {
          description: 'Please enter a valid email address',
        })
        setLoading(false)
        return
      }

      // Call the authentication API
      const response = await login({ email, password })

      if (response.data) {
        dispatch(setToken(response.data.accessToken || null))
        dispatch(setRefreshToken(response.data.refreshToken || null))
        dispatch(setUser(response.data.user || null))
        dispatch(setAuthenticated(true))

        // Show success toast
        toast.success('Login Successful', {
          description: `Welcome back, ${response.data.user?.firstName || response.data.user?.email}!`,
        })

        // Wait a moment for the toast to be visible, then redirect
        setTimeout(() => {
          navigate('/dashboard')
        }, 1000)
      }
    } catch (err: any) {
      toast.error('Login Failed', {
        description: err.response?.data?.error || 'Please check your credentials and try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cloud POS by Netsoul</h1>
          <p className="text-gray-600 mb-4">Modern point of sale system for your business</p>

          {/* Development Mode Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Development Mode
          </div>
          <p className="text-sm text-gray-500 mb-2">SuperAdmin credentials pre-filled for testing</p>
          <div className="text-xs text-gray-400 mb-6 space-y-1">
            <p><strong>SuperAdmin:</strong> qaiser@gmail.com / 12345678</p>
            <p><strong>TenantAdmin:</strong> tenantadmin@gmail.com / 12345678</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Login</h2>
          <p className="text-gray-600 text-sm mb-6">Enter your credentials to access the system</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="qaiser@gmail.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Quick Login Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-blue-600 font-medium">Quick Login (Dev Only):</p>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {selectedUserType} selected
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fillCredentials('SuperAdmin')}
                  className={`flex-1 py-2 px-4 text-sm rounded-md border transition-colors ${
                    selectedUserType === 'SuperAdmin'
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  SuperAdmin
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('TenantAdmin')}
                  className={`flex-1 py-2 px-4 text-sm rounded-md border transition-colors ${
                    selectedUserType === 'TenantAdmin'
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Tenant Admin
                </button>
              </div>
            </div>

            {/* Success Message */}
            {credentialsFilled && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-600">✓ {selectedUserType} credentials filled!</p>
              </div>
            )}

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
