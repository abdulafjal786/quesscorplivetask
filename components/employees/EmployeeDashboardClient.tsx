// 'use client';

// import { useEffect, useState } from 'react';
// import EmployeesTableComponent from '@/components/employees/EmployeesTable';
// import LoadingSpinner from '@/components/shared/LoadingSpinner';
// import { Employee } from '@/lib/types';
// import { getEmployees } from '@/lib/api';

// export default function EmployeeDashboardClient({ searchParams }: { searchParams: unknown }) {
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);

//   useEffect(() => {
//     async function fetchEmployees() {
//       try {
//         const result = await getEmployees();
//         setEmployees(result.data || []);
//       } catch (err) {
//         console.error(err);
//         setError(true);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchEmployees();
//   }, []);

//   if (loading) return <LoadingSpinner fullScreen={false} />;
//   if (error) return <div className="text-red-600 text-center py-12">Failed to load employees</div>;

//   return (
//     <EmployeesTableComponent employees={employees} searchParams={searchParams} />
//   );
// }