// components/attendance/AttendanceModal.tsx
'use client';

import { useState } from 'react';
import { X, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { markAttendance } from '../../lib/api';
import { format } from 'date-fns';

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  employee?: {
    id: string;
    name: string;
    employee: string;
  };
  date?: Date; // Optional specific date, defaults to today
}

export default function AttendanceModal({
  isOpen,
  onClose,
  onSuccess,
  employee,
  date = new Date(),
}: AttendanceModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [status, setStatus] = useState<'present' | 'absent'>('present');

  const statusOptions = [
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' },
  ];

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!employee) {
    setError('No employee selected');
    return;
  }

  setIsSubmitting(true);
  setError('');
  setSuccess('');

  try {
    // Try sending as "employee" field (not "employee_id")
    const attendanceData = {
      employee: employee.employee, // Change from employee_id to employee
      date: format(date, 'yyyy-MM-dd'),
      status: status,
    };

    console.log('Sending data to API:', attendanceData);

    const result = await markAttendance(attendanceData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess('Attendance marked successfully!');

      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 1500);
    }
  } catch (err) {
    setError('Failed to mark attendance. Please try again.');
    console.error(err);
  } finally {
    setIsSubmitting(false);
  }
}
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Mark Attendance</h2>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{format(date, 'MMMM dd, yyyy')}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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

          {employee && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{employee.name}</div>
                  <div className="text-sm text-gray-500">Employee ID: {employee.employee}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Date: {format(date, 'EEEE, MMMM dd, yyyy')}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Attendance Status *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStatus(option.value as 'present' | 'absent')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    status === option.value
                      ? option.value === 'present'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-lg font-semibold">{option.label}</div>
                  <div className="text-sm mt-1 opacity-75">
                    {option.value === 'present' 
                      ? 'Employee is present today'
                      : 'Employee is absent today'
                    }
                  </div>
                </button>
              ))}
            </div>
          </div>

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
              className="min-w-[120px]"
            >
              {isSubmitting ? 'Marking...' : 'Mark Attendance'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}