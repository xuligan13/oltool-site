"use client"

import { useEffect, useState } from "react"
import { ProductCard } from "./ProductCard"
import { SkeletonCard } from "./skeleton-card"
import { supabase } from "@/lib/supabase"

// Define the type for a product based on the database schema
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

export function ProductShowcase() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('id', { ascending: true })

        if (error) {
          throw error
        }
        
        setProducts(data || [])
      } catch (err: any) {
        console.error("Error fetching products:", err.message)
        setError("Не удалось загрузить товары. Попробуйте обновить страницу.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <section className="bg-background py-16 sm:py-24" id="catalog">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Наш каталог</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Прямые поставки от ОЛТУОЛ для ветеринарных клиник и аптек
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : error ? (
            <div className="md:col-span-2 text-center text-destructive bg-destructive/10 p-8 rounded-2xl border border-destructive/20">
                <p className="text-lg font-medium">{error}</p>
            </div>
          ) : (
            products.map((product) => (
              <ProductCard 
                key={product.id}
                name={product.name}
                description={product.description}
                retailPrice={product.retail_price}
                wholesalePrice={product.wholesale_price}
                sizes={product.sizes}
                imageUrl={product.image_url}
                isBestseller={product.is_bestseller}
              />
            ))
          )}
        </div>
      </div>
    </section>
  )
}