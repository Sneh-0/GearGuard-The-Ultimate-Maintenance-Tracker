import React, { useEffect, useState } from 'react'
import { BarChart, PieChart, TrendingUp, Calendar } from 'lucide-react'
import { api } from '../utils/api'

export const Reports = () => {
  const [requests, setRequests] = useState([])
  const [equipment, setEquipment] = useState([])
  useEffect(() => {
    Promise.all([api.listRequests(), api.listEquipment()])
      .then(([reqs, eq]) => { setRequests(reqs); setEquipment(eq) })
      .catch(() => {})
  }, [])
  // Calculate statistics
  const totalRequests = requests.length
  const completedRequests = requests.filter(r => r.status === 'Repaired').length
  const pendingRequests = requests.filter(r => ['New', 'In Progress'].includes(r.status)).length
  
  const preventiveCount = requests.filter(r => r.requestType === 'Preventive').length
  const correctiveCount = requests.filter(r => r.requestType === 'Corrective').length

  const highPriority = requests.filter(r => r.priority === 'High').length
  const mediumPriority = requests.filter(r => r.priority === 'Medium').length
  const lowPriority = requests.filter(r => r.priority === 'Low').length

  const operationalEquipment = equipment.filter(e => e.status === 'Operational').length
  const maintenanceEquipment = equipment.filter(e => e.status === 'Maintenance').length
  const overdueEquipment = equipment.filter(e => e.status === 'Overdue').length

  const stats = [
    {
      title: 'Total Requests',
      value: totalRequests,
      icon: <BarChart className="text-blue-600" size={32} />,
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Completed',
      value: completedRequests,
      icon: <TrendingUp className="text-green-600" size={32} />,
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pending',
      value: pendingRequests,
      icon: <Calendar className="text-yellow-600" size={32} />,
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Operational Equipment',
      value: operationalEquipment,
      icon: <PieChart className="text-purple-600" size={32} />,
      bgColor: 'bg-purple-50'
    }
  ]

  const completionRate = Math.round((completedRequests / totalRequests) * 100) || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-2">Maintenance analytics and statistics</p>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`${stat.bgColor} rounded-lg p-6 border border-gray-200`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Type Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Request Type Distribution</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-700">Preventive</p>
                <span className="text-sm font-bold text-gray-900">{preventiveCount} ({Math.round(preventiveCount/totalRequests*100)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(preventiveCount / totalRequests) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-700">Corrective</p>
                <span className="text-sm font-bold text-gray-900">{correctiveCount} ({Math.round(correctiveCount/totalRequests*100)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-600 h-2 rounded-full"
                  style={{ width: `${(correctiveCount / totalRequests) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Priority Distribution</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-700">High</p>
                <span className="text-sm font-bold text-gray-900">{highPriority} ({Math.round(highPriority/totalRequests*100)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{ width: `${(highPriority / totalRequests) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-700">Medium</p>
                <span className="text-sm font-bold text-gray-900">{mediumPriority} ({Math.round(mediumPriority/totalRequests*100)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-600 h-2 rounded-full"
                  style={{ width: `${(mediumPriority / totalRequests) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-700">Low</p>
                <span className="text-sm font-bold text-gray-900">{lowPriority} ({Math.round(lowPriority/totalRequests*100)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${(lowPriority / totalRequests) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Equipment Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Equipment Status</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-700">Operational</p>
                <span className="text-sm font-bold text-gray-900">{operationalEquipment}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${(operationalEquipment / (equipment.length || 1)) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-700">Under Maintenance</p>
                <span className="text-sm font-bold text-gray-900">{maintenanceEquipment}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-600 h-2 rounded-full"
                  style={{ width: `${(maintenanceEquipment / (equipment.length || 1)) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-700">Overdue</p>
                <span className="text-sm font-bold text-gray-900">{overdueEquipment}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{ width: `${(overdueEquipment / (equipment.length || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Completion Rate</h2>
          <div className="flex items-center justify-center h-40">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="8"
                    strokeDasharray={`${(completionRate / 100) * 339.29} 339.29`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-3xl font-bold text-gray-900">{completionRate}%</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                {completedRequests} of {totalRequests} requests completed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Requests Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Requests</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Equipment</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Priority</th>
              </tr>
            </thead>
            <tbody>
              {requests.slice(0, 5).map((req) => (
                <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-medium">{req.equipmentName}</td>
                  <td className="py-3 px-4 text-gray-600">{req.requestType}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      req.status === 'New'
                        ? 'bg-blue-100 text-blue-800'
                        : req.status === 'In Progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      req.priority === 'High'
                        ? 'bg-red-100 text-red-800'
                        : req.priority === 'Medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {req.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
