"use client"

import { Input } from "@/components/ui/input"
import { Search as SearchIcon, X } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useRef } from "react"

export function Search() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearch = (term: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams)
      if (term) {
        params.set("q", term)
      } else {
        params.delete("q")
      }
      replace(`${pathname}?${params.toString()}`, { scroll: false })
    }, 300)
  }

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = ""
      handleSearch("")
    }
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-12">
      <div className="relative group">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
          <SearchIcon className="h-6 w-6 text-slate-400 group-focus-within:text-primary transition-colors" />
        </div>
        <Input
          ref={inputRef}
          type="text"
          placeholder="Поиск по названию или описанию..."
          defaultValue={searchParams.get("q")?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
          className="h-16 pl-16 pr-14 text-xl font-medium rounded-3xl border-2 border-slate-100 bg-white shadow-xl shadow-slate-200/50 focus-visible:ring-primary/20 focus-visible:border-primary transition-all placeholder:text-slate-300"
        />
        {/* We keep the clear button but it interacts with the ref since we are uncontrolled */}
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-6 flex items-center text-slate-300 hover:text-slate-500 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
}