import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { MobileMenu } from "./mobile-menu"
import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20 relative">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
            <span className="text-2xl lg:text-3xl font-black tracking-tighter text-slate-900 uppercase">
              ОЛТУОЛ
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            <Link
              href="/catalog"
              className="text-slate-500 hover:text-primary transition-colors font-bold text-sm uppercase tracking-widest"
            >
              Каталог
            </Link>
            <Link
              href="/#delivery"
              className="text-slate-500 hover:text-primary transition-colors font-bold text-sm uppercase tracking-widest"
            >
              Доставка
            </Link>
            <Link
              href="/#about"
              className="text-slate-500 hover:text-primary transition-colors font-bold text-sm uppercase tracking-widest"
            >
              О нас
            </Link>
          </nav>

          {/* CTA & Mobile Menu */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-8 h-12 font-black shadow-lg shadow-primary/10 transition-all active:scale-[0.98]">
                <Download className="w-4 h-4 mr-2" />
                ПРАЙС-ЛИСТ
              </Button>
            </div>
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  )
}