const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

async function http(method, path, body) {
  const role = localStorage.getItem('role') || undefined
  const headers = { 'Content-Type': 'application/json' }
  if (role) headers['X-User-Role'] = role
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `HTTP ${res.status}`)
  }
  const contentType = res.headers.get('content-type') || ''
  return contentType.includes('application/json') ? res.json() : res.text()
}

export const api = {
  health: () => http('GET', '/health'),
  // Auth
  login: (email, password) => http('POST', '/auth/login', { email, password }),
  register: (email, password, name, role) => http('POST', '/auth/register', { email, password, name, role }),
  forgotPassword: (email) => http('POST', '/auth/forgot', { email }),
  resetPassword: (token, password) => http('POST', '/auth/reset', { token, password }),
  // Equipment
  listEquipment: () => http('GET', '/equipment'),
  createEquipment: (data) => http('POST', '/equipment', data),
  updateEquipment: (id, data) => http('PUT', `/equipment/${id}`, data),
  deleteEquipment: (id) => http('DELETE', `/equipment/${id}`),
  // Maintenance
  listRequests: () => http('GET', '/maintenance-requests'),
  createRequest: (data) => http('POST', '/maintenance-requests', data),
  updateRequest: (id, data) => http('PATCH', `/maintenance-requests/${id}`, data),
  deleteRequest: (id) => http('DELETE', `/maintenance-requests/${id}`),
  // Teams
  listTeams: () => http('GET', '/teams'),
  createTeam: (data) => http('POST', '/teams', data),
  updateTeam: (id, data) => http('PUT', `/teams/${id}`, data),
  deleteTeam: (id) => http('DELETE', `/teams/${id}`),
  // Users
  listTechnicians: () => http('GET', '/users/technicians'),
  // Calendar
  listEvents: () => http('GET', '/calendar/events'),
  // Reports
  summary: () => http('GET', '/reports/summary'),
}
