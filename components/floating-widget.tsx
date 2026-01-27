"use client"

import { useState } from "react"
import { MessageCircle, X, Send, Phone } from "lucide-react"
import { siteConfig } from "@/lib/config"

export function FloatingWidget() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-card rounded-2xl shadow-xl border border-border p-4 min-w-[200px] mb-2">
          <div className="space-y-3">
            <a
              href={siteConfig.links.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl bg-[#0088cc] text-white hover:bg-[#0088cc]/90 transition-colors"
            >
              <Send className="w-5 h-5" />
              <span className="font-medium">Telegram</span>
            </a>
            <a
              href={siteConfig.links.viber}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl bg-[#665CAC] text-white hover:bg-[#665CAC]/90 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span className="font-medium">Viber</span>
            </a>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Ответим в течение часа
          </p>
        </div>
      )}

      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        aria-label={isOpen ? "Закрыть меню" : "Открыть меню мессенджеров"}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>
    </div>
  )
}
