import { ProductCard } from "./ProductCard"
import { SkeletonCard } from "./skeleton-card"

const products = [
  {
    name: "Воротник защитный на липучке (Классик)",
    description: "Прозрачный пластик высокой прочности, легкая регулировка. Подходит для кошек и собак.",
    retailPrice: "12.00",
    wholesalePrice: "7.50",
    sizes: ["XS", "S", "M", "L", "XL"],
    imageUrl: "/placeholder.svg", // Placeholder image
    isBestseller: true
  },
  {
    name: "Воротник защитный (Пластик Плюс)",
    description: "Усиленная фиксация для крупных пород. Устойчив к активным нагрузкам.",
    retailPrice: "15.00",
    wholesalePrice: "9.80",
    sizes: ["L", "XL", "XXL"],
    imageUrl: "/placeholder.svg", // Placeholder image
    isBestseller: false
  }
]

export function ProductShowcase() {
  const isLoading = products.length === 0

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
          ) : (
            products.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))
          )}
        </div>
      </div>
    </section>
  )
}
