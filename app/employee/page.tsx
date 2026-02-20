import EmployeesTableComponent from "@/components/employees/EmployeesTable";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Suspense } from "react";
import { getEmployees } from "@/lib/api"; // Assuming you have this function
import { Employee } from "@/lib/types";

// Make this an async function since you'll fetch data
export default async function EmployeePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Fetch employees data
  let employees: Employee[] = [];
  
  try {
    const result = await getEmployees();
    if (result.data) {
      employees = result.data;
    }
  } catch (error) {
    console.error("Failed to fetch employees:", error);
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Employee Management</h1>
      
      <Suspense fallback={<LoadingSpinner fullScreen={false} />}>
        <EmployeesTableComponent 
          employees={employees}
          searchParams={searchParams}
        />
      </Suspense>
    </div>
  );
}