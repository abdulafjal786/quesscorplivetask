'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useRouter, useSearchParams } from 'next/navigation'

interface SearchFiltersProps {
  initialSearch?: string
}

export default function SearchFilters({
  initialSearch = '',
}: SearchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(initialSearch)
  const [isSearching, setIsSearching] = useState(false)

  // Update URL when search changes (with debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      
      if (search.trim()) {
        params.set('search', search)
        setIsSearching(true)
      } else {
        params.delete('search')
      }
      
      router.push(`/?${params.toString()}`)
      // Simulate search completion
      setTimeout(() => setIsSearching(false), 300)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [search, router, searchParams])

  const handleClear = () => {
    setSearch('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('search')
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search by full name, email, or employee ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-10"
            disabled={isSearching}
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary-600" />
            </div>
          )}
          {search && !isSearching && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {search && (
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={isSearching}
            className="whitespace-nowrap"
          >
            Clear Search
          </Button>
        )}
      </div>

      {/* Search Tips */}
      {search && (
        <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
          <p>Searching for: <span className="font-medium">{search}</span></p>
          <p className="mt-1">Searches in: Full Name, Email, Employee ID</p>
        </div>
      )}
    </div>
  )
}