'use client'

import { Bell, Search, User } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { useState } from 'react'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white px-4 lg:px-6 py-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left side - Search */}
        <div className="flex-1 w-full lg:w-auto">
          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search employees, departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>
        
        {/* Right side - Notifications & Profile */}
        <div className="flex items-center justify-between lg:justify-end gap-4">
          <button className="relative p-1 text-gray-600 hover:text-gray-900">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="h-5 w-5 text-primary-700" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}