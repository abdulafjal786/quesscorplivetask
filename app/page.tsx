
import { Metadata } from 'next'
import { Suspense } from 'react'
import EmployeeStats from '@/components/employees/EmployeeStats'

import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { Card } from '@/components/ui/Card'
import { Users, Calendar, Filter, Download } from 'lucide-react'
import EmployeesTableComponent from '@/components/employees/EmployeesTable'
import {Button} from '../components/ui/Button'
import { getEmployees } from '@/lib/api'
// import EmployeeDashboardClient from '@/components/employees/EmployeeDashboardClient'



export const metadata: Metadata = {
  title: 'Dashboard | Employee Management',
  description: 'Employee dashboard with search and filters',
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { data: employees, error } = await getEmployees()


  
  // Extract filter params from URL
  const searchQuery = typeof searchParams.search === 'string' ? searchParams.search : ''

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Dashboard</h1>
          <p className="text-gray-600">
            Manage, search, and filter all employees in your organization
          </p>
        </div>
        {/* <EmployeeDashboardClient searchParams={searchParams as { [key: string]: string | string[] | undefined }} /> */}
        
        <div className="flex items-center gap-3">
          <Button  className="gap-2">
            <Calendar className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Download Data
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{employees?.length || 0}</p>
              <p className="mt-1 text-sm text-green-600">+12% from last month</p>
            </div>
            <div className="rounded-lg bg-blue-500 p-3">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Today</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">42</p>
              <p className="mt-1 text-sm text-gray-500">85% attendance rate</p>
            </div>
            <div className="rounded-lg bg-green-500 p-3">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">On Leave</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">8</p>
              <p className="mt-1 text-sm text-yellow-600">2 scheduled returns</p>
            </div>
            <div className="rounded-lg bg-yellow-500 p-3">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New This Month</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">5</p>
              <p className="mt-1 text-sm text-blue-600">2 pending onboarding</p>
            </div>
            <div className="rounded-lg bg-purple-500 p-3">
              <Filter className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search & Filters Section */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Search & Filter Employees</h2>
          <p className="text-sm text-gray-600">
            Find employees by name, email, department, or hire date range
          </p>
        </div>
        
        {/* <SearchFilters 
          initialSearch={searchQuery}
          /> */}
      </Card>

      {/* Employees Table Section */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Employee Directory</h2>
          <p className="text-sm text-gray-600">
            View all employees with their contact information and details
          </p>
        
        </div>

        {error ? (
          <div className="text-center py-12">
            <div className="text-red-600 font-medium">Error loading employees</div>
            <p className="text-gray-600 mt-2">Please try again later</p>
          </div>
        ) : (
          <Suspense fallback={<LoadingSpinner fullScreen={false} />}>
            <EmployeesTableComponent 
              employees={employees || []}
              // searchParams={searchParams}
            />
          </Suspense>
        )}
      </Card>

      {/* Additional Stats */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h3>
          <EmployeeStats employees={employees || []} />
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {/* {employees?.slice(0, 4).map((employee) => (
              <div key={employee.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="font-medium text-gray-700">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{employee.name}</p>
                    <p className="text-sm text-gray-500">{employee.department}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  Hired {new Date(employee.hireDate).toLocaleDateString()}
                </span>
              </div>
            ))} */}
          </div>
        </Card>
      </div>
    </div>
  )
}

// 'use client'
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input";
// import { useState } from "react";
// // eslint-disable-next-line @next/next/no-async-client-component
// export default async function HomePage() {
//   // eslint-disable-next-line react-hooks/rules-of-hooks
//   const [email, setEmail] = useState("");
//   return (
//     <div>
//       <h1>Welcome to the Employee Management Dashboard</h1>
//       <Input label="email" placeholder="email"  value={email} helperText=""/>
//       <Button />
      
//     </div>
//   )
// }

