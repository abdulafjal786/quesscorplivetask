'use client'

import { useState } from 'react'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
  MoreVertical
} from 'lucide-react'
import {Button} from '@/components/ui/Button'

interface AttendanceRecord {
  id: string
  name: string
  date: string
  checkIn: string
  checkOut: string
  status: 'present' | 'absent' | 'late' | 'half-day' | 'leave'
  hours: number
}

interface AttendanceTableProps {
  attendance: AttendanceRecord[]
}

export default function AttendanceTable({ attendance }: AttendanceTableProps) {
  const [sortField, setSortField] = useState<'name' | 'date' | 'hours'>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const sortedAttendance = [...attendance].sort((a, b) => {
    const aValue: string | number = a[sortField]
    const bValue: string | number = b[sortField]

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'absent':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'late':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'half-day':
        return <AlertCircle className="h-5 w-5 text-blue-500" />
      case 'leave':
        return <Calendar className="h-5 w-5 text-purple-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      present: 'bg-green-100 text-green-800',
      absent: 'bg-red-100 text-red-800',
      late: 'bg-yellow-100 text-yellow-800',
      'half-day': 'bg-blue-100 text-blue-800',
      leave: 'bg-purple-100 text-purple-800'
    }
    
    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </span>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Employee
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Check In
            </th>
            <th className="px6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Check Out
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hours
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedAttendance.map((record) => (
            <tr key={record.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="font-medium text-gray-700">
                      {record.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {record.name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {new Date(record.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`text-sm font-medium ${record.checkIn !== '-' ? 'text-gray-900' : 'text-gray-400'}`}>
                  {record.checkIn}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`text-sm font-medium ${record.checkOut !== '-' ? 'text-gray-900' : 'text-gray-400'}`}>
                  {record.checkOut}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {record.hours.toFixed(1)} hrs
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(record.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Summary */}
      <div className="bg-gray-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Total Records: <span className="font-medium">{attendance.length}</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-green-600">
              Present: {attendance.filter(a => a.status === 'present').length}
            </span>
            <span className="text-red-600">
              Absent: {attendance.filter(a => a.status === 'absent').length}
            </span>
            <span className="text-yellow-600">
              Late: {attendance.filter(a => a.status === 'late').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}