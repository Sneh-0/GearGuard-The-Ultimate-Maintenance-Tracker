// Mock authentication data
export const mockUsers = {
  'admin@gearguard.com': {
    email: 'admin@gearguard.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'Admin'
  },
  'manager@gearguard.com': {
    email: 'manager@gearguard.com',
    password: 'manager123',
    name: 'Manager User',
    role: 'Manager'
  },
  'tech@gearguard.com': {
    email: 'tech@gearguard.com',
    password: 'tech123',
    name: 'Technician User',
    role: 'Technician'
  }
}

// Mock equipment data
export const mockEquipment = [
  {
    id: 1,
    name: 'CNC Machine A',
    type: 'CNC',
    location: 'Building A, Floor 2',
    lastMaintenance: '2025-12-15',
    status: 'Operational',
    maintenanceSchedule: 30
  },
  {
    id: 2,
    name: 'Hydraulic Press B',
    type: 'Hydraulic',
    location: 'Building B, Floor 1',
    lastMaintenance: '2025-12-10',
    status: 'Maintenance',
    maintenanceSchedule: 20
  },
  {
    id: 3,
    name: 'Conveyor Belt C',
    type: 'Conveyor',
    location: 'Building A, Floor 1',
    lastMaintenance: '2025-12-05',
    status: 'Operational',
    maintenanceSchedule: 60
  },
  {
    id: 4,
    name: 'Laser Cutter D',
    type: 'Laser',
    location: 'Building C, Floor 1',
    lastMaintenance: '2025-11-25',
    status: 'Overdue',
    maintenanceSchedule: 40
  },
  {
    id: 5,
    name: 'Welding Robot E',
    type: 'Robotic',
    location: 'Building D, Floor 2',
    lastMaintenance: '2025-12-12',
    status: 'Operational',
    maintenanceSchedule: 45
  }
]

// Mock maintenance requests data
export const mockMaintenanceRequests = [
  {
    id: 101,
    equipmentId: 1,
    equipmentName: 'CNC Machine A',
    requestType: 'Corrective',
    status: 'New',
    priority: 'High',
    description: 'Machine producing inaccurate cuts',
    requestedBy: 'John Doe',
    assignedTo: 'Tech 1',
    createdDate: '2025-12-26',
    dueDate: '2025-12-27',
    scheduledDate: null
  },
  {
    id: 102,
    equipmentId: 2,
    equipmentName: 'Hydraulic Press B',
    requestType: 'Preventive',
    status: 'In Progress',
    priority: 'Medium',
    description: 'Scheduled maintenance check',
    requestedBy: 'Manager User',
    assignedTo: 'Tech 2',
    createdDate: '2025-12-20',
    dueDate: '2025-12-28',
    scheduledDate: '2025-12-27'
  },
  {
    id: 103,
    equipmentId: 3,
    equipmentName: 'Conveyor Belt C',
    requestType: 'Corrective',
    status: 'Repaired',
    priority: 'Low',
    description: 'Belt alignment issue',
    requestedBy: 'Jane Smith',
    assignedTo: 'Tech 3',
    createdDate: '2025-12-10',
    dueDate: '2025-12-25',
    scheduledDate: '2025-12-24'
  },
  {
    id: 104,
    equipmentId: 4,
    equipmentName: 'Laser Cutter D',
    requestType: 'Preventive',
    status: 'New',
    priority: 'High',
    description: 'Overdue maintenance - laser calibration',
    requestedBy: 'System',
    assignedTo: null,
    createdDate: '2025-12-15',
    dueDate: '2025-12-20',
    scheduledDate: null
  },
  {
    id: 105,
    equipmentId: 5,
    equipmentName: 'Welding Robot E',
    requestType: 'Preventive',
    status: 'Repaired',
    priority: 'Medium',
    description: 'Joint inspection and lubrication',
    requestedBy: 'Manager User',
    assignedTo: 'Tech 1',
    createdDate: '2025-12-05',
    dueDate: '2025-12-22',
    scheduledDate: '2025-12-21'
  }
]

// Mock teams data
export const mockTeams = [
  {
    id: 1,
    name: 'Team Alpha',
    lead: 'Tech 1',
    members: ['tech@gearguard.com', 'Technician 2', 'Technician 3'],
    assignedEquipment: [1, 2]
  },
  {
    id: 2,
    name: 'Team Beta',
    lead: 'Tech 2',
    members: ['Technician 4', 'Technician 5', 'Technician 6'],
    assignedEquipment: [3, 4, 5]
  }
]

// Authentication helper functions
export const authHelper = {
  login: (email, password) => {
    const user = mockUsers[email]
    if (user && user.password === password) {
      return {
        success: true,
        user: {
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    }
    return {
      success: false,
      error: 'Invalid email or password'
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
