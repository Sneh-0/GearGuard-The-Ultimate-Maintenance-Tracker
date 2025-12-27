import React from 'react'
import { Navigate } from 'react-router-dom'
import { authHelper } from '../utils/auth'

// Protected route that requires authentication
export const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authHelper.isAuthenticated()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

// Route for role-based access
export const RoleBasedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = authHelper.isAuthenticated()
  const userRole = authHelper.getCurrentRole()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}
