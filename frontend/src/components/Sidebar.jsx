import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, X, LogOut } from 'lucide-react'
import { authHelper } from '../utils/mockData'

export const Navbar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const navigate = useNavigate()
  const user = authHelper.getCurrentUser()
  const role = authHelper.getCurrentRole()

  const handleLogout = () => {
    authHelper.logout()
    navigate('/login')
  }

  // Navigation items based on role
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', roles: ['Admin', 'Manager', 'Technician'] },
    { label: 'Equipment', path: '/equipment', roles: ['Admin', 'Manager'] },
    { label: 'Maintenance', path: '/maintenance', roles: ['Admin', 'Manager', 'Technician'] },
    { label: 'Kanban', path: '/kanban', roles: ['Admin', 'Manager', 'Technician'] },
    { label: 'Calendar', path: '/calendar', roles: ['Admin', 'Manager', 'Technician'] },
    { label: 'Team', path: '/team', roles: ['Admin', 'Manager'] },
    { label: 'Reports', path: '/reports', roles: ['Admin'] }
  ]

  const filteredItems = navItems.filter(item => item.roles.includes(role))

  const handleNavClick = (path) => {
    navigate(path)
    setIsMobileMenuOpen(false)
  }

  const isActive = (path) => {
    return window.location.pathname === path
  }

  return (
    <>
      {/* Top Navbar */}
      <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold">GearGuard</h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {filteredItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`px-4 py-2 rounded-lg transition text-sm font-medium ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <span className="text-sm text-gray-300">{user?.name}</span>
                <span className="text-xs bg-blue-600 px-2 py-1 rounded">{role}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white transition p-2"
                title="Logout"
              >
                <LogOut size={20} />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-300 hover:text-white"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 border-b border-gray-700">
          <div className="px-4 py-3 space-y-2">
            {filteredItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
