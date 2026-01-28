import Link from "next/link"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Flame, ImageIcon, Package, SearchX } from "lucide-react"
import { AddToCart } from "@/components/cart/AddToCart"
import { Search } from "@/components/Search"

export const revalidate = 3600 // Revalidate every hour

interface CatalogPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams
  const query = params.q || ""

  let supabaseQuery = supabase
    .from("products")
    .select("*")

  if (query) {
    supabaseQuery = supabaseQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`)
  }

  const { data: products, error } = await supabaseQuery
    .order("is_bestseller", { ascending: false })
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching products:", error)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center">
          <Link 
            href="/" 
            className="flex items-center text-slate-600 hover:text-primary transition-all font-bold text-lg group"
          >
            <div className="mr-3 p-2 rounded-xl group-hover:bg-primary/5 transition-colors">
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            </div>
            На главную
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <header className="mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-full text-sm font-black uppercase tracking-widest">
            <Package className="h-4 w-4" />
            Наш ассортимент
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-tight">
            Каталог <span className="text-primary">воротников</span>
          </h1>
          <p className="text-slate-500 text-xl md:text-2xl font-medium max-w-3xl leading-relaxed">
            Профессиональные защитные решения для ветеринарных клиник и аптек. 
            Прямые поставки от производителя ОЛТУОЛ.
          </p>
        </header>

        {/* SEARCH COMPONENT */}
        <Search />

        {!products || products.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border-2 border-dashed border-slate-100 flex flex-col items-center justify-center">
            {query ? (
              <>
                <div className="bg-slate-50 p-8 rounded-full mb-6 text-slate-300">
                  <SearchX className="h-16 w-16" />
                </div>
                <p className="text-2xl text-slate-900 font-black uppercase tracking-tight mb-2">Ничего не найдено</p>
                <p className="text-slate-500 font-medium">По запросу «{query}» товаров нет. Попробуйте изменить фильтр.</p>
              </>
            ) : (
              <>
                <Package className="h-20 w-20 text-slate-200 mb-6" />
                <p className="text-2xl text-slate-400 font-black uppercase tracking-widest">Товары не найдены</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {products.map((product) => (
              <Card 
                key={product.id} 
                className="border-none shadow-xl shadow-slate-200/60 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 rounded-[2.5rem] overflow-hidden bg-white group flex flex-col h-full hover:-translate-y-2"
              >
                <Link href={`/catalog/${product.id}`} className="flex-grow flex flex-col group/link">
                  {/* Image Section */}
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover/link:scale-110 group-hover/link:opacity-90"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300">
                        <ImageIcon className="h-16 w-16 mb-3 opacity-20" />
                        <span className="text-xs font-black uppercase tracking-widest opacity-40">Нет фото</span>
                      </div>
                    )}
                    
                    {product.is_bestseller && (
                      <div className="absolute top-6 left-6">
                        <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-none px-5 py-2 text-sm font-black rounded-full shadow-xl uppercase tracking-wider flex items-center gap-2">
                          <Flame className="h-4 w-4 fill-current" />
                          Хит
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <CardHeader className="p-8 pb-4">
                    <CardTitle className="text-2xl font-black text-slate-900 line-clamp-2 group-hover/link:text-primary transition-colors leading-none">
                      {product.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="px-8 py-0 flex-grow space-y-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-slate-900 tracking-tight">
                        {product.retail_price}
                      </span>
                      <span className="text-slate-400 font-black text-lg">BYN</span>
                    </div>
                    
                    <div className="h-px bg-slate-100 w-full" />
                    
                    <p className="text-slate-500 text-lg font-medium line-clamp-2 leading-snug">
                      {product.description}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {product.sizes?.slice(0, 3).map((size: string) => (
                        <span key={size} className="px-3 py-1 bg-slate-50 text-slate-500 text-xs font-bold rounded-lg border border-slate-100">
                          {size}
                        </span>
                      ))}
                      {product.sizes?.length > 3 && (
                        <span className="text-xs text-slate-300 font-bold self-center">
                          +{product.sizes.length - 3} еще
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Link>

                {/* Footer Section */}
                <CardFooter className="p-8 pt-6">
                  <AddToCart product={product} />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer Decoration */}
      <footer className="mt-32 py-20 bg-slate-900 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-widest">ОЛТУОЛ — ТВОЙ ВЫБОР</h2>
          <div className="w-24 h-2 bg-primary mx-auto rounded-full mb-8" />
          <p className="text-slate-400 text-lg font-medium">
            Лучшие ветеринарные воротники в Беларуси. <br />
            Надежность, которой доверяют профессионалы.
          </p>
        </div>
      </footer>
    </div>
  )
}