"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import { useCartStore } from "@/store/cart"
import { toast } from "sonner"

interface AddToCartProps {
  product: {
    id: number
    name: string
    retail_price: string
    image_url: string | null
    sizes: string[]
  }
}

export function AddToCart({ product }: AddToCartProps) {
  const [selectedSizes, setSelectedSizes] = useState<{ [size: string]: number }>({})
  const [open, setOpen] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const updateQty = (size: string, delta: number) => {
    setSelectedSizes((prev) => {
      const current = prev[size] || 0
      const next = Math.max(0, current + delta)
      
      const newSizes = { ...prev }
      if (next === 0) {
        delete newSizes[size]
      } else {
        newSizes[size] = next
      }
      return newSizes
    })
  }

  const handleInputChange = (size: string, value: string) => {
    const qty = Math.max(0, parseInt(value) || 0)
    setSelectedSizes((prev) => {
      const newSizes = { ...prev }
      if (qty === 0) {
        delete newSizes[size]
      } else {
        newSizes[size] = qty
      }
      return newSizes
    })
  }

  const handleAddToCart = () => {
    if (Object.keys(selectedSizes).length === 0) {
      toast.error("Выберите хотя бы один размер")
      return
    }

    addItem(product, selectedSizes)
    toast.success("Товар добавлен в заказ")
    setOpen(false)
    setSelectedSizes({})
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full h-16 rounded-2xl font-black text-lg shadow-xl shadow-primary/10 hover:shadow-primary/30 transition-all active:scale-[0.97] bg-primary text-white">
          <ShoppingCart className="mr-2 h-5 w-5" />
          В ЗАКАЗ
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
            Выберите количество
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {product.sizes.map((size) => (
            <div key={size} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xl font-black text-slate-700">{size}</span>
              <div className="flex items-center gap-4">
                <Button 
                  type="button"
                  variant="outline" 
                  size="icon" 
                  className="h-10 w-10 rounded-xl border-2"
                  onClick={() => updateQty(size, -1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input 
                  type="number"
                  min="0"
                  value={selectedSizes[size] || 0}
                  onChange={(e) => handleInputChange(size, e.target.value)}
                  className="w-16 h-10 text-center font-black rounded-xl border-2"
                />
                <Button 
                  type="button"
                  variant="outline" 
                  size="icon" 
                  className="h-10 w-10 rounded-xl border-2"
                  onClick={() => updateQty(size, 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button 
            onClick={handleAddToCart}
            className="w-full h-16 rounded-2xl font-black text-xl shadow-xl bg-primary text-white"
          >
            ПОДТВЕРДИТЬ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}