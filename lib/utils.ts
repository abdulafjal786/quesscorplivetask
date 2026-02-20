import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format date
export function formatDate(date: Date | string, format: string = 'MMM dd, yyyy'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  if (format === 'relative') {
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return `${Math.floor(diffInDays / 30)} months ago`
  }
  
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Generate initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Debounce function
// export function debounce<T extends (...args: any[]) => any>(
//   func: T,
//   wait: number
// ): (...args: Parameters<T>) => void {
//   let timeout: NodeJS.Timeout
  
//   return (...args: Parameters<T>) => {
//     clearTimeout(timeout)
//     timeout = setTimeout(() => func(...args), wait)
//   }
// }

// Capitalize first letter
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Check if value is empty
// export function isEmpty(value: any): boolean {
//   if (value === null || value === undefined) return true
//   if (typeof value === 'string' && value.trim() === '') return true
//   if (Array.isArray(value) && value.length === 0) return true
//   if (typeof value === 'object' && Object.keys(value).length === 0) return true
//   return false
// }

// Parse API error
// export function parseApiError(error: any): string {
//   if (typeof error === 'string') return error
//   if (error?.message) return error.message
//   if (error?.error) return error.error
//   return 'An unexpected error occurred'
// }

// Validate email
export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Validate phone number (basic)
export function validatePhone(phone: string): boolean {
  const re = /^[\+]?[1-9][\d]{0,15}$/
  return re.test(phone.replace(/[\s\-\(\)]/g, ''))
}