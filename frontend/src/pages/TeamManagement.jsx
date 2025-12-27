import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Users } from 'lucide-react'
import { api } from '../utils/api'

export const TeamManagement = () => {
  const [teams, setTeams] = useState([])
  useEffect(() => { api.listTeams().then(setTeams).catch(() => setTeams([])) }, [])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    lead: '',
    members: []
  })
    const [techOptions, setTechOptions] = useState([])
    useEffect(() => { api.listTechnicians().then(setTechOptions).catch(() => setTechOptions([])) }, [])

  const handleAddTeam = () => {
    setSelectedTeam(null)
    setFormData({ name: '', lead: '', members: [] })
    setIsFormOpen(true)
  }

  const handleEditTeam = (team) => {
    setSelectedTeam(team)
      // team.members comes as [{email, name}] from backend; map to emails for editing
      const emails = (team.members || []).map(m => (typeof m === 'string' ? m : m.email)).filter(Boolean)
      setFormData({ name: team.name, lead: team.lead, members: emails })
    setIsFormOpen(true)
  }

  const handleSaveTeam = async () => {
    if (!formData.name || !formData.lead) {
      alert('Please fill in all required fields')
      return
    }

    try {
      if (selectedTeam) {
        const updated = await api.updateTeam(selectedTeam.id, {
          name: formData.name,
          lead: formData.lead,
          members: formData.members
        })
          // Refetch to get member names hydrated
          const fresh = await api.listTeams()
          setTeams(fresh)
      } else {
        const created = await api.createTeam({
          name: formData.name,
          lead: formData.lead,
          members: formData.members
        })
          const fresh = await api.listTeams()
          setTeams(fresh)
      }
      setIsFormOpen(false)
    } catch (e) {
      alert('Failed to save team')
    }
  }

  const handleDeleteTeam = async (id) => {
    if (!confirm('Are you sure you want to delete this team?')) return
    try {
      await api.deleteTeam(id)
      setTeams(teams.filter(t => t.id !== id))
    } catch (e) {
      alert('Failed to delete team')
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
                        {member.name ? `${member.name} (${member.email})` : member.email}
                      </p>
                    ))}
                </div>
              </div>

              {/* Assigned Equipment */}
              {Array.isArray(team.assignedEquipment) && team.assignedEquipment.length > 0 && (
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
                Members
              </label>
              <div className="space-y-2">
                {(formData.members || []).map((member, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                      <select
                        value={member}
                        onChange={(e) => {
                          const next = [...formData.members]
                          next[idx] = e.target.value
                          setFormData({ ...formData, members: next })
                        }}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="">Select technician...</option>
                        {techOptions.map(t => (
                          <option key={t.email} value={t.email}>{t.name} ({t.email})</option>
                        ))}
                      </select>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, members: formData.members.filter((_, i) => i !== idx) })}
                      className="px-3 py-2 text-red-600 border border-red-200 rounded hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, members: [...(formData.members || []), ''] })}
                  className="px-3 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200"
                >
                  + Add Member
                </button>
              </div>
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
