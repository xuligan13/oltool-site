"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCartStore } from "@/store/cart"
import { Minus, Plus, Trash2, Send, ShoppingBag, ArrowRight, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { createOrder } from "@/app/actions/create-order"
import { toast } from "sonner"

interface CartSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore()
  const totalPrice = getTotalPrice()
  
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName || !customerPhone) {
      toast.error("Пожалуйста, заполните все поля")
      return
    }

    try {
      setIsSubmitting(true)
      const result = await createOrder(customerName, customerPhone, items, totalPrice)
      
      if (result.success) {
        toast.success("Заказ успешно оформлен! Менеджер свяжется с вами.")
        clearCart()
        setIsOrderDialogOpen(false)
        onOpenChange(false)
        setCustomerName("")
        setCustomerPhone("")
      } else {
        toast.error(result.error || "Произошла ошибка при оформлении заказа")
      }
    } catch (error) {
      console.error(error)
      toast.error("Не удалось оформить заказ. Попробуйте позже.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-xl p-0 flex flex-col h-full border-none shadow-2xl overflow-hidden">
          {/* Header */}
          <SheetHeader className="p-6 sm:p-10 pb-4 sm:pb-6 border-b bg-white shrink-0">
            <SheetTitle className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              Корзина
            </SheetTitle>
          </SheetHeader>

          {/* Middle section */}
          <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-4 space-y-6 sm:space-y-8">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8 py-10 sm:py-20">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-50 rounded-[2rem] sm:rounded-[2.5rem] flex items-center justify-center animate-pulse">
                  <ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 text-slate-200" />
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tighter">Пусто...</p>
                  <p className="text-slate-500 font-medium text-base sm:text-lg leading-snug">
                    Ваша корзина ждет, когда <br /> вы её наполните!
                  </p>
                </div>
                <Button 
                  asChild 
                  className="h-14 sm:h-16 px-8 sm:px-10 rounded-2xl font-black text-lg sm:text-xl shadow-xl shadow-primary/10"
                  onClick={() => onOpenChange(false)}
                >
                  <Link href="/catalog">
                    В КАТАЛОГ <ArrowRight className="h-5 w-5 ml-3" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="p-4 sm:p-6 bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4 sm:space-y-6 hover:shadow-md transition-shadow">
                    <div className="flex gap-4 sm:gap-6">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-slate-50 relative overflow-hidden shrink-0 border border-slate-100 shadow-inner">
                        {item.image_url ? (
                          <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-200">
                            <ShoppingBag className="h-8 w-8 sm:h-10 sm:w-10" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-start">
                        <div className="flex justify-between items-start gap-2 sm:gap-4">
                          <h4 className="font-black text-lg sm:text-2xl text-slate-900 leading-tight break-words">
                            {item.name}
                          </h4>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 sm:h-10 sm:w-10 text-slate-300 hover:text-destructive hover:bg-destructive/10 shrink-0 rounded-lg sm:rounded-xl transition-colors"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 sm:h-6 sm:w-6" />
                          </Button>
                        </div>
                        <p className="text-primary font-black text-xl sm:text-2xl tracking-tighter mt-1 sm:mt-2">
                          {item.price.toFixed(2)} <small className="text-[10px] sm:text-xs ml-0.5 uppercase opacity-60 font-bold">BYN</small>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      {Object.entries(item.sizes).map(([size, qty]) => (
                        <div key={size} className="flex items-center justify-between bg-slate-50 p-2 sm:p-3 pl-4 sm:pl-5 rounded-xl sm:rounded-2xl border border-slate-100/50">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Badge variant="outline" className="bg-white border-slate-200 text-slate-900 font-black px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm rounded-lg">
                              {size}
                            </Badge>
                            <div className="flex items-center">
                              <Input 
                                type="number" 
                                min="0"
                                value={qty} 
                                onChange={(e) => updateQuantity(item.id, size, parseInt(e.target.value) || 0)}
                                className="w-14 h-8 sm:w-16 sm:h-10 text-center mx-1 sm:mx-2 font-black rounded-lg sm:rounded-xl border-2 px-1 text-sm sm:text-base" 
                              />
                              <span className="text-slate-900 font-black text-xs sm:text-sm">шт</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl hover:bg-white hover:shadow-sm transition-all"
                              onClick={() => updateQuantity(item.id, size, qty - 1)}
                            >
                              <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl hover:bg-white hover:shadow-sm transition-all"
                              onClick={() => updateQuantity(item.id, size, qty + 1)}
                            >
                              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <SheetFooter className="p-6 sm:p-10 bg-white border-t-2 border-slate-100 shrink-0 flex flex-col space-y-4 sm:space-y-8">
              <div className="flex justify-between items-center w-full">
                <span className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] sm:text-[12px]">Итоговая сумма</span>
                <div className="text-right leading-none">
                  <span className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter">
                    {totalPrice.toFixed(2)}
                  </span>
                  <span className="text-slate-400 font-black ml-2 sm:ml-3 text-sm sm:text-lg uppercase">BYN</span>
                </div>
              </div>
              
              <Button 
                onClick={() => setIsOrderDialogOpen(true)}
                className="w-full h-16 sm:h-24 rounded-2xl sm:rounded-[2rem] font-black text-xl sm:text-3xl shadow-2xl shadow-primary/30 bg-primary text-white hover:scale-[1.02] active:scale-[0.98] transition-all gap-3 sm:gap-5"
              >
                <Send className="h-6 w-6 sm:h-10 sm:w-10" />
                ОФОРМИТЬ ЗАКАЗ
              </Button>
              <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-none">
                Менеджер свяжется с вами для уточнения деталей
              </p>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>

      {/* Checkout Form Dialog */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="sm:max-w-lg rounded-[2.5rem] p-8 border-none shadow-2xl">
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Оформление заказа</DialogTitle>
            <DialogDescription className="text-lg font-medium text-slate-500 leading-tight">
              Введите ваши контактные данные, чтобы мы могли подтвердить ваш заказ.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitOrder} className="space-y-8 py-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Ваше имя</Label>
                <Input 
                  id="name" 
                  placeholder="Иван Иванов" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="h-16 text-xl font-bold rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus-visible:border-primary focus-visible:ring-primary/10 transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Телефон</Label>
                <Input 
                  id="phone" 
                  type="tel"
                  placeholder="+375 (__) ___-__-__" 
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="h-16 text-xl font-bold rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus-visible:border-primary focus-visible:ring-primary/10 transition-all"
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-20 rounded-3xl font-black text-2xl shadow-xl shadow-primary/20 bg-primary text-white hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {isSubmitting ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : (
                  "ПОДТВЕРДИТЬ ЗАКАЗ"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}