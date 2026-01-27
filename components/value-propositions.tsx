import { Shield, Eye, Truck } from "lucide-react"

const values = [
  {
    icon: Shield,
    title: "Надежная фиксация",
    description:
      "Высококачественная липучка для быстрой и точной регулировки воротника на животном любого размера.",
  },
  {
    icon: Eye,
    title: "Прозрачность и комфорт",
    description:
      "Прочный полипропилен не загораживает обзор, снижая уровень стресса у животного во время восстановления.",
  },
  {
    icon: Truck,
    title: "B2B Условия",
    description:
      "Прямая доставка до дверей клиники и специальные оптовые цены без посредников.",
  },
]

export function ValuePropositions() {
  return (
    <section className="bg-secondary py-16 sm:py-24" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Почему клиники выбирают нас
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {values.map((value) => (
            <div
              key={value.title}
              className="bg-card rounded-3xl p-8 sm:p-10 shadow-sm border border-border/50 hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <value.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">
                {value.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
