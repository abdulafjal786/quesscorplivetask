'use client'

import { Users, TrendingUp, UserCheck, UserX } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { useEffect, useState } from 'react'
import { getAttendanceRecords, getEmployees } from '../../lib/api'

interface AttendanceRecord {
  employee_name: string
  id: number
  employee: number | string
  date: string
  status: 'present' | 'absent'
}

interface Stats {
  present_today: number
  absent_today: number
  total_employees: number
  marked_today: number
  pending_today: number
  attendance_rate: string
}

export default function AttendanceStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [attendanceRows, setAttendanceRows] = useState<AttendanceRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const attendanceResult = await getAttendanceRecords()
        const employeesResult = await getEmployees()

        if (attendanceResult?.error || employeesResult?.error) {
          setError(
            attendanceResult?.error ||
              employeesResult?.error ||
              'Failed to load data'
          )
          return
        }

        const attendanceData: AttendanceRecord[] =
          (attendanceResult?.data || []) as AttendanceRecord[]
        const employeesData = employeesResult?.data || []

        setAttendanceRows(attendanceData)

        const presentToday = attendanceData.filter(
          (r) => r.status === 'present'
        ).length

        const absentToday = attendanceData.filter(
          (r) => r.status === 'absent'
        ).length

        const totalEmployees = employeesData.length
        const markedToday = presentToday + absentToday
        const pendingToday = Math.max(totalEmployees - markedToday, 0)

        const attendanceRate =
          totalEmployees > 0
            ? `${((presentToday / totalEmployees) * 100).toFixed(1)}%`
            : '0%'

        setStats({
          present_today: presentToday,
          absent_today: absentToday,
          total_employees: totalEmployees,
          marked_today: markedToday,
          pending_today: pendingToday,
          attendance_rate: attendanceRate,
        })
      } catch (err) {
        console.error(err)
        setError('Failed to load attendance statistics')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  /* ---------------- Loading State ---------------- */
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </Card>
        ))}
      </div>
    )
  }

  /* ---------------- Error State ---------------- */
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">{error}</p>
      </div>
    )
  }

  /* ---------------- Stats Cards ---------------- */
  const statItems = [
    {
      title: 'Present Today',
      value: stats?.present_today ?? 0,
      change: `${stats?.marked_today ?? 0} of ${
        stats?.total_employees ?? 0
      } marked`,
      icon: UserCheck,
      color: 'bg-green-500',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Absent Today',
      value: stats?.absent_today ?? 0,
      change: `${stats?.pending_today ?? 0} pending attendance`,
      icon: UserX,
      color: 'bg-red-500',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Total Employees',
      value: stats?.total_employees ?? 0,
      change: `${stats?.present_today ?? 0} present, ${
        stats?.absent_today ?? 0
      } absent`,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Attendance Rate',
      value: stats?.attendance_rate ?? '0%',
      change: "Today's overall rate",
      icon: TrendingUp,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-700',
      bgColor: 'bg-yellow-50',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statItems.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className={`p-6 ${stat.bgColor}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${stat.textColor}`}>
                    {stat.title}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className={`mt-1 text-sm ${stat.textColor}`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`${stat.color} rounded-lg p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Attendance Table */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Today’s Attendance</h2>

        {attendanceRows.length === 0 ? (
          <p className="text-gray-500">No attendance records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Employee
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {attendanceRows.map((row) => (
                  <tr key={row.id} className="border-t">
                    <td className="px-4 py-2 text-sm">{row.employee_name}</td>
                    <td className="px-4 py-2 text-sm">{row.date}</td>
                    <td className="px-4 py-2 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          row.status === 'present'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
