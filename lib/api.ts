import { Employee, ApiResponse, ApiSearchEmployee } from './types'

const API_BASE_URL = process.env.DJANGO_API_URL
// const API_BASE_URL = 'http://127.0.0.1:8000'

// Map API response to your Employee type
interface ApiEmployee {
  id: number
  user: number
  employee_id: string
  full_name: string
  email: string
  department: string
  phone?: string
  position?: string
  hire_date?: string
  salary?: number
  status?: string
}

// Convert API response to your Employee type
function mapApiEmployeeToEmployee(apiEmployee: ApiEmployee): Employee {
  return {
    id: apiEmployee.employee_id,
    name: apiEmployee.full_name,
    email: apiEmployee.email,
    phone: apiEmployee.phone || '',
    department: apiEmployee.department,
    position: apiEmployee.position || '',
    hireDate: apiEmployee.hire_date || new Date().toISOString().split('T')[0],
    salary: apiEmployee.salary || 0,
    status: (apiEmployee.status || 'active') as 'active' | 'inactive',
    employee_id: apiEmployee.employee_id,
  }
}

export async function getEmployees(): Promise<ApiResponse<Employee[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/employee/employees/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
      throw new Error(`Failed to fetch employees: ${response.status} ${response.statusText}`)
    }

    const apiEmployees: ApiEmployee[] = await response.json()
    
    // Map API response to your Employee type
    const employees: Employee[] = apiEmployees.map(mapApiEmployeeToEmployee)
    
    return { 
      data: employees,
      message: 'Employees loaded successfully'
    }
    
  } catch (error) {
    console.error('Error fetching employees:', error)
    
    // Fallback to mock data if API fails
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using mock data due to API error')
      return { 
        data: getMockEmployees(),
        error: 'Using mock data - API unavailable'
      }
    }
    
    return { 
      error: error instanceof Error ? error.message : 'Failed to load employees' 
    }
  }
}

// Mock data fallback
function getMockEmployees(): Employee[] {
  return [
    {
      id: 'EMP001',
      name: 'John Smith',
      email: 'john.smith@company.com',
      phone: '+1 (555) 123-4567',
      department: 'Engineering',
      position: 'Senior Software Engineer',
      hireDate: '2022-03-15',
      salary: 125000,
      status: 'active',
    },
    {
      id: 'EMP002',
      name: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      phone: '+1 (555) 234-5678',
      department: 'Marketing',
      position: 'Marketing Director',
      hireDate: '2020-08-22',
      salary: 95000,
      status: 'active',
    },
  ]
}

// Get single employee by employee_id (not Django ID)
export async function getEmployee(id: string): Promise<ApiResponse<Employee>> {
  try {
    // Search for employee by employee_id
    const response = await fetch(
      `${API_BASE_URL}/employee/employees/search/?search=${encodeURIComponent(id)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch employee: ${response.status}`)
    }

    const data: ApiSearchEmployee[] = await response.json()
    
    const apiEmployee = data.find(emp => emp.employee_id === id)
    
    if (!apiEmployee) {
      throw new Error(`Employee with ID ${id} not found`)
    }

    const employee: Employee = mapSearchEmployeeToEmployee(apiEmployee)
    
    return { 
      data: employee,
      message: 'Employee loaded successfully'
    }
    
  } catch (error) {
    console.error('Error fetching employee:', error)
    return { 
      error: error instanceof Error ? error.message : 'Failed to load employee' 
    }
  }
}

export async function createEmployee(data: {
  employee_id: string
  full_name: string
  email: string
  department: string
  phone?: string
  position?: string
  hire_date?: string
  salary?: number
  status?: string
}): Promise<ApiResponse<Employee>> {
  try {
    const response = await fetch(`${API_BASE_URL}/employee/employees/add/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Create employee error:', errorData)
      throw new Error(errorData.message || errorData.detail || 'Failed to create employee')
    }

    const apiEmployee: ApiSearchEmployee = await response.json()
    const employee: Employee = mapSearchEmployeeToEmployee(apiEmployee)
    
    return { 
      data: employee,
      message: 'Employee created successfully'
    }
    
  } catch (error) {
    console.error('Error creating employee:', error)
    return { 
      error: error instanceof Error ? error.message : 'Failed to create employee',
      data: undefined
    }
  }
}

export async function updateEmployee(id: string, data: Partial<Employee>): Promise<ApiResponse<Employee>> {
  try {
    const response = await fetch(`${API_BASE_URL}/employee/employees/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        employee_id: data.employee_id,
        full_name: data.name,
        email: data.email,
        department: data.department,
        phone: data.phone,
        position: data.position,
        hire_date: data.hireDate,
        salary: data.salary,
        status: data.status,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to update employee')
    }

    const apiEmployee: ApiEmployee = await response.json()
    const employee: Employee = mapApiEmployeeToEmployee(apiEmployee)
    
    return { 
      data: employee,
      message: 'Employee updated successfully'
    }
    
  } catch (error) {
    console.error('Error updating employee:', error)
    return { 
      error: error instanceof Error ? error.message : 'Failed to update employee' 
    }
  }
}

export async function deleteEmployee(id: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/employee/employees/delete/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to delete employee')
    }

    return { 
      message: 'Employee deleted successfully'
    }
    
  } catch (error) {
    console.error('Error deleting employee:', error)
    return { 
      error: error instanceof Error ? error.message : 'Failed to delete employee' 
    }
  }
}

function mapSearchEmployeeToEmployee(apiEmployee: ApiSearchEmployee): Employee {
  return {
    id: apiEmployee.employee_id || apiEmployee.id.toString(),
    name: apiEmployee.full_name,
    email: apiEmployee.email,
    phone: apiEmployee.phone || '',
    department: apiEmployee.department,
    position: apiEmployee.position || '',
    hireDate: apiEmployee.hire_date || '',
    salary: apiEmployee.salary || 0,
    status: apiEmployee.status || 'active',
    employee_id: apiEmployee.employee_id,
    user_id: apiEmployee.user,
  }
}

export async function searchEmployees(searchQuery: string): Promise<ApiResponse<Employee[]>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/employee/employees/search/?search=${encodeURIComponent(searchQuery)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Search API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
      throw new Error(`Search failed: ${response.status} ${response.statusText}`)
    }

    const data: ApiSearchEmployee[] = await response.json()
    
    // Map the API response to Employee format
    const employees: Employee[] = Array.isArray(data) 
      ? data.map(mapSearchEmployeeToEmployee)
      : []
    
    return { 
      data: employees,
      message: 'Search completed successfully'
    }
    
  } catch (error) {
    console.error('Error searching employees:', error)
    return { 
      error: error instanceof Error ? error.message : 'Failed to search employees',
      data: []
    }
  }
}

export interface AttendanceData {
  employee: string;  // This should be the employee ID (as string)
  date: string;
  status: 'present' | 'absent';
}

export async function markAttendance(data: AttendanceData): Promise<ApiResponse<string>> {
  try {
    const response = await fetch(`${API_BASE_URL}/employee/attendance/mark/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    })

    console.log('Response status:', response.status)
    
    if (!response.ok) {
      let errorMessage = 'Failed to mark attendance'
      try {
        const errorData = await response.json()
        console.log('Error response:', errorData)
        
        if (typeof errorData === 'object') {
          if (errorData.detail) {
            errorMessage = errorData.detail
          } else if (errorData.message) {
            errorMessage = errorData.message
          } else if (errorData.error) {
            errorMessage = errorData.error
          } else {
            for (const [key, value] of Object.entries(errorData)) {
              if (Array.isArray(value) && value.length > 0) {
                errorMessage = `${key}: ${value[0]}`
                break
              }
            }
          }
        }
      } catch (parseError) {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`
      }
      
      throw new Error(errorMessage)
    }

    const result = await response.json()
    console.log('Success response:', result)
    return { data: result }
  } catch (error) {
    console.error('Error marking attendance:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to mark attendance',
    }
  }
}

export interface AttendanceRecord {
  id: number;
  employee: number;  
  date: string;      // Date string in YYYY-MM-DD format
  status: 'present' | 'absent';
}

export async function getAttendanceByDate(date?: string): Promise<ApiResponse<AttendanceRecord[]>> {
  try {
    let url = `${API_BASE_URL}/employee/attendance/`
    if (date) {
      url += `?date=${date}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Failed to fetch attendance records')
    }

    const records: AttendanceRecord[] = await response.json()
    console.log('Fetched attendance records:', records)
    return { data: records }
  } catch (error) {
    console.error('Error fetching attendance:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to fetch attendance',
    }
  }
}

// Also export getAttendanceRecords as an alias for getAttendanceByDate
export const getAttendanceRecords = getAttendanceByDate

// Get employee attendance history
export async function getEmployeeAttendance(employeeId: string, startDate?: string, endDate?: string): Promise<ApiResponse<AttendanceRecord[]>> {
  try {
    let url = `${API_BASE_URL}/employee/attendance/employee/${employeeId}/`
    
    const params = new URLSearchParams()
    if (startDate) params.append('start_date', startDate)
    if (endDate) params.append('end_date', endDate)
    
    const queryString = params.toString()
    if (queryString) {
      url += `?${queryString}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch employee attendance')
    }

    const records: AttendanceRecord[] = await response.json()
    return { data: records }
  } catch (error) {
    console.error('Error fetching employee attendance:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to fetch employee attendance',
    }
  }
}