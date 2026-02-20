'use client'

import { useEffect, useState, Suspense } from 'react'
import { Employee } from '../../lib/types'
import { 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  Phone, 
  Building2,
  Calendar,
  MoreVertical,
  Eye,
  Edit,
  User,
  Trash2,
  CalendarCheck
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { format } from 'date-fns'
import Link from 'next/link'
import { deleteEmployee, searchEmployees } from '@/lib/api'
import { useSearchParams } from 'next/navigation'
import AddEmployeeModal from './AddEmployeeModal'
import AttendanceModal from '../attendance/AttendanceModal'
import React from 'react'

interface EmployeesTableProps {
  employees: Employee[]
  searchParams: {[key: string]: string | string[] | undefined}
}

type SortField = 'name' | 'email' | 'department' | 'hireDate' | 'salary'
type SortDirection = 'asc' | 'desc'

// Create a separate component for the content that uses useSearchParams
function EmployeesTableContent({ employees, searchParams }: EmployeesTableProps) {
  const searchParam = useSearchParams()
  const searchQuery = searchParam.get('search') || ''
  
  const [displayEmployees, setDisplayEmployees] = useState<Employee[]>(employees)
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false)
  const [selectedEmployeeForAttendance, setSelectedEmployeeForAttendance] = useState<Employee | null>(null)

  // Handle search when URL changes
  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.trim()) {
        setIsSearching(true)
        try {
          const result = await searchEmployees(searchQuery)
          setDisplayEmployees(result.data || [])
        } catch (error) {
          console.error('Search error:', error)
          setDisplayEmployees([])
        } finally {
          setIsSearching(false)
        }
      } else {
        setDisplayEmployees(employees)
      }
    }

    handleSearch()
  }, [searchQuery, employees])

  // Sort employees based on current sort field and direction
  const sortedEmployees = [...displayEmployees].sort((a, b) => {
    let aValue: string | number | Date
    let bValue: string | number | Date

    switch (sortField) {
      case 'name':
        aValue = a.name?.toLowerCase() || ''
        bValue = b.name?.toLowerCase() || ''
        break
      case 'email':
        aValue = a.email?.toLowerCase() || ''
        bValue = b.email?.toLowerCase() || ''
        break
      case 'department':
        aValue = a.department?.toLowerCase() || ''
        bValue = b.department?.toLowerCase() || ''
        break
      case 'hireDate':
        aValue = a.hireDate ? new Date(a.hireDate).getTime() : 0
        bValue = b.hireDate ? new Date(b.hireDate).getTime() : 0
        break
      case 'salary':
        aValue = a.salary || 0
        bValue = b.salary || 0
        break
      default:
        aValue = ''
        bValue = ''
    }

    if (sortDirection === 'asc') {
      if (aValue < bValue) return -1
      if (aValue > bValue) return 1
      return 0
    } else {
      if (aValue > bValue) return -1
      if (aValue < bValue) return 1
      return 0
    }
  })

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4 ml-1" /> : 
      <ChevronDown className="h-4 w-4 ml-1" />
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      default: 'bg-gray-100 text-gray-800'
    }
    
    const badgeStatus = status || 'default'
    
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[badgeStatus as keyof typeof styles] || styles.default}`}>
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Active'}
      </span>
    )
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return
    
    setIsDeleting(id)
    try {
      const result = await deleteEmployee(id)
      if (result.error) {
        alert(`Error deleting employee: ${result.error}`)
      } else {
        alert('Employee deleted successfully')
        window.location.reload()
      }
    } catch (error) {
      alert('Error deleting employee')
      console.error(error)
    } finally {
      setIsDeleting(null)
    }
  }

  const getInitials = (name: string) => {
    if (!name) return '??'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleOpenAttendanceModal = (employee: Employee, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedEmployeeForAttendance(employee)
    setAttendanceModalOpen(true)
  }

  const handleAddSuccess = () => {
    window.location.reload()
  }

  const handleAttendanceSuccess = () => {
    window.location.reload()
  }

  // Loading state
  if (isSearching) {
    return (
      <div className="text-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-primary-600 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600">Searching employees...</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsAddModalOpen(true)}>
          Add Employee
        </Button>
      </div>
      
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center">
                Employee
                <SortIcon field="name" />
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('email')}
            >
              <div className="flex items-center">
                Email
                <SortIcon field="email" />
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('department')}
            >
              <div className="flex items-center">
                Department
                <SortIcon field="department" />
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Employee ID
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Attandence
            </th>
          </tr>
        </thead>
        
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedEmployees.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center">
                <div className="text-gray-500">
                  <User className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p className="font-medium">No employees found</p>
                  <p className="text-sm mt-1">
                    {searchQuery ? `No results for "${searchQuery}"` : 'Try adjusting your search filters'}
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            sortedEmployees.map((employee) => (
              <React.Fragment key={employee.id}>
                {/* Main row */}
                <tr 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setExpandedRow(expandedRow === employee.id ? null : employee.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="font-medium text-gray-700">
                          {getInitials(employee.name)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.position || 'No position specified'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {employee.email}
                      </div>
                      {employee.phone && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          {employee.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-sm text-gray-900">{employee.department}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">
                      {employee.employee_id || employee.id}
                    </div>
                    {employee.hireDate && (
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(employee.hireDate), 'MMM dd, yyyy')}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(employee.status || 'active')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        asChild
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      >
                        <Link href={`/employees/${employee.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        asChild
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      >
                        <Link href={`/employees/${employee.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation()
                          handleDelete(employee.id, employee.name)
                        }}
                        disabled={isDeleting === employee.id}
                      >
                        {isDeleting === employee.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-red-500" />
                        )}
                      </Button>
                     
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation()
                          setExpandedRow(expandedRow === employee.id ? null : employee.id)
                        }}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center"> <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation()
                          handleOpenAttendanceModal(employee, e)
                        }}
                        title="Mark Attendance"
                      >
                        <CalendarCheck className="h-4 w-4 text-blue-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
                
                {/* Expanded Details Row */}
                {expandedRow === employee.id && (
                  <tr className="bg-blue-50">
                    <td colSpan={6} className="px-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Employee Details</h4>
                          <div className="space-y-2">
                            <div className="text-sm">
                              <span className="text-gray-600">Position:</span>{' '}
                              <span className="font-medium">{employee.position || 'Not specified'}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-600">Department:</span>{' '}
                              <span className="font-medium">{employee.department}</span>
                            </div>
                            {employee.hireDate && (
                              <div className="text-sm">
                                <span className="text-gray-600">Hire Date:</span>{' '}
                                <span className="font-medium">
                                  {format(new Date(employee.hireDate), 'MMMM dd, yyyy')}
                                </span>
                              </div>
                            )}
                            {employee.salary > 0 && (
                              <div className="text-sm">
                                <span className="text-gray-600">Salary:</span>{' '}
                                <span className="font-medium">
                                  ${employee.salary.toLocaleString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Contact Information</h4>
                          <div className="space-y-2">
                            <div className="text-sm">
                              <span className="text-gray-600">Email:</span>{' '}
                              <a href={`mailto:${employee.email}`} className="text-primary-600 hover:underline">
                                {employee.email}
                              </a>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-600">Phone:</span>{' '}
                              <span className="font-medium">{employee.phone || 'Not provided'}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-600">Employee ID:</span>{' '}
                              <span className="font-medium">{employee.employee_id || employee.id}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Quick Actions</h4>
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" asChild>
                              <Link href={`/attendance?employee=${employee.id}`}>
                                View Attendance
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/employees/${employee.id}/edit`}>
                                Edit Details
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/employees/${employee.id}`}>
                                View Profile
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
      
      {/* Pagination */}
      {sortedEmployees.length > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{' '}
            <span className="font-medium">{sortedEmployees.length}</span> of{' '}
            <span className="font-medium">{sortedEmployees.length}</span> results
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Modals - place them OUTSIDE the table */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
      
      <AttendanceModal
        isOpen={attendanceModalOpen}
        onClose={() => setAttendanceModalOpen(false)}
        onSuccess={handleAttendanceSuccess}
        employee={selectedEmployeeForAttendance ? {
          id: selectedEmployeeForAttendance.id,
          name: selectedEmployeeForAttendance.name,
          employee: selectedEmployeeForAttendance.id,
        } : undefined}
      />
    </div>
  )
}

// Main export with Suspense wrapper
export default function EmployeesTable(props: EmployeesTableProps) {
  return (
    <Suspense fallback={<div>Loading table...</div>}>
      <EmployeesTableContent {...props} />
    </Suspense>
  )
}