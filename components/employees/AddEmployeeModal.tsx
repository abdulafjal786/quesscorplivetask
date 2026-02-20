'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { createEmployee } from '@/lib/api'

interface AddEmployeeModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function AddEmployeeModal({ isOpen, onClose, onSuccess }: AddEmployeeModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    salary: '',
    status: 'active' as 'active' | 'inactive'
  })

  const departments = [
    { value: 'engineering', label: 'Engineering' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' },
    { value: 'cse', label: 'Computer Science' },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const result = await createEmployee({
        employee_id: formData.employee_id,
        full_name: formData.full_name,
        email: formData.email,
        department: formData.department
      })

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess('Employee added successfully!')
        // Reset form
        setFormData({
          employee_id: '',
          full_name: '',
          email: '',
          phone: '',
          department: '',
          position: '',
          salary: '',
          status: 'active'
        })
        
        // Call success callback after delay
        setTimeout(() => {
          onClose()
          if (onSuccess) onSuccess()
        }, 1500)
      }
    } catch (err) {
      setError('Failed to add employee. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Add New Employee</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          <Input
            label="Employee ID *"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            required
            placeholder="EMP001"
          />

          <Input
            label="Full Name *"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            placeholder="John Doe"
          />

          <Input
            label="Email *"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="john@company.com"
          />

          <Input
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Department"
          />

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Employee'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}