import React, { useState, useEffect } from 'react'
import { Plus, Eye, Edit2, Trash2 } from 'lucide-react'
import { api } from '../utils/api'

export const EquipmentManagement = () => {
  const [equipment, setEquipment] = useState([])
  const [selectedEquipment, setSelectedEquipment] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    location: '',
    maintenanceSchedule: 30
  })

  useEffect(() => {
    let mounted = true
    api.listEquipment()
      .then(data => { if (mounted) setEquipment(data) })
      .catch(() => { if (mounted) setEquipment([]) })
    return () => { mounted = false }
  }, [])

  const handleAddEquipment = () => {
    setSelectedEquipment(null)
    setFormData({ name: '', type: '', location: '', maintenanceSchedule: 30 })
    setIsFormOpen(true)
  }

  const handleEditEquipment = (eq) => {
    setSelectedEquipment(eq)
    setFormData(eq)
    setIsFormOpen(true)
  }

  const handleSaveEquipment = async () => {
    if (!formData.name || !formData.type || !formData.location) {
      alert('Please fill in all fields')
      return
    }
    try {
      if (selectedEquipment) {
        const updated = await api.updateEquipment(selectedEquipment.id, {
          ...selectedEquipment,
          ...formData,
          lastMaintenance: selectedEquipment.lastMaintenance || new Date().toISOString().split('T')[0],
          status: selectedEquipment.status || 'Operational'
        })
        setEquipment(equipment.map(eq => eq.id === updated.id ? updated : eq))
      } else {
        const created = await api.createEquipment(formData)
        setEquipment([...equipment, created])
      }
      setIsFormOpen(false)
    } catch (e) {
      alert('Failed to save equipment')
    }
  }

  const handleDeleteEquipment = async (id) => {
    if (confirm('Are you sure you want to delete this equipment?')) {
      try {
        await api.deleteEquipment(id)
        setEquipment(equipment.filter(eq => eq.id !== id))
      } catch (e) {
        alert('Failed to delete equipment')
      }
    }
  }

  const getStatusBadge = (status) => {
    const statusStyles = {
      'Operational': 'bg-green-100 text-green-800',
      'Maintenance': 'bg-yellow-100 text-yellow-800',
      'Overdue': 'bg-red-100 text-red-800',
      'Unoperational': 'bg-red-100 text-red-800'
    }
    return statusStyles[status] || 'bg-gray-100 text-gray-800'
  }

  const handleStatusChange = async (eq, newStatus) => {
    try {
      const updated = await api.updateEquipment(eq.id, { ...eq, status: newStatus })
      setEquipment(prev => prev.map(e => (e.id === updated.id ? updated : e)))
    } catch (e) {
      alert('Failed to update status')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipment Management</h1>
          <p className="text-gray-600 mt-2">Manage and track all equipment</p>
        </div>
        <button
          onClick={handleAddEquipment}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          <span>Add Equipment</span>
        </button>
      </div>

      {/* Equipment Table - Desktop */}
      <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Location</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Last Maintenance</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Schedule</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {equipment.map((eq) => (
              <tr key={eq.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{eq.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{eq.type}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{eq.location}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusBadge(eq.status)}`}>
                      {eq.status}
                    </span>
                    <select
                      value={eq.status === 'Operational' ? 'Operational' : 'Unoperational'}
                      onChange={(e) => handleStatusChange(eq, e.target.value)}
                      className="text-xs px-2 py-1 border border-gray-300 rounded"
                    >
                      <option value="Operational">Operational</option>
                      <option value="Unoperational">Unoperational</option>
                    </select>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{eq.lastMaintenance}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{eq.maintenanceSchedule} days</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => handleEditEquipment(eq)}
                    className="inline-flex items-center space-x-1 text-blue-600 hover:bg-blue-50 px-2 py-1 rounded"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteEquipment(eq.id)}
                    className="inline-flex items-center space-x-1 text-red-600 hover:bg-red-50 px-2 py-1 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Equipment Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {equipment.map((eq) => (
          <div key={eq.id} className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{eq.name}</h3>
                <p className="text-xs text-gray-600">{eq.type}</p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusBadge(eq.status)}`}>
                {eq.status}
              </span>
            </div>
            <p className="text-sm text-gray-600">{eq.location}</p>
            <p className="text-xs text-gray-500">Last: {eq.lastMaintenance} | Every {eq.maintenanceSchedule} days</p>
            <div className="flex space-x-2 pt-2">
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">Status</label>
                <select
                  value={eq.status === 'Operational' ? 'Operational' : 'Unoperational'}
                  onChange={(e) => handleStatusChange(eq, e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="Operational">Operational</option>
                  <option value="Unoperational">Unoperational</option>
                </select>
              </div>
              <button
                onClick={() => handleEditEquipment(eq)}
                className="flex-1 text-sm px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteEquipment(eq.id)}
                className="flex-1 text-sm px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">
              {selectedEquipment ? 'Edit Equipment' : 'Add Equipment'}
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <input
                type="text"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maintenance Schedule (days)
              </label>
              <input
                type="number"
                value={formData.maintenanceSchedule}
                onChange={(e) => setFormData({ ...formData, maintenanceSchedule: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setIsFormOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEquipment}
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
