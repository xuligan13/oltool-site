import { Send, Phone, Mail } from "lucide-react"
import { siteConfig } from "@/lib/config"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          {/* Company Info */}
          <div>
            <span className="text-2xl font-bold tracking-tight">{siteConfig.name}</span>
            <p className="mt-4 text-background/70 leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="mt-6 space-y-2 text-sm text-background/60">
              <p>ООО «{siteConfig.name}»</p>
              <p>УНП: {siteConfig.contact.unp}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 uppercase tracking-wider text-xs opacity-50">Навигация</h4>
            <nav className="space-y-3">
              <Link
                href="/catalog"
                className="block text-background/70 hover:text-background transition-colors hover:translate-x-1 transform duration-200"
              >
                Каталог продукции
              </Link>
              <Link
                href="/"
                className="block text-background/70 hover:text-background transition-colors hover:translate-x-1 transform duration-200"
              >
                Главная страница
              </Link>
              <Link
                href="/admin"
                className="block text-background/70 hover:text-background transition-colors hover:translate-x-1 transform duration-200"
              >
                Панель управления
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4 uppercase tracking-wider text-xs opacity-50">Контакты</h4>
            <div className="space-y-4">
              <a
                href={siteConfig.contact.phone_link}
                className="flex items-center gap-3 text-background/70 hover:text-background transition-colors group"
              >
                <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>{siteConfig.contact.phone}</span>
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center gap-3 text-background/70 hover:text-background transition-colors group"
              >
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>{siteConfig.contact.email}</span>
              </a>
              <a
                href={siteConfig.links.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-background/70 hover:text-background transition-colors group"
              >
                <Send className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Telegram Канал</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/10 text-center text-background/30 text-xs">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. Все права защищены. Ветеринарное оборудование собственного производства.</p>
        </div>
      </div>
    </footer>
  )
}