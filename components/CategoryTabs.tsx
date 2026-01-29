"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CategoryTabsProps {
  categories: string[]
}

export function CategoryTabs({ categories }: CategoryTabsProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  
  const currentCategory = searchParams.get("category") || "all"

  const setCategory = (id: string) => {
    const params = new URLSearchParams(searchParams)
    // Reset page when category changes
    params.delete("page")
    
    if (id === "all") {
      params.delete("category")
    } else {
      params.set("category", id)
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  // Predefined mapping for pretty labels, fallback to raw string
  const labelMap: Record<string, string> = {
    all: "Все товары",
    collars: "Воротники",
    accessories: "Аксессуары",
    plastic: "Пластик",
    fabric: "Ткань",
    leather: "Кожа",
    new: "Новинки"
  }

    return (

      <div className="flex gap-3 mb-8 overflow-x-auto pb-4 no-scrollbar scroll-smooth">

        <Button

          variant={currentCategory === "all" ? "default" : "outline"}

          onClick={() => setCategory("all")}

          className={cn(

            "h-12 px-6 rounded-full font-bold text-base transition-all shrink-0",

            currentCategory === "all" 

              ? "shadow-md bg-primary text-white" 

              : "border-2 border-slate-100 text-slate-500 hover:text-primary hover:border-primary/20 bg-white"

          )}

        >

          Все товары

        </Button>

        

        {categories.map((cat) => (

          <Button

            key={cat}

            variant={currentCategory === cat ? "default" : "outline"}

            onClick={() => setCategory(cat)}

            className={cn(

              "h-12 px-6 rounded-full font-bold text-base transition-all shrink-0 uppercase tracking-tight",

              currentCategory === cat 

                ? "shadow-md bg-primary text-white" 

                : "border-2 border-slate-100 text-slate-500 hover:text-primary hover:border-primary/20 bg-white"

            )}

          >

            {labelMap[cat] || cat}

          </Button>

        ))}

      </div>

    )

  }

  