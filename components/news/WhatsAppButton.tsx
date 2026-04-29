"use client"

import { useState, useEffect } from "react"
import { getContactInfo } from "@/lib/contact-store"
import { MessageCircle, X } from "lucide-react"

export default function WhatsAppButton() {
  const [info, setInfo] = useState(getContactInfo())
  const [tooltip, setTooltip] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setInfo(getContactInfo())
    const handler = () => setInfo(getContactInfo())
    window.addEventListener("contact-updated", handler)
    window.addEventListener("storage", handler)
    return () => {
      window.removeEventListener("contact-updated", handler)
      window.removeEventListener("storage", handler)
    }
  }, [])

  if (!mounted || !info.whatsappActivo || !info.whatsapp) return null

  const waUrl = `https://wa.me/${info.whatsapp}?text=${encodeURIComponent(info.whatsappMensaje)}`

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Tooltip / burbuja */}
      {tooltip && (
        <div className="relative bg-white dark:bg-card text-foreground text-xs font-semibold px-4 py-3 shadow-xl max-w-[200px] text-center leading-relaxed border border-border animate-in fade-in slide-in-from-bottom-2 duration-200">
          <button
            onClick={() => setTooltip(false)}
            className="absolute -top-2 -right-2 bg-muted text-muted-foreground rounded-full w-5 h-5 flex items-center justify-center hover:bg-destructive hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <X size={11} />
          </button>
          <p className="font-black text-sm text-[#25D366]">Escríbenos</p>
          <p className="text-muted-foreground mt-1">{info.whatsappMensaje}</p>
          {/* triangulo */}
          <span className="absolute -bottom-2 right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-border" />
        </div>
      )}

      {/* Boton principal */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#1ebe5a] hover:scale-110 transition-all duration-200 active:scale-95"
      >
        <MessageCircle size={28} fill="white" strokeWidth={1.5} />
      </a>

      {/* Pulso animado */}
      <span className="absolute bottom-0 right-0 w-14 h-14 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" />
    </div>
  )
}
