"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag } from "lucide-react"
import Image from "next/image"

interface ProductProps {
  name: string
  description: string
  retailPrice: string
  wholesalePrice: string
  sizes: string[]
  imageUrl: string
  isBestseller?: boolean
}

export function ProductCard({ name, description, retailPrice, wholesalePrice, sizes, imageUrl, isBestseller }: ProductProps) {
  const handleOrderClick = () => {
    const telegramUsername = "Trianon2020"
    const message = `Здравствуйте! Меня интересует оптовый заказ воротников: ${name}.`
    const telegramUrl = `https://t.me/${telegramUsername}?text=${encodeURIComponent(message)}`
    window.open(telegramUrl, '_blank')
  }

  return (
    <div className="bg-card rounded-3xl overflow-hidden shadow-lg border border-border/50 h-full flex flex-col">
      <div className="aspect-[4/3] bg-secondary relative flex items-center justify-center overflow-hidden">
        <Image
          src={imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {isBestseller && (
          <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground rounded-xl px-3 py-1">
            Бестселлер
          </Badge>
        )}
      </div>
      <div className="p-6 sm:p-8 flex-grow">
        <h3 className="text-2xl font-bold text-foreground mb-2">{name}</h3>
        <p className="text-muted-foreground mb-6 leading-relaxed">{description}</p>
        <div className="mb-6">
          <span className="text-sm font-medium text-foreground mb-3 block">Размеры:</span>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <span key={size} className="px-3 py-1 bg-secondary text-foreground rounded-lg text-xs font-medium">
                {size}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-secondary rounded-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="text-sm text-muted-foreground block mb-1">Розничная цена</span>
              <span className="text-lg text-muted-foreground line-through">{retailPrice} BYN</span>
            </div>
            <div className="text-right">
              <span className="text-sm text-primary block mb-1 font-medium">Партнерский Опт</span>
              <span className="text-3xl font-bold text-primary">{wholesalePrice} BYN</span>
            </div>
          </div>
        </div>
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl py-6 text-lg"
          onClick={handleOrderClick}
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          Заказать партию
        </Button>
      </div>
    </div>
  )
}
