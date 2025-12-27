import React, { useState, useEffect } from 'react'
import { GripVertical } from 'lucide-react'
import { api } from '../utils/api'

export const KanbanBoard = () => {
  const [requests, setRequests] = useState([])
  useEffect(() => {
    api.listRequests().then(setRequests).catch(() => setRequests([]))
  }, [])
  const [draggedItem, setDraggedItem] = useState(null)

  const columns = ['New', 'In Progress', 'Repaired', 'Scrap']

  const getRequestsByStatus = (status) => {
    return requests.filter(r => r.status === status)
  }

  const handleDragStart = (request, sourceStatus) => {
    setDraggedItem({ request, sourceStatus })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = async (targetStatus) => {
    if (!draggedItem) return
    const { request } = draggedItem
    // Optimistic UI update
    setRequests(prev => prev.map(req => req.id === request.id ? { ...req, status: targetStatus } : req))
    setDraggedItem(null)
    // Persist to backend
    try {
      const updated = await api.updateRequest(request.id, { status: targetStatus })
      setRequests(prev => prev.map(req => req.id === updated.id ? updated : req))
    } catch (e) {
      // Revert on failure
      setRequests(prev => prev.map(req => req.id === request.id ? { ...req, status: request.status } : req))
      alert('Failed to update status')
    }
  }

  const getPriorityColor = (priority) => {
    const colors = {
      'High': 'border-red-500',
      'Medium': 'border-yellow-500',
      'Low': 'border-green-500'
    }
    return colors[priority] || 'border-gray-500'
  }

  const isOverdue = (request) => {
    return new Date(request.dueDate) < new Date() && request.status !== 'Repaired'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
        <p className="text-gray-600 mt-2">Drag and drop requests to update status</p>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((status) => (
          <div
            key={status}
            className="bg-gray-100 rounded-lg p-4 min-h-96"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(status)}
          >
            {/* Column Header */}
            <div className="mb-4">
              <h2 className="font-bold text-gray-900">{status}</h2>
              <p className="text-sm text-gray-600">
                {getRequestsByStatus(status).length} items
              </p>
            </div>

            {/* Cards Container */}
            <div className="space-y-3">
              {getRequestsByStatus(status).map((request) => (
                <div
                  key={request.id}
                  draggable
                  onDragStart={() => handleDragStart(request, status)}
                  className={`kanban-card border-l-4 ${getPriorityColor(request.priority)} ${
                    isOverdue(request) ? 'overdue ring-2 ring-red-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-2 mb-2">
                    <GripVertical size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{request.equipmentName}</h3>
                      <p className="text-xs text-gray-600">{request.requestType}</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-700 mb-3 line-clamp-2">{request.description}</p>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className={`font-semibold px-2 py-1 rounded-full ${
                        request.priority === 'High'
                          ? 'bg-red-200 text-red-800'
                          : request.priority === 'Medium'
                          ? 'bg-yellow-200 text-yellow-800'
                          : 'bg-green-200 text-green-800'
                      }`}>
                        {request.priority}
                      </span>
                    </div>

                    <div className="text-gray-600">
                      <p>Due: <strong>{request.dueDate}</strong></p>
                      {isOverdue(request) && (
                        <p className="text-red-600 font-semibold">OVERDUE</p>
                      )}
                    </div>

                    {request.assignedTo && (
                      <p className="text-gray-600">Assigned: <strong>{request.assignedTo}</strong></p>
                    )}
                  </div>
                </div>
              ))}

              {getRequestsByStatus(status).length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm">No requests</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
