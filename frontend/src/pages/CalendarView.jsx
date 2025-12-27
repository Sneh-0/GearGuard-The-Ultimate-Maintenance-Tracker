import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { mockMaintenanceRequests } from '../utils/mockData'
import { format, getDate, getDaysInMonth, getDay } from 'date-fns'

export const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 27))

  // Get only preventive requests
  const preventiveRequests = mockMaintenanceRequests.filter(r => r.requestType === 'Preventive')

  const getRequestsForDate = (date) => {
    return preventiveRequests.filter(r => r.scheduledDate === format(date, 'yyyy-MM-dd'))
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
    alert(`Schedule maintenance for ${format(date, 'MMMM dd, yyyy')}`)
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
                    onClick={() => isCurrent && handleScheduleMaintenance(date)}
                    className={`aspect-square p-2 rounded-lg border-2 flex flex-col justify-start cursor-pointer transition ${
                      isToday(date)
                        ? 'border-blue-500 bg-blue-50'
                        : hasEvents
                        ? 'border-green-500 bg-green-50'
                        : isCurrent
                        ? 'border-gray-200 hover:border-gray-300'
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
            {preventiveRequests.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {preventiveRequests
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
    </div>
  )
}
