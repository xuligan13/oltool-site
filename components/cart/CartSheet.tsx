"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCartStore } from "@/store/cart"
import { Minus, Plus, Trash2, Send, ShoppingBag, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface CartSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore()
  const totalPrice = getTotalPrice()

  const handleCheckout = () => {
    const text = items.map(i => {
      const sizesText = Object.entries(i.sizes)
        .map(([s, q]) => `${s}: ${q} шт`)
        .join(', ');
      return `📦 ${i.name}\n   ${sizesText}`;
    }).join('\n\n');
    
    const total = `\n💰 Итого: ${totalPrice.toFixed(2)} BYN`;
    const finalMsg = encodeURIComponent(`Новый заказ с сайта:\n\n${text}${total}`);
    window.open(`https://t.me/Trianon2020?text=${finalMsg}`, '_blank');
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl p-0 flex flex-col h-full border-none shadow-2xl overflow-hidden">
        {/* Header padding adjusted for mobile */}
        <SheetHeader className="p-6 sm:p-10 pb-4 sm:pb-6 border-b bg-white shrink-0">
          <SheetTitle className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            Корзина
          </SheetTitle>
        </SheetHeader>

        {/* Middle section with flexible scroll and responsive padding */}
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
                <Link href="/catalog" className="flex items-center gap-3">
                  В КАТАЛОГ <ArrowRight className="h-5 w-5" />
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
              onClick={handleCheckout}
              className="w-full h-16 sm:h-24 rounded-2xl sm:rounded-[2rem] font-black text-xl sm:text-3xl shadow-2xl shadow-primary/30 bg-primary text-white hover:scale-[1.02] active:scale-[0.98] transition-all gap-3 sm:gap-5"
            >
              <Send className="h-6 w-6 sm:h-10 sm:w-10" />
              ОФОРМИТЬ ЗАКАЗ
            </Button>
            <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-none">
              Заказ будет сформирован и отправлен в Telegram @Trianon2020
            </p>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
