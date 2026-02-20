export interface Employee {
  id: string
  name: string
  email: string
  phone: string
  department: string
  position: string
  hireDate: string
  salary: number
  status: 'active' | 'inactive'
  avatar?: string
  // Add fields from your API
  user_id?: number
  full_name?: string
  employee_id?: string
}

export interface Department {
  id: string
  name: string
  manager: string
  employeeCount: number
  budget: number
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
  total?: number
  page?: number
  limit?: number
}

// API-specific types
export interface ApiEmployee {
  id: number
  user: number
  employee_id: string
  full_name: string
  email: string
  department: string
  // Add other fields if your API provides them
  phone?: string
  position?: string
  hire_date?: string
  salary?: number
  status?: 'active' | 'inactive'
}

export interface CreateEmployeeDto {
  employee_id: string
  full_name: string
  email: string
  department: string
  phone?: string
  position?: string
  hire_date?: string
  salary?: number
  status?: 'active' | 'inactive'
}



export interface ApiSearchEmployee {
  id: number
  user: number
  employee_id: string
  full_name: string
  email: string
  department: string
  // Add other fields if your API returns them
  phone?: string
  position?: string
  hire_date?: string
  salary?: number
  status?: 'active' | 'inactive'
}