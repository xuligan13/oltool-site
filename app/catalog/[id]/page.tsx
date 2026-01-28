import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { AddToCart } from "@/components/cart/AddToCart"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Home, Package, ShieldCheck, Factory, Truck } from "lucide-react"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  const { data: product } = await supabase
    .from("products")
    .select("name")
    .eq("id", id)
    .single()

  if (!product) return { title: "Товар не найден" }

  return {
    title: `${product.name} | ОЛТУОЛ`,
    description: `Купить ${product.name} оптом от производителя ОЛТУОЛ в Беларуси.`,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single()

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Navigation / Breadcrumbs */}
      <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Link href="/" className="text-slate-400 hover:text-primary transition-colors">
            <Home className="h-5 w-5" />
          </Link>
          <ChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
          <Link href="/catalog" className="text-slate-400 hover:text-primary transition-colors font-bold whitespace-nowrap">
            Каталог
          </Link>
          <ChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
          <span className="text-slate-900 font-black truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Left Column: Image Area */}
          <div className="space-y-6">
            <div className="bg-white rounded-[3rem] p-12 flex items-center justify-center border-2 border-slate-50 aspect-square relative shadow-2xl shadow-slate-200/50 group overflow-hidden">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  priority
                  className="object-contain p-8 transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-200">
                  <Package className="h-32 w-32 mb-4 opacity-20" />
                  <span className="font-black uppercase tracking-widest opacity-40">Нет фото</span>
                </div>
              )}
              
              {product.is_bestseller && (
                <div className="absolute top-8 left-8">
                  <Badge className="bg-orange-500 text-white border-none px-6 py-2 text-sm font-black rounded-full shadow-xl uppercase tracking-wider">
                    ХИТ ПРОДАЖ
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Info Area */}
          <div className="space-y-10">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black text-primary tracking-tighter">
                  {product.retail_price}
                </span>
                <span className="text-slate-400 font-black text-xl uppercase">BYN</span>
              </div>
            </div>

            <div className="h-px bg-slate-200 w-full" />

            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">Описание товара</h3>
              <p className="text-xl text-slate-500 font-medium leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            {/* Specifications - Dynamically updated from DB */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Материал</p>
                  <p className="font-black text-slate-800">{product.material || "Полипропилен"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                  <Factory className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Производство</p>
                  <p className="font-black text-slate-800">{product.country || "Беларусь"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Тип</p>
                  <p className="font-black text-slate-800">{product.product_type || "Защитный воротник"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Доставка</p>
                  <p className="font-black text-slate-800">{product.delivery_info || "По всей Беларуси"}</p>
                </div>
              </div>
            </div>

            {/* Action Area */}
            <div className="pt-6">
              <AddToCart product={product} />
              <p className="mt-4 text-center text-slate-400 text-sm font-bold uppercase tracking-tighter">
                Настройте количество размеров после нажатия кнопки
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
