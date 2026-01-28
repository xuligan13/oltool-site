"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer"
import { ShoppingBag, Plus, Minus, Trash2 } from "lucide-react"

interface Product {
  id: number
  name: string
  description: string
  retail_price: string
  wholesale_price: string
  sizes: string[]
  image_url: string
  is_bestseller?: boolean
}

interface OrderDrawerProps {
  product: Product | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function OrderDrawer({ product, isOpen, onOpenChange }: OrderDrawerProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    if (product && isOpen) {
      setQuantities(Object.fromEntries(product.sizes.map(size => [size, 0])));
    }
  }, [product, isOpen]);

  const handleQuantityChange = (size: string, newQuantity: number) => {
    setQuantities(prev => ({ ...prev, [size]: Math.max(0, newQuantity) }));
  };
  
  const handleClear = () => {
    if (product) {
      setQuantities(Object.fromEntries(product.sizes.map(size => [size, 0])));
    }
  };

  const { totalQuantity, orderSummary } = useMemo(() => {
    if (!product) return { totalQuantity: 0, orderSummary: "" };
    const orderedItems = Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([size, qty]) => `${size}: ${qty}шт`);
    const total = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
    return { totalQuantity: total, orderSummary: orderedItems.join(', ') };
  }, [quantities, product]);

  const handleOrderClick = () => {
    if (totalQuantity === 0 || !product) return;
    const message = `Заказ: ${product.name}.\nСостав: ${orderSummary}.\nИтого: ${totalQuantity}шт.`;
    const telegramUrl = `https://t.me/Trianon2020?text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, '_blank');
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-card rounded-t-3xl shadow-2xl outline-none">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="p-6 text-center">
            {product && (
              <div className="space-y-1">
                <DrawerTitle className="text-2xl font-bold">
                  {product.name}
                </DrawerTitle>
                <DrawerDescription className="text-sm text-muted-foreground">
                  Укажите количество для каждого размера
                </DrawerDescription>
              </div>
            )}
          </DrawerHeader>
          
          <div className="px-6 space-y-4">
            {product?.sizes.map((size) => (
              <div key={size} className="flex items-center justify-between">
                <span className="text-lg font-medium">{size}</span>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" onClick={() => handleQuantityChange(size, (quantities[size] || 0) - 1)}>
                    <Minus className="w-4 h-4"/>
                  </Button>
                  <span className="text-xl font-bold w-12 text-center tabular-nums">{quantities[size] || 0}</span>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" onClick={() => handleQuantityChange(size, (quantities[size] || 0) + 1)}>
                    <Plus className="w-4 h-4"/>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <DrawerFooter className="pt-8 pb-10">
            <Button 
              className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl text-lg font-semibold"
              onClick={handleOrderClick}
              disabled={totalQuantity === 0}
            >
              <ShoppingBag className="w-5 h-5 mr-3" />
              Заказать ({totalQuantity} шт.)
            </Button>
            {totalQuantity > 0 && (
                 <Button variant="ghost" onClick={handleClear} className="text-muted-foreground hover:text-destructive mt-2">
                    <Trash2 className="w-4 h-4 mr-2"/> Очистить всё
                 </Button>
            )}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}