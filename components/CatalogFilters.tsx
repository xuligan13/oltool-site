"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Filter, X, ArrowUpDown } from "lucide-react"

export function CatalogFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "")
  const [sort, setSort] = useState(searchParams.get("sort") || "popular")

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString())
      
      for (const [key, value] of Object.entries(params)) {
        if (value === null || value === "") {
          newSearchParams.delete(key)
        } else {
          newSearchParams.set(key, value)
        }
      }
      
      // Reset limit when filtering
      newSearchParams.delete("limit")
      
      return newSearchParams.toString()
    },
    [searchParams]
  )

  const applyFilters = () => {
    const query = createQueryString({
      minPrice,
      maxPrice,
      sort,
    })
    router.push(`${pathname}?${query}`, { scroll: false })
  }

  const resetFilters = () => {
    setMinPrice("")
    setMaxPrice("")
    setSort("popular")
    router.push(pathname, { scroll: false })
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-[2rem] border-2 border-slate-50 shadow-sm space-y-8">
      <div className="flex items-center gap-3 text-slate-900 mb-2">
        <Filter className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-black uppercase tracking-tighter">Фильтры и сортировка</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Price Filter */}
        <div className="space-y-4">
          <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Цена (BYN)</Label>
          <div className="flex items-center gap-3">
            <Input 
              type="number" 
              placeholder="От" 
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="h-14 rounded-2xl border-2 border-slate-100 font-bold focus-visible:ring-primary/10"
            />
            <div className="w-4 h-0.5 bg-slate-200 rounded-full" />
            <Input 
              type="number" 
              placeholder="До" 
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="h-14 rounded-2xl border-2 border-slate-100 font-bold focus-visible:ring-primary/10"
            />
          </div>
        </div>

        {/* Sorting */}
        <div className="space-y-4">
          <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Сортировать по</Label>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="h-14 rounded-2xl border-2 border-slate-100 font-bold">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-slate-400" />
                <SelectValue placeholder="Сортировка" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-2 shadow-lg">
              <SelectItem value="popular" className="font-bold py-3">По популярности</SelectItem>
              <SelectItem value="price_asc" className="font-bold py-3">Сначала дешевле</SelectItem>
              <SelectItem value="price_desc" className="font-bold py-3">Сначала дороже</SelectItem>
              <SelectItem value="newest" className="font-bold py-3">Новинки</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex items-end gap-3">
          <Button 
            onClick={applyFilters}
            className="flex-grow h-14 rounded-2xl font-black text-base shadow-sm hover:shadow-md transition-all bg-primary text-white"
          >
            ПРИМЕНИТЬ
          </Button>
          <Button 
            variant="outline" 
            onClick={resetFilters}
            className="h-14 w-14 rounded-2xl border-2 hover:bg-slate-50 transition-all text-slate-400"
            title="Сбросить"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}
