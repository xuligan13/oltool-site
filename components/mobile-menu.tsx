"use client"

import { Button } from "@/components/ui/button"
import { Download, Menu, X } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export function MobileMenu() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="md:hidden p-3 text-slate-500 hover:text-primary transition-colors bg-slate-50 rounded-xl"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label={mobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={mobileMenuOpen}
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t border-slate-100 md:hidden shadow-2xl animate-in slide-in-from-top-4 duration-300">
            <div className="px-6 pt-6 pb-10">
                <nav className="flex flex-col gap-6">
                    <Link
                        href="/catalog"
                        className="text-slate-900 hover:text-primary transition-colors font-black text-xl uppercase tracking-tighter"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Каталог продукции
                    </Link>
                    <Link
                        href="/#delivery"
                        className="text-slate-900 hover:text-primary transition-colors font-black text-xl uppercase tracking-tighter"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Условия доставки
                    </Link>
                    <Link
                        href="/#about"
                        className="text-slate-900 hover:text-primary transition-colors font-black text-xl uppercase tracking-tighter"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        О компании
                    </Link>
                    
                    <div className="h-px bg-slate-100 my-2" />
                    
                    <Button className="bg-primary hover:bg-primary/90 text-white rounded-2xl w-full h-16 text-lg font-black shadow-xl shadow-primary/10 transition-all active:scale-[0.98]">
                        <Download className="w-5 h-5 mr-2" />
                        СКАЧАТЬ ПРАЙС (PDF)
                    </Button>
                </nav>
            </div>
        </div>
      )}
    </>
  )
}