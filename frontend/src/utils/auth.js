import { api } from './api'

export const authHelper = {
  login: async (email, password) => {
    try {
      const res = await api.login(email, password)
      return res
    } catch (e) {
      return { success: false, error: 'Invalid email or password' }
    }
  },
  register: async (email, password, name, role) => {
    try {
      const res = await api.register(email, password, name, role)
      return res
    } catch (e) {
      return { success: false, error: 'Registration failed' }
    }
  },
  logout: () => {
    localStorage.removeItem('user')
    localStorage.removeItem('role')
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },
  getCurrentRole: () => {
    return localStorage.getItem('role') || null
  },
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('role', user.role)
  },
  isAuthenticated: () => {
    return localStorage.getItem('user') !== null
  }
}
