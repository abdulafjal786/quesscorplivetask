'use client'

import { 
  Users, 
  LayoutDashboard, 
  Building2, 
  BarChart3, 
  Settings,
  Calendar,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Employees', href: '/employee', icon: Users },
  { name: 'Attendance', href: '/attendance', icon: Clock },
  { name: 'Departments', href: '/departments', icon: Building2 },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 border-r border-gray-200 bg-white lg:block">
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
            <Users className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">EMP Manager</h1>
        </div>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname?.startsWith(item.href))
            
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={clsx(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <Icon className={clsx(
                    'h-5 w-5',
                    isActive ? 'text-primary-600' : 'text-gray-400'
                  )} />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      
      {/* Quick Stats */}
      <div className="mt-auto border-t border-gray-200 p-4">
        <div className="rounded-lg bg-blue-50 p-4">
          <h3 className="text-sm font-medium text-blue-900">Today&apos;s Stats</h3>
          <div className="mt-2 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-blue-700">Present</span>
              <span className="font-medium text-blue-900">42/50</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-700">On Leave</span>
              <span className="font-medium text-blue-900">8</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-700">Late</span>
              <span className="font-medium text-blue-900">3</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}