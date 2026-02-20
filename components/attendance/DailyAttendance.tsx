// components/attendance/DailyAttendance.tsx
'use client';

import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
// import  getAttendanceByDate  from '../../lib/api';
import AttendanceModal from './AttendanceModal';
import { Employee } from '@/lib/types';

interface DailyAttendanceProps {
  employees: Employee[];
  date?: Date;
}

interface AttendanceRecord {
  id: number;
  employee: number; // This is the employee ID
  date: string;
  status: 'present' | 'absent';
}

export default function DailyAttendance({ employees, date = new Date() }: DailyAttendanceProps) {
  const [selectedDate, setSelectedDate] = useState(format(date, 'yyyy-MM-dd'));
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

//   const fetchAttendance = async () => {
//     setIsLoading(true);
//     try {
//       const result = await getAttendanceByDate(selectedDate);
//       if (result?.data && Array.isArray(result.data)) {
//         // Only set AttendanceRecord[]
//         const attendanceData = result.data.filter(
//           (item: any): item is AttendanceRecord =>
//             typeof item === 'object' &&
//             typeof item.employee === 'number' &&
//             typeof item.date === 'string' &&
//             (item.status === 'present' || item.status === 'absent')
//         );
//         setAttendanceRecords(attendanceData);
//       } else {
//         setAttendanceRecords([]);
//       }
//     } catch (error) {
//       console.error('Error fetching attendance:', error);
//       setAttendanceRecords([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAttendance();
//   }, [selectedDate]);

  // Get attendance status for a specific employee
  const getAttendanceStatus = (employeeId: string) => {
    const employeeIdNum = parseInt(employeeId);
    const record = attendanceRecords.find((r) => r.employee === employeeIdNum);
    return record?.status || 'not-marked';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'absent':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present': return 'Present';
      case 'absent': return 'Absent';
      default: return 'Not Marked';
    }
  };

  const handleMarkAttendance = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

//   const handleSuccess = () => {
//     fetchAttendance(); // Refresh data
//   };

  // Get the attendance record for an employee
  const getAttendanceRecord = (employeeId: string) => {
    const employeeIdNum = parseInt(employeeId);
    return attendanceRecords.find((r) => r.employee === employeeIdNum);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Daily Attendance - {format(parseISO(selectedDate), 'MMMM dd, yyyy')}
            </h2>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="text-sm text-gray-600">
          Total: {attendanceRecords.length} marked, {employees.length - attendanceRecords.length} pending
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-primary-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading attendance...</p>
        </div>
      ) : (
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((employee) => {
                const status = getAttendanceStatus(employee.id);
                const record = getAttendanceRecord(employee.id);

                return (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-gray-700">
                            {employee.name?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-500">{employee.position || 'No position'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {employee.employee_id || employee.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {employee.department || 'No department'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(status)}
                        <span className={`text-sm font-medium px-2 py-1 rounded ${
                          status === 'present' ? 'bg-green-100 text-green-800' :
                          status === 'absent' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {getStatusText(status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        size="sm"
                        variant={status === 'not-marked' ? 'default' : 'outline'}
                        onClick={() => handleMarkAttendance(employee)}
                      >
                        {status === 'not-marked' ? 'Mark' : 'Update'}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <AttendanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        // onSuccess={handleSuccess}
        employee={selectedEmployee ? {
          id: selectedEmployee.id,
          name: selectedEmployee.name,
          employee: selectedEmployee.employee_id || selectedEmployee.id,
        } : undefined}
        date={parseISO(selectedDate)}
      />
    </div>
  );
}