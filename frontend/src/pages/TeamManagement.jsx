import React, { useState } from 'react'
import { Plus, Edit2, Trash2, Users } from 'lucide-react'
import { mockTeams } from '../utils/mockData'

export const TeamManagement = () => {
  const [teams, setTeams] = useState(mockTeams)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    lead: '',
    members: ''
  })

  const handleAddTeam = () => {
    setSelectedTeam(null)
    setFormData({ name: '', lead: '', members: '' })
    setIsFormOpen(true)
  }

  const handleEditTeam = (team) => {
    setSelectedTeam(team)
    setFormData({
      name: team.name,
      lead: team.lead,
      members: team.members.join(', ')
    })
    setIsFormOpen(true)
  }

  const handleSaveTeam = () => {
    if (!formData.name || !formData.lead) {
      alert('Please fill in all required fields')
      return
    }

    const membersList = formData.members
      .split(',')
      .map(m => m.trim())
      .filter(m => m.length > 0)

    if (selectedTeam) {
      setTeams(teams.map(t =>
        t.id === selectedTeam.id
          ? {
              ...selectedTeam,
              name: formData.name,
              lead: formData.lead,
              members: membersList
            }
          : t
      ))
    } else {
      const newTeam = {
        id: Math.max(...teams.map(t => t.id), 0) + 1,
        name: formData.name,
        lead: formData.lead,
        members: membersList,
        assignedEquipment: []
      }
      setTeams([...teams, newTeam])
    }

    setIsFormOpen(false)
  }

  const handleDeleteTeam = (id) => {
    if (confirm('Are you sure you want to delete this team?')) {
      setTeams(teams.filter(t => t.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600 mt-2">Manage maintenance teams and members</p>
        </div>
        <button
          onClick={handleAddTeam}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          <span>Add Team</span>
        </button>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <div key={team.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition">
            {/* Team Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 rounded-lg p-3">
                  <Users size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{team.name}</h3>
                  <p className="text-sm text-gray-600">Lead: {team.lead}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditTeam(team)}
                  className="text-blue-600 hover:bg-blue-50 p-2 rounded transition"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDeleteTeam(team.id)}
                  className="text-red-600 hover:bg-red-50 p-2 rounded transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Members */}
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                  Members ({team.members.length})
                </p>
                <div className="space-y-1">
                  {team.members.map((member, idx) => (
                    <p key={idx} className="text-sm text-gray-700 flex items-center">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      {member}
                    </p>
                  ))}
                </div>
              </div>

              {/* Assigned Equipment */}
              {team.assignedEquipment.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                    Equipment ({team.assignedEquipment.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {team.assignedEquipment.map((eqId) => (
                      <span
                        key={eqId}
                        className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                      >
                        Equipment {eqId}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {teams.length === 0 && (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600 mb-4">No teams yet. Create your first team!</p>
          <button
            onClick={handleAddTeam}
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            <span>Add Team</span>
          </button>
        </div>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">
              {selectedTeam ? 'Edit Team' : 'Create Team'}
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Team Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Team Alpha"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Team Lead *</label>
              <input
                type="text"
                value={formData.lead}
                onChange={(e) => setFormData({ ...formData, lead: e.target.value })}
                placeholder="Team lead name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Members (comma separated)
              </label>
              <textarea
                value={formData.members}
                onChange={(e) => setFormData({ ...formData, members: e.target.value })}
                placeholder="John Doe, Jane Smith, Bob Johnson"
                rows="3"
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
                onClick={handleSaveTeam}
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
