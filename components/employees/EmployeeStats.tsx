'use client'

import { Employee } from '@/lib/types'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { useState } from 'react'

interface EmployeeStatsProps {
  employees: Employee[]
}

export default function EmployeeStats({ employees }: EmployeeStatsProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  // Calculate department distribution
  console.log(employees,"emp")
  const departmentData = employees.reduce((acc: Record<string, number>, employee) => {
    acc[employee.department] = (acc[employee.department] || 0) + 1
    return acc
  }, {})

  const pieData = Object.entries(departmentData).map(([name, value]) => ({
    name,
    value,
  }))

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

  // Calculate active vs inactive
  const activeCount = employees.filter(e => e.status === 'active').length
  const inactiveCount = employees.filter(e => e.status === 'inactive').length

  // Calculate average salary
  const avgSalary = employees.length > 0 
    ? employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length
    : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900">Active Employees</h4>
          <p className="text-2xl font-bold text-blue-700 mt-2">{activeCount}</p>
          <p className="text-sm text-blue-600">
            {((activeCount / employees.length) * 100 || 0).toFixed(1)}% of total
          </p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-green-900">Average Salary</h4>
          <p className="text-2xl font-bold text-green-700 mt-2">
            ${avgSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className="text-sm text-green-600">Monthly average</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-purple-900">Departments</h4>
          <p className="text-2xl font-bold text-purple-700 mt-2">{Object.keys(departmentData).length}</p>
          <p className="text-sm text-purple-600">Active departments</p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              // activeIndex={activeIndex}
              onMouseEnter={(_, index) => setActiveIndex(index)}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Department List */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Employees by Department</h4>
        {pieData.map((dept, index) => (
          <div key={dept.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="h-3 w-3 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm text-gray-700">{dept.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-900">{dept.value}</span>
              <span className="text-xs text-gray-500">
                ({((dept.value / employees.length) * 100 || 0).toFixed(1)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}