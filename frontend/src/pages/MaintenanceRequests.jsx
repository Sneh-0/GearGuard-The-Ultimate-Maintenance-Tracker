import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Eye } from 'lucide-react'
import { api } from '../utils/api'
import { authHelper } from '../utils/auth'

export const MaintenanceRequests = () => {
  const [requests, setRequests] = useState([])
  const [equipmentOptions, setEquipmentOptions] = useState([])
  const [teamOptions, setTeamOptions] = useState([])
  const currentUser = authHelper.getCurrentUser()
  const isTechnician = (currentUser?.role === 'Technician')
    useEffect(() => {
      let mounted = true
      Promise.all([api.listRequests(), api.listEquipment(), api.listTeams()])
        .then(([reqs, eq, teams]) => {
          if (mounted) {
            setRequests(reqs)
            setEquipmentOptions(eq)
            setTeamOptions(teams)
          }
        })
        .catch(() => { if (mounted) setRequests([]) })
      return () => { mounted = false }
    }, [])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [formData, setFormData] = useState({
    equipmentId: '',
    requestType: 'Corrective',
    priority: 'Medium',
    description: '',
    scheduledDate: '',
    assignedTeamId: ''
  })

  const handleAddRequest = () => {
    setSelectedRequest(null)
    setFormData({
      equipmentId: '',
      requestType: 'Corrective',
      priority: 'Medium',
      description: '',
      scheduledDate: '',
      assignedTeamId: ''
    })
    setIsFormOpen(true)
  }

  const handleEditRequest = (req) => {
    setSelectedRequest(req)
    setFormData({
      equipmentId: req.equipmentId,
      requestType: req.requestType,
      priority: req.priority,
      description: req.description,
      scheduledDate: req.scheduledDate || '',
      assignedTeamId: req.assignedTeamId || ''
    })
    setIsFormOpen(true)
  }

  const handleSaveRequest = async () => {
    if (!formData.equipmentId || !formData.description) {
      alert('Please fill in all required fields')
      return
    }

    const equipment = equipmentOptions.find(e => e.id === formData.equipmentId)

    if (selectedRequest) {
      try {
        const updated = await api.updateRequest(selectedRequest.id, {
          equipmentId: formData.equipmentId,
          equipmentName: equipment.name,
          requestType: formData.requestType,
          priority: formData.priority,
          description: formData.description,
          scheduledDate: formData.scheduledDate || null,
          assignedTeamId: formData.assignedTeamId || null,
          assignedTeamName: formData.assignedTeamId ? (teamOptions.find(t => t.id === formData.assignedTeamId)?.name || null) : null
        })
        setRequests(requests.map(req => req.id === updated.id ? updated : req))
      } catch (e) {
        alert('Failed to save request changes')
        return
      }
    } else {
      const newRequest = {
        equipmentId: formData.equipmentId,
        equipmentName: equipment.name,
        requestType: formData.requestType,
        status: 'New',
        priority: formData.priority,
        description: formData.description,
        requestedBy: 'Current User',
        assignedTeamId: formData.assignedTeamId || null,
        assignedTeamName: formData.assignedTeamId ? (teamOptions.find(t => t.id === formData.assignedTeamId)?.name || null) : null,
        createdDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        scheduledDate: formData.scheduledDate || null
      }
      try {
        const created = await api.createRequest(newRequest)
        setRequests([...requests, created])
      } catch (e) {
        alert('Failed to create request')
        return
      }
    }

    setIsFormOpen(false)
  }

  const getPriorityColor = (priority) => {
    const colors = {
      'High': 'bg-red-100 text-red-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-green-100 text-green-800'
    }
    return colors[priority] || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status) => {
    const colors = {
      'New': 'bg-blue-100 text-blue-800 border-l-4 border-blue-500',
      'In Progress': 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500',
      'Repaired': 'bg-green-100 text-green-800 border-l-4 border-green-500',
      'Scrap': 'bg-red-100 text-red-800 border-l-4 border-red-500'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maintenance Requests</h1>
          <p className="text-gray-600 mt-2">Create and manage maintenance tasks</p>
        </div>
        <button
          onClick={handleAddRequest}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          <span>New Request</span>
        </button>
      </div>

      {/* Requests Table - Desktop */}
      <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Equipment</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Priority</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Due Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Team</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requests.map((req) => (
              <tr key={req.id} className={`hover:bg-gray-50 transition ${getStatusColor(req.status)}`}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{req.equipmentName}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{req.requestType}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(req.status)}`}>
                    {req.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getPriorityColor(req.priority)}`}>
                    {req.priority}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{req.dueDate}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{req.assignedTeamName || '-'}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => handleEditRequest(req)}
                    className="inline-flex items-center text-blue-600 hover:bg-blue-50 px-2 py-1 rounded"
                  >
                    <Edit2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Requests Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {requests.map((req) => (
          <div key={req.id} className={`rounded-lg p-4 space-y-3 ${getStatusColor(req.status)}`}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{req.equipmentName}</h3>
                <p className="text-xs text-gray-600">{req.requestType}</p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getPriorityColor(req.priority)}`}>
                {req.priority}
              </span>
            </div>
            <p className="text-sm text-gray-700">{req.description}</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <p>Status: <strong>{req.status}</strong></p>
              <p>Due: <strong>{req.dueDate}</strong></p>
              <p>Team: <strong>{req.assignedTeamName || '-'}</strong></p>
            </div>
            <button
              onClick={() => handleEditRequest(req)}
              className="w-full text-sm px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4 my-8">
            <h2 className="text-xl font-bold text-gray-900">
              {selectedRequest ? 'Edit Request' : 'Create Request'}
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Equipment *</label>
              <select
                value={formData.equipmentId}
                onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select equipment...</option>
                {equipmentOptions.map((eq) => (
                  <option key={eq.id} value={eq.id}>{eq.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Request Type</label>
              <select
                value={formData.requestType}
                onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option>Corrective</option>
                <option>Preventive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Date</label>
              <input
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assign Team</label>
              <select
                value={formData.assignedTeamId}
                onChange={(e) => setFormData({ ...formData, assignedTeamId: isTechnician ? '' : e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                disabled={isTechnician}
              >
                <option value="">Select team...</option>
                {teamOptions.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              {isTechnician && (
                <p className="text-xs text-gray-500 mt-1">Technicians cannot assign teams. Ask a Manager/Admin.</p>
              )}
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setIsFormOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRequest}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
