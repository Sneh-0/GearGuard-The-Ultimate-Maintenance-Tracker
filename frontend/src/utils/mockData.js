// Dummy data cleared. This module is intentionally empty to prevent accidental use.
export const mockUsers = {}
export const mockEquipment = []
export const mockMaintenanceRequests = []
export const mockTeams = []
export const authHelper = {
  login: () => ({ success: false, error: 'Mock auth disabled' }),
  logout: () => {},
  getCurrentUser: () => null,
  getCurrentRole: () => null,
  setUser: () => {},
  isAuthenticated: () => false
}
