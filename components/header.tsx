import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { MobileMenu } from "./mobile-menu"

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20 relative">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
              ОЛТУОЛ
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#catalog"
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Каталог
            </a>
            <a
              href="#delivery"
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Доставка
            </a>
            <a
              href="#about"
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              О нас
            </a>
          </nav>

          {/* CTA & Mobile Menu */}
          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-6">
                <Download className="w-4 h-4 mr-2" />
                Скачать прайс-лист (PDF)
              </Button>
            </div>
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
