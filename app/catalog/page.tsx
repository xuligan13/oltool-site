import Link from "next/link"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Flame, ImageIcon, Package, SearchX, Sparkles, FilterX, ChevronDown } from "lucide-react"
import { AddToCart } from "@/components/cart/AddToCart"
import { Search } from "@/components/Search"
import { CategoryTabs } from "@/components/CategoryTabs"

export const revalidate = 3600 // Revalidate every hour

interface CatalogPageProps {
  searchParams: Promise<{ q?: string; category?: string; limit?: string }>
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams
  const query = params.q || ""
  const category = params.category || "all"
  const limit = parseInt(params.limit || "12")

  // 1. Fetch Dynamic Categories from DB
  const { data: categoryData } = await supabase
    .from("products")
    .select("category")
  
  const uniqueCategories = Array.from(new Set(categoryData?.map(p => p.category).filter(Boolean))) as string[]

  // 2. Build Main Query
  let supabaseQuery = supabase
    .from("products")
    .select("*", { count: "exact" })

  if (query) {
    supabaseQuery = supabaseQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`)
  }

  if (category !== "all") {
    if (category === "new") {
      supabaseQuery = supabaseQuery.eq("is_new", true)
    } else {
      supabaseQuery = supabaseQuery.eq("category", category)
    }
  }

  // 3. Fetch Data with Limit
  const { data: products, error, count } = await supabaseQuery
    .order("is_hit", { ascending: false }) 
    .order("is_bestseller", { ascending: false })
    .order("name", { ascending: true })
    .range(0, limit - 1)

  if (error) {
    console.error("Error fetching products:", error)
  }

  const hasMore = count ? count > limit : false

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-16">
        <header className="mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-full text-xs font-black uppercase tracking-widest">
            <Package className="h-4 w-4" />
            Наш ассортимент
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none">
            Каталог <span className="text-primary">товаров</span>
          </h1>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
            <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl">
              Профессиональные защитные решения от производителя ОЛТУОЛ.
            </p>
            <div className="bg-white px-6 py-2 rounded-2xl border-2 border-slate-50 shadow-sm inline-flex items-center gap-2 w-fit">
              <span className="text-slate-400 font-bold text-sm uppercase">Найдено:</span>
              <span className="text-primary font-black text-xl">{count || 0}</span>
            </div>
          </div>
        </header>

        {/* SEARCH & FILTERS */}
        <div className="space-y-6">
          <Search />
          <CategoryTabs categories={uniqueCategories} />
        </div>

        {!products || products.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border-2 border-dashed border-slate-100 flex flex-col items-center justify-center p-8">
            <div className="bg-slate-50 p-10 rounded-[2.5rem] mb-8 text-slate-300">
              <FilterX className="h-20 w-20" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">Ничего не нашли</h2>
            <p className="text-slate-500 text-xl font-medium max-w-md mb-10">
              По вашим параметрам товаров не обнаружено.
            </p>
            <Button asChild variant="outline" className="h-16 px-10 rounded-2xl border-2 font-black text-lg">
              <Link href="/catalog">СБРОСИТЬ ФИЛЬТРЫ</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
              {products.map((product) => (
                <Card 
                  key={product.id} 
                  className="border-none shadow-sm hover:shadow-md transition-all duration-500 rounded-3xl overflow-hidden bg-white group flex flex-col h-full hover:-translate-y-1"
                >
                  <Link href={`/catalog/${product.id}`} className="flex-grow flex flex-col group/link">
                    {/* Image Section */}
                    <div className="relative aspect-square overflow-hidden bg-slate-50/50 rounded-t-3xl">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-cover transition-transform duration-700 group-hover/link:scale-105 group-hover/link:opacity-90"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-200">
                          <ImageIcon className="h-16 w-16 mb-3 opacity-20" />
                          <span className="text-xs font-black uppercase tracking-widest opacity-40">Нет фото</span>
                        </div>
                      )}
                      
                      <div className="absolute top-6 left-6 flex flex-col gap-2">
                        {(product.is_hit || product.is_bestseller) && (
                          <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-none px-5 py-2 text-sm font-black rounded-full shadow-sm uppercase tracking-wider flex items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-500">
                            <Flame className="h-4 w-4 fill-current" />
                            Хит
                          </Badge>
                        )}
                        {product.is_new && (
                          <Badge className="bg-green-500 hover:bg-green-600 text-white border-none px-5 py-2 text-sm font-black rounded-full shadow-sm uppercase tracking-wider flex items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-700">
                            <Sparkles className="h-4 w-4 fill-current" />
                            Новинка
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Content Section */}
                    <CardHeader className="p-8 pb-4">
                      <CardTitle className="text-2xl font-black text-slate-900 line-clamp-2 group-hover/link:text-primary transition-colors leading-tight">
                        {product.name}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="px-8 py-0 flex-grow space-y-5">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-black text-slate-900 tracking-tighter">
                            {product.retail_price}
                          </span>
                          <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">BYN розница</span>
                        </div>
                        <div className="flex items-baseline gap-2 bg-primary/5 px-4 py-1.5 rounded-2xl border border-primary/10 w-fit">
                          <span className="text-xl font-black text-primary tracking-tighter">
                            {product.wholesale_price}
                          </span>
                          <span className="text-primary/40 font-black text-[10px] uppercase tracking-widest">BYN опт</span>
                        </div>
                      </div>
                      
                      <div className="h-px bg-slate-100 w-full" />
                      
                      <p className="text-slate-500 text-base font-medium line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {product.sizes?.slice(0, 3).map((size: string) => (
                          <span key={size} className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-black rounded-lg border border-slate-100 uppercase">
                            {size}
                          </span>
                        ))}
                        {product.sizes?.length > 3 && (
                          <span className="text-[10px] text-slate-300 font-black self-center uppercase">
                            +{product.sizes.length - 3} еще
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Link>

                  <CardFooter className="p-8 pt-6">
                    <AddToCart product={product} />
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination / Load More */}
            {hasMore && (
              <div className="flex justify-center pt-8">
                <Button 
                  asChild
                  variant="outline" 
                  className="h-20 px-12 rounded-[2rem] border-4 border-slate-100 font-black text-xl hover:bg-white hover:border-primary/20 hover:text-primary transition-all shadow-xl shadow-slate-200/50 group"
                >
                  <Link href={`/catalog?${new URLSearchParams({ ...params, limit: (limit + 12).toString() }).toString()}`} scroll={false}>
                    ПОКАЗАТЬ ЕЩЕ 12 ТОВАРОВ
                    <ChevronDown className="ml-3 h-6 w-6 group-hover:translate-y-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="mt-32 py-20 bg-slate-900 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-widest">ОЛТУОЛ — ВАШ НАДЕЖНЫЙ ПАРТНЕР</h2>
          <div className="w-24 h-2 bg-primary mx-auto rounded-full mb-8" />
          <p className="text-slate-400 text-lg font-medium">
            Лучшее качество на рынке ветеринарных изделий. <br />
            Работаем для вас и ваших пациентов.
          </p>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[120px] -z-0" />
      </footer>
    </div>
  )
}