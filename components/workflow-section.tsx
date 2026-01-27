import { ClipboardList, FileText, Truck } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Выбор",
    description: "Выберите нужные размеры и количество воротников из каталога",
  },
  {
    number: "02",
    icon: FileText,
    title: "Счёт",
    description: "Получите счёт на оплату в течение нескольких часов",
  },
  {
    number: "03",
    icon: Truck,
    title: "Доставка",
    description: "Получите заказ прямо в вашу клинику в кратчайшие сроки",
  },
]

export function WorkflowSection() {
  return (
    <section className="bg-secondary py-16 sm:py-24" id="delivery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Как это работает
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Три простых шага до получения заказа
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connection line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-border" />
              )}

              <div className="bg-card rounded-3xl p-8 sm:p-10 text-center relative z-10 shadow-sm border border-border/50">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <span className="text-6xl font-bold text-primary/10 absolute top-4 right-6">
                  {step.number}
                </span>
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
