import React from 'react'
import { TrendingUp, AlertCircle, Clock, CheckCircle } from 'lucide-react'
import { mockEquipment, mockMaintenanceRequests } from '../utils/mockData'

export const Dashboard = () => {
  // Calculate KPIs
  const totalEquipment = mockEquipment.length
  const operationalEquipment = mockEquipment.filter(e => e.status === 'Operational').length
  const maintenanceRequests = mockMaintenanceRequests.length
  const newRequests = mockMaintenanceRequests.filter(r => r.status === 'New').length
  const overdueMaintenance = mockEquipment.filter(e => e.status === 'Overdue').length

  const kpis = [
    {
      title: 'Total Equipment',
      value: totalEquipment,
      icon: <AlertCircle className="text-blue-600" size={32} />,
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Operational',
      value: operationalEquipment,
      icon: <CheckCircle className="text-green-600" size={32} />,
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pending Requests',
      value: newRequests,
      icon: <Clock className="text-yellow-600" size={32} />,
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Overdue',
      value: overdueMaintenance,
      icon: <TrendingUp className="text-red-600" size={32} />,
      bgColor: 'bg-red-50'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to GearGuard - Your maintenance overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className={`${kpi.bgColor} rounded-lg p-6 border border-gray-200`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{kpi.value}</p>
              </div>
              {kpi.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Maintenance Requests */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Requests</h2>
          <div className="space-y-3">
            {mockMaintenanceRequests.slice(0, 4).map((request) => (
              <div
                key={request.id}
                className={`p-3 rounded-lg border-l-4 ${
                  request.status === 'New'
                    ? 'border-red-500 bg-red-50'
                    : request.status === 'In Progress'
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-green-500 bg-green-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{request.equipmentName}</p>
                    <p className="text-xs text-gray-600 mt-1">{request.description}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    request.priority === 'High'
                      ? 'bg-red-200 text-red-800'
                      : request.priority === 'Medium'
                      ? 'bg-yellow-200 text-yellow-800'
                      : 'bg-green-200 text-green-800'
                  }`}>
                    {request.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Equipment Status</h2>
          <div className="space-y-3">
            {mockEquipment.map((equipment) => (
              <div key={equipment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{equipment.name}</p>
                  <p className="text-xs text-gray-600">{equipment.type}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  equipment.status === 'Operational'
                    ? 'bg-green-100 text-green-800'
                    : equipment.status === 'Maintenance'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {equipment.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
