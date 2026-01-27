import { Button } from "@/components/ui/button"
import { ArrowRight, MessageCircle } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance leading-tight">
            ОЛТУОЛ — Прямые поставки ветеринарных воротников по всей Беларуси
          </h1>
          <p className="mt-6 sm:mt-8 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Профессиональная защита для пациентов клиник. Прочный прозрачный
            пластик, удобные и прочные липучки для надежной фиксации и полная размерная сетка от XS до XL.
          </p>
          <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-8 py-6 text-lg w-full sm:w-auto"
            >
              Открыть каталог
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-2xl px-8 py-6 text-lg border-2 border-foreground/20 hover:bg-secondary w-full sm:w-auto bg-transparent text-foreground"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Связаться в мессенджере
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>
    </section>
  )
}
