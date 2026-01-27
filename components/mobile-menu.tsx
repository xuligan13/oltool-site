"use client"

import { Button } from "@/components/ui/button"
import { Download, Menu, X } from "lucide-react"
import { useState } from "react"

export function MobileMenu() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="md:hidden p-2 text-muted-foreground hover:text-foreground"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label={mobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={mobileMenuOpen}
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-background/95 border-t border-border md:hidden">
            <div className="px-4 pt-2 pb-4">
                <nav className="flex flex-col gap-4">
                    <a
                        href="#catalog"
                        className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Каталог
                    </a>
                    <a
                        href="#delivery"
                        className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Доставка
                    </a>
                    <a
                        href="#about"
                        className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        О нас
                    </a>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl w-full mt-2">
                        <Download className="w-4 h-4 mr-2" />
                        Скачать прайс-лист (PDF)
                    </Button>
                </nav>
            </div>
        </div>
      )}
    </>
  )
}
