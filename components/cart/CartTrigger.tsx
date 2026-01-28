"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCartStore } from "@/store/cart"
import { CartSheet } from "./CartSheet"
import { Badge } from "@/components/ui/badge"

export function CartTrigger() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const totalItems = useCartStore((state) => state.getTotalItems())

  // Persist hydration fix
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50">
        <Button 
          onClick={() => setOpen(true)}
          className="h-20 w-20 rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center bg-primary text-white hover:scale-110 active:scale-95 transition-all group p-0 relative"
        >
          <ShoppingCart className="h-8 w-8 transition-transform group-hover:rotate-12" />
          
          {totalItems > 0 && (
            <Badge className="absolute -top-1 -right-1 h-8 min-w-[32px] rounded-full bg-orange-500 text-white border-4 border-white flex items-center justify-center font-black text-sm p-1">
              {totalItems}
            </Badge>
          )}
        </Button>
      </div>

      <CartSheet open={open} onOpenChange={setOpen} />
    </>
  )
}
