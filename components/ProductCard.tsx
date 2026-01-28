"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag } from "lucide-react"
import Image from "next/image"

interface ProductProps {
  name: string;
  description: string;
  retailPrice: string;
  wholesalePrice: string;
  imageUrl: string;
  isBestseller?: boolean;
  onSelectProduct: () => void;
}

export function ProductCard({ name, description, retailPrice, wholesalePrice, imageUrl, isBestseller, onSelectProduct }: ProductProps) {
  return (
    <div className="bg-card rounded-3xl overflow-hidden shadow-lg border border-border/50 h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:border-primary/20">
      <div className="bg-secondary flex justify-center items-center">
        <Image 
          src={imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'} 
          alt={name}
          width={400}
          height={300}
          className="object-cover"
        />
        {isBestseller && (
          <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground rounded-xl px-3 py-1">
            Бестселлер
          </Badge>
        )}
      </div>

      <div className="p-6 sm:p-8 flex-grow flex flex-col">
        <h3 className="text-2xl font-bold text-foreground mb-2">{name}</h3>
        <p className="text-muted-foreground mb-6 leading-relaxed">{description}</p>
        
        <div className="flex-grow"></div>

        <div className="mb-6">
          <div className="flex items-end justify-between gap-4">
            <div className="text-left">
              <span className="text-sm text-muted-foreground block">Партнерский Опт</span>
              <span className="text-3xl font-bold text-primary">{wholesalePrice} BYN</span>
            </div>
            <div className="text-right">
              <span className="text-sm text-muted-foreground block">Розничная цена</span>
              <span className="text-lg text-muted-foreground line-through">{retailPrice} BYN</span>
            </div>
          </div>
        </div>

        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl py-6 text-lg"
          onClick={onSelectProduct}
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          Выбрать размеры
        </Button>
      </div>
    </div>
  )
}
