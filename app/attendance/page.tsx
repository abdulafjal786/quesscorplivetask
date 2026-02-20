import AttendanceStats from "@/components/attendance/AttendanceStats";

export default function AttendancePage() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Attendance Management</h1>

            <AttendanceStats />
        </div>
    )
}