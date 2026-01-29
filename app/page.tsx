import Link from "next/link"
import { Header } from "@/components/header"
import { ValuePropositions } from "@/components/value-propositions"
import { WorkflowSection } from "@/components/workflow-section"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Package, Star } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

export default async function Home() {
  // Fetch popular products for the "Popular" section
  const { data: popularProducts } = await supabase
    .from("products")
    .select("*")
    .eq("is_bestseller", true)
    .limit(3)

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-black uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <Star className="h-4 w-4 fill-current" />
              Производитель №1 в Беларуси
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
              ОЛТУОЛ — <br />
              <span className="text-primary">Ветеринарные воротники</span> оптом
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              Прямые поставки от производителя. <br />
              Лучшие цены, безупречное качество и быстрая доставка по всей стране.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
              <Button asChild size="lg" className="h-20 px-10 rounded-3xl text-xl font-black shadow-2xl shadow-primary/20 bg-primary text-white hover:scale-[1.02] active:scale-[0.98] transition-all">
                <Link href="/catalog" className="flex items-center gap-3">
                  ПЕРЕЙТИ В КАТАЛОГ
                  <ArrowRight className="h-6 w-6" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] bg-primary rounded-full blur-[120px]" />
        </div>
      </section>

      <ValuePropositions />

      {/* Popular Products Section */}
      {popularProducts && popularProducts.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase">Популярные модели</h2>
                <div className="w-20 h-2 bg-primary rounded-full" />
              </div>
              <Button asChild variant="ghost" className="text-lg font-black text-primary hover:bg-primary/5 rounded-2xl">
                <Link href="/catalog" className="flex items-center gap-2">
                  СМОТРЕТЬ ВСЕ <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {popularProducts.map((product) => (
                <Link key={product.id} href={`/catalog/${product.id}`} className="group relative block">
                  <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-slate-100 mb-6 shadow-xl shadow-slate-200/50 transition-all duration-500 group-hover:shadow-primary/20 group-hover:-translate-y-2">
                    {product.image_url ? (
                      <Image 
                        src={product.image_url} 
                        alt={product.name} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Package className="h-20 w-20 text-slate-200" />
                      </div>
                    )}
                    <div className="absolute top-6 left-6">
                      <Badge className="bg-orange-500 text-white border-none px-4 py-1.5 text-xs font-black rounded-full uppercase tracking-wider shadow-lg">ХИТ</Badge>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2 leading-none uppercase tracking-tight group-hover:text-primary transition-colors">{product.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-primary tracking-tighter">{product.retail_price}</span>
                    <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">BYN</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

            <WorkflowSection />

          </main>

        )

      }

      