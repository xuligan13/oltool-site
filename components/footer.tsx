import { Send, Phone, Mail } from "lucide-react"
import { siteConfig } from "@/lib/config"

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
            <h4 className="font-semibold text-lg mb-4">Навигация</h4>
            <nav className="space-y-3">
              <a
                href="#catalog"
                className="block text-background/70 hover:text-background transition-colors"
              >
                Каталог
              </a>
              <a
                href="#delivery"
                className="block text-background/70 hover:text-background transition-colors"
              >
                Доставка
              </a>
              <a
                href="#about"
                className="block text-background/70 hover:text-background transition-colors"
              >
                О нас
              </a>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Контакты</h4>
            <div className="space-y-4">
              <a
                href={siteConfig.contact.phone_link}
                className="flex items-center gap-3 text-background/70 hover:text-background transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>{siteConfig.contact.phone}</span>
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center gap-3 text-background/70 hover:text-background transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>{siteConfig.contact.email}</span>
              </a>
              <a
                href={siteConfig.links.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-background/70 hover:text-background transition-colors"
              >
                <Send className="w-5 h-5" />
                <span>Telegram</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/20 text-center text-background/50 text-sm">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}
