import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { api } from '../utils/api'
import { authHelper } from '../utils/auth'
import { format, startOfToday, isBefore } from 'date-fns'

export const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 27))
  const [scheduledRequests, setScheduledRequests] = useState([])
  const [equipmentOptions, setEquipmentOptions] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [scheduleForm, setScheduleForm] = useState({ equipmentId: '', description: '', priority: 'Medium', requestType: 'Preventive', assignedTeamId: '' })
  const [teamOptions, setTeamOptions] = useState([])
  const role = authHelper.getCurrentRole()

  useEffect(() => {
    Promise.all([api.listRequests(), api.listEquipment(), api.listTeams()])
      .then(([reqs, eq, teams]) => {
        setScheduledRequests(reqs.filter(r => !!r.scheduledDate))
        setEquipmentOptions(eq)
        setTeamOptions(teams)
      })
      .catch(() => {
        setScheduledRequests([])
        setEquipmentOptions([])
        setTeamOptions([])
      })
  }, [])

  const getRequestsForDate = (date) => {
    return scheduledRequests.filter(r => r.scheduledDate === format(date, 'yyyy-MM-dd'))
  }

  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  const startDate = new Date(monthStart)
  startDate.setDate(startDate.getDate() - startDate.getDay())

  const days = []
  let current = new Date(startDate)
  while (current <= monthEnd) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  const weeks = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const isToday = (date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  const handleScheduleMaintenance = (date) => {
    const todayStart = startOfToday()
    if (isBefore(date, todayStart)) {
      alert('You cannot schedule maintenance for past dates.')
      return
    }
    if (role === 'Technician') {
      alert('Technicians cannot add requests through calendar.')
      return
    }
    setSelectedDate(date)
    setScheduleForm({ equipmentId: '', description: '', priority: 'Medium', requestType: 'Preventive', assignedTeamId: '' })
    setIsModalOpen(true)
  }

  const handleSubmitSchedule = async () => {
    if (!scheduleForm.equipmentId) {
      alert('Please select equipment')
      return
    }
    const eq = equipmentOptions.find(e => e.id === scheduleForm.equipmentId)
    if (!eq) {
      alert('Selected equipment not found')
      return
    }
    const todayStart = startOfToday()
    if (isBefore(selectedDate, todayStart)) {
      alert('Selected date is in the past. Choose a future date.')
      return
    }
    const user = authHelper.getCurrentUser()
    const scheduledDateStr = format(selectedDate, 'yyyy-MM-dd')
    const newRequest = {
      equipmentId: eq.id,
      equipmentName: eq.name,
      requestType: scheduleForm.requestType || 'Preventive',
      status: 'New',
      priority: scheduleForm.priority || 'Medium',
      description: scheduleForm.description || `${scheduleForm.requestType || 'Preventive'} maintenance scheduled for ${scheduledDateStr}`,
      requestedBy: user?.name || 'Current User',
      createdDate: format(new Date(), 'yyyy-MM-dd'),
      dueDate: scheduledDateStr,
      scheduledDate: scheduledDateStr
    }
    if (scheduleForm.assignedTeamId && role !== 'Technician') {
      const team = teamOptions.find(t => t.id === scheduleForm.assignedTeamId)
      if (team) {
        newRequest.assignedTeamId = team.id
        newRequest.assignedTeamName = team.name
      }
    }
    try {
      const created = await api.createRequest(newRequest)
      setScheduledRequests(prev => [created, ...prev])
      setIsModalOpen(false)
    } catch (e) {
      alert('Failed to schedule maintenance')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Maintenance Calendar</h1>
        <p className="text-gray-600 mt-2">View and schedule preventive maintenance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-semibold text-gray-600 py-2 text-sm">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {weeks.map((week, weekIdx) => (
              week.map((date, dayIdx) => {
                const hasEvents = getRequestsForDate(date).length > 0
                const isCurrent = isCurrentMonth(date)

                return (
                  <div
                    key={`${weekIdx}-${dayIdx}`}
                    onClick={() => {
                      const todayStart = startOfToday()
                      if (!isCurrent || isBefore(date, todayStart)) return
                      handleScheduleMaintenance(date)
                    }}
                    className={`aspect-square p-2 rounded-lg border-2 flex flex-col justify-start cursor-pointer transition ${
                      isToday(date)
                        ? 'border-blue-500 bg-blue-50'
                        : hasEvents
                        ? 'border-green-500 bg-green-50'
                        : isCurrent
                        ? (isBefore(date, startOfToday()) ? 'border-gray-200 bg-gray-50 cursor-not-allowed' : 'border-gray-200 hover:border-gray-300')
                        : 'border-gray-100 bg-gray-50'
                    } ${!isCurrent ? 'opacity-50' : ''}`}
                  >
                    <p className={`text-sm font-semibold ${
                      isToday(date)
                        ? 'text-blue-600'
                        : isCurrent
                        ? 'text-gray-900'
                        : 'text-gray-600'
                    }`}>
                      {format(date, 'd')}
                    </p>
                    {hasEvents && (
                      <div className="mt-1 flex-1 overflow-hidden">
                        {getRequestsForDate(date).map((req) => (
                          <div
                            key={req.id}
                            className="text-xs bg-green-200 text-green-800 px-1 py-0.5 rounded mb-0.5 truncate"
                            title={req.equipmentName}
                          >
                            {req.equipmentName}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })
            ))}
          </div>
        </div>

        {/* Sidebar - Upcoming Events */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Scheduled Maintenance</h3>
            {scheduledRequests.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {scheduledRequests
                  .filter(r => r.scheduledDate)
                  .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
                  .map((request) => (
                    <div
                      key={request.id}
                      className="bg-green-50 border border-green-200 rounded-lg p-3"
                    >
                      <p className="font-semibold text-gray-900 text-sm">{request.equipmentName}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Scheduled: <strong>{request.scheduledDate}</strong>
                      </p>
                      <p className="text-xs text-gray-600">
                        Status: <strong>{request.status}</strong>
                      </p>
                      {request.requestType && (
                        <p className="text-xs text-gray-600">
                          Type: <strong>{request.requestType}</strong>
                        </p>
                      )}
                      {request.assignedTeamName && (
                        <p className="text-xs text-gray-600">
                          Team: <strong>{request.assignedTeamName}</strong>
                        </p>
                      )}
                      {request.priority && (
                        <p className="text-xs text-gray-600">
                          Priority: <strong>{request.priority}</strong>
                        </p>
                      )}
                      
                      <div className="mt-2 flex justify-end">
                        {role !== 'Technician' && (
                          <button
                            onClick={async () => {
                              try {
                                await api.deleteRequest(request.id)
                                setScheduledRequests(prev => prev.filter(r => r.id !== request.id))
                              } catch (e) {
                                alert('Failed to remove scheduled request')
                              }
                            }}
                            className="text-xs px-2 py-1 border border-red-300 text-red-700 rounded hover:bg-red-50 transition"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">No scheduled maintenance</p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Click on a date to schedule maintenance for that day
            </p>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Schedule Maintenance</h2>
            <p className="text-sm text-gray-600">Date: {selectedDate ? format(selectedDate, 'MMMM dd, yyyy') : ''}</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Equipment *</label>
              <select
                value={scheduleForm.equipmentId}
                onChange={(e) => setScheduleForm({ ...scheduleForm, equipmentId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select equipment...</option>
                {equipmentOptions.map(eq => (
                  <option key={eq.id} value={eq.id}>{eq.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={scheduleForm.requestType}
                onChange={(e) => setScheduleForm({ ...scheduleForm, requestType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Preventive">Preventive</option>
                <option value="Corrective">Corrective</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={scheduleForm.priority}
                onChange={(e) => setScheduleForm({ ...scheduleForm, priority: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {['Low','Medium','High'].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assign Team</label>
              <select
                value={scheduleForm.assignedTeamId}
                onChange={(e) => setScheduleForm({ ...scheduleForm, assignedTeamId: e.target.value })}
                disabled={role === 'Technician'}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
              >
                <option value="">Select team...</option>
                {teamOptions.map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
              {role === 'Technician' && (
                <p className="text-xs text-gray-500 mt-1">Technicians cannot assign teams.</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={scheduleForm.description}
                onChange={(e) => setScheduleForm({ ...scheduleForm, description: e.target.value })}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Optional details for this maintenance"
              />
            </div>
            
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitSchedule}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
