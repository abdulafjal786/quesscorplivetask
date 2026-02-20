// 'use client'

// import { useState } from 'react'
// import { Calendar, Filter, User, Building2 } from 'lucide-react'
// import Input from '@/components/ui/Input'
// import Select from '@/components/ui/Select'
// import Button from '@/components/ui/Button'

// export default function AttendanceFilters() {
//   const [employee, setEmployee] = useState('all')
//   const [department, setDepartment] = useState('all')
//   const [dateFrom, setDateFrom] = useState('')
//   const [dateTo, setDateTo] = useState('')
//   const [status, setStatus] = useState('all')

//   const resetFilters = () => {
//     setEmployee('all')
//     setDepartment('all')
//     setDateFrom('')
//     setDateTo('')
//     setStatus('all')
//   }

//   const departments = [
//     { value: 'all', label: 'All Departments' },
//     { value: 'engineering', label: 'Engineering' },
//     { value: 'marketing', label: 'Marketing' },
//     { value: 'sales', label: 'Sales' },
//     { value: 'hr', label: 'Human Resources' },
//     { value: 'finance', label: 'Finance' },
//   ]

//   const statusOptions = [
//     { value: 'all', label: 'All Status' },
//     { value: 'present', label: 'Present' },
//     { value: 'absent', label: 'Absent' },
//     { value: 'late', label: 'Late' },
//     { value: 'half-day', label: 'Half Day' },
//     { value: 'leave', label: 'On Leave' },
//   ]

//   return (
//     <div className="space-y-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             <User className="inline h-4 w-4 mr-1" />
//             Employee
//           </label>
//           <Select
//             value={employee}
//             onChange={setEmployee}
//             options={[
//               { value: 'all', label: 'All Employees' },
//               { value: 'john', label: 'John Smith' },
//               { value: 'sarah', label: 'Sarah Johnson' },
//               { value: 'michael', label: 'Michael Chen' },
//             ]}
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             <Building2 className="inline h-4 w-4 mr-1" />
//             Department
//           </label>
//           <Select
//             value={department}
//             onChange={setDepartment}
//             options={departments}
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             <Filter className="inline h-4 w-4 mr-1" />
//             Status
//           </label>
//           <Select
//             value={status}
//             onChange={setStatus}
//             options={statusOptions}
//           />
//         </div>

//         <div className="flex items-end gap-2">
//           <Button 
//             onClick={resetFilters}
//             className="w-full"
//             variant="outline"
//           >
//             Clear Filters
//           </Button>
//         </div>
//       </div>

//       {/* Date Range */}
//       <div className="flex flex-col gap-3 md:flex-row md:items-center">
//         <div className="flex items-center gap-2">
//           <Calendar className="h-4 w-4 text-gray-400" />
//           <span className="text-sm font-medium text-gray-700">Date Range:</span>
//         </div>
        
//         <div className="flex flex-1 flex-col gap-3 md:flex-row">
//           <div className="flex items-center gap-2">
//             <label className="text-sm text-gray-600">From</label>
//             <Input
//               type="date"
//               value={dateFrom}
//               onChange={(e) => setDateFrom(e.target.value)}
//               className="max-w-[200px]"
//             />
//           </div>
          
//           <div className="flex items-center gap-2">
//             <label className="text-sm text-gray-600">To</label>
//             <Input
//               type="date"
//               value={dateTo}
//               onChange={(e) => setDateTo(e.target.value)}
//               className="max-w-[200px]"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }