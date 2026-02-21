
import EmployeesTableComponent from "@/components/employees/EmployeesTable";

import { getEmployees } from "@/lib/api"; // Assuming you have this function
import { Employee } from "@/lib/types";

export default async function EmployeePage() {
  let employees: Employee[] = [];

  try {
    const result = await getEmployees();
    if (result.data) {
      employees = result.data;
      console.log("Fetched employees:", employees);
    }
  } catch (error) {
    console.error("Failed to fetch employees:", error);
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Employee Management</h1>
      <EmployeesTableComponent employees={employees} />
    </div>
  );
}