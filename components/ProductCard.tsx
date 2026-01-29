"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag } from "lucide-react"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"

interface ProductProps {
  id: number;
  name: string;
  description: string;
  retailPrice: string;
  wholesalePrice: string;
  imageUrl: string;
  isBestseller?: boolean;
  onSelectProduct: () => void;
}

export function ProductCard({ id, name, description, retailPrice, wholesalePrice, imageUrl, isBestseller, onSelectProduct }: ProductProps) {
  
  const logView = async () => {
    // 🛡 ПРОВЕРКА УНИКАЛЬНОСТИ (sessionStorage)
    const viewKey = `v_viewed_${id}`
    if (typeof window !== "undefined" && sessionStorage.getItem(viewKey)) return

    // Получаем или создаем ID сессии
    let sessionId = sessionStorage.getItem("app_session_id")
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15)
      sessionStorage.setItem("app_session_id", sessionId)
    }

    // 🕵️‍♂️ "1984" tracking with Unique Filter
    await supabase.rpc('increment_product_views', { product_id: id })
    await supabase.from("user_logs").insert([
      { 
        event_type: "view", 
        session_id: sessionId,
        payload: { product_id: id, product_name: name, source: "card_click" } 
      }
    ])

    sessionStorage.setItem(viewKey, "true")
  }

  const handleAction = () => {
    logView()
    onSelectProduct()
  }

  return (
    <div className="bg-card rounded-3xl overflow-hidden shadow-sm border border-border/50 h-full flex flex-col transition-all duration-300 hover:shadow-md hover:border-primary/20">
      <div className="bg-secondary flex justify-center items-center relative aspect-[4/3]">
        <Image 
          src={imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'} 
          alt={name}
          fill
          className="object-cover"
        />
        {isBestseller && (
          <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground rounded-xl px-3 py-1 shadow-sm">
            Бестселлер
          </Badge>
        )}
      </div>

      <div className="p-6 sm:p-8 flex-grow flex flex-col">
        <h3 className="text-2xl font-black text-foreground mb-2 leading-tight">{name}</h3>
        <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3">{description}</p>
        
        <div className="flex-grow"></div>

        <div className="mb-6">
          <div className="flex items-end justify-between gap-4">
            <div className="text-left">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Партнерский Опт</span>
              <span className="text-3xl font-black text-primary tracking-tighter">{wholesalePrice} <small className="text-xs uppercase">BYN</small></span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Розница</span>
              <span className="text-lg font-bold text-slate-300 line-through decoration-slate-400/50">{retailPrice} <small className="text-[10px] uppercase">BYN</small></span>
            </div>
          </div>
        </div>

        <Button 
          className="w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl py-6 text-lg font-black shadow-sm transition-all active:scale-[0.98]"
          onClick={handleAction}
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          В КОРЗИНУ
        </Button>
      </div>
    </div>
  )
}
