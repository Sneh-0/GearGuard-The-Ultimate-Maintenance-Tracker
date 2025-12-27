import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from './components/Sidebar'
import { ProtectedRoute, RoleBasedRoute } from './components/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { ForgotPassword } from './pages/ForgotPassword'
import { ResetPassword } from './pages/ResetPassword'
import { Dashboard } from './pages/Dashboard'
import { EquipmentManagement } from './pages/EquipmentManagement'
import { MaintenanceRequests } from './pages/MaintenanceRequests'
import { KanbanBoard } from './pages/KanbanBoard'
import { CalendarView } from './pages/CalendarView'
import { TeamManagement } from './pages/TeamManagement'
import { Reports } from './pages/Reports'
import { authHelper } from './utils/auth'

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check authentication on mount
    const authenticated = authHelper.isAuthenticated()
    setIsAuthenticated(authenticated)

    // Listen for storage changes (logout from another tab or this tab)
    const handleStorageChange = () => {
      const authenticated = authHelper.isAuthenticated()
      setIsAuthenticated(authenticated)
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Also check auth status when component updates
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authHelper.isAuthenticated()
      setIsAuthenticated(authenticated)
    }

    // Check auth status frequently
    const interval = setInterval(checkAuth, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <Router>
      {isAuthenticated && authHelper.isAuthenticated() ? (
        <div className="flex flex-col h-screen">
          {/* Navbar */}
          <Navbar isMobileMenuOpen={mobileMenuOpen} setIsMobileMenuOpen={setMobileMenuOpen} />

          {/* Main Content */}
          <main className="flex-1 overflow-auto bg-gray-50">
            <div className="max-w-7xl mx-auto p-4 md:p-8">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route
                  path="/equipment"
                  element={
                    <RoleBasedRoute allowedRoles={['Admin', 'Manager']}>
                      <EquipmentManagement />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/maintenance"
                  element={
                    <ProtectedRoute>
                      <MaintenanceRequests />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/kanban"
                  element={
                    <ProtectedRoute>
                      <KanbanBoard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/calendar"
                  element={
                    <ProtectedRoute>
                      <CalendarView />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/team"
                  element={
                    <RoleBasedRoute allowedRoles={['Admin', 'Manager']}>
                      <TeamManagement />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <RoleBasedRoute allowedRoles={['Admin']}>
                      <Reports />
                    </RoleBasedRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </Router>
  )
}
