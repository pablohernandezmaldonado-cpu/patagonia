"use client"

import { useState, useEffect } from "react"
import { getActiveSocials, type RedSocial } from "@/lib/social-store"
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Globe,
  MessageCircle,
  Music2,
  ExternalLink,
} from "lucide-react"

const ICON_MAP: Record<RedSocial["icono"], React.ElementType> = {
  facebook:   Facebook,
  instagram:  Instagram,
  youtube:    Youtube,
  twitter:    Twitter,
  tiktok:     Music2,
  whatsapp:   MessageCircle,
  telegram:   MessageCircle,
  spotify:    Music2,
  linkedin:   Globe,
  pinterest:  Globe,
  twitch:     Globe,
  threads:    Globe,
  snapchat:   Globe,
  soundcloud: Music2,
  web:        Globe,
  otro:       ExternalLink,
}

const COLOR_MAP: Record<RedSocial["icono"], string> = {
  facebook:   "bg-[#1877F2] hover:bg-[#1565d8]",
  instagram:  "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 hover:opacity-90",
  youtube:    "bg-[#FF0000] hover:bg-[#cc0000]",
  twitter:    "bg-[#1DA1F2] hover:bg-[#0d8fcf]",
  tiktok:     "bg-[#010101] hover:bg-[#222]",
  whatsapp:   "bg-[#25D366] hover:bg-[#1ebe5a]",
  telegram:   "bg-[#2AABEE] hover:bg-[#1a95d5]",
  spotify:    "bg-[#1DB954] hover:bg-[#17a348]",
  linkedin:   "bg-[#0A66C2] hover:bg-[#085299]",
  pinterest:  "bg-[#E60023] hover:bg-[#c4001e]",
  twitch:     "bg-[#9146FF] hover:bg-[#7b30f0]",
  threads:    "bg-[#101010] hover:bg-[#333]",
  snapchat:   "bg-[#FFFC00] hover:bg-[#e0de00] text-black",
  soundcloud: "bg-[#FF5500] hover:bg-[#e04c00]",
  web:        "bg-primary hover:opacity-90",
  otro:       "bg-muted-foreground hover:opacity-90",
}

export default function RedesSocialesPanel() {
  const [socials, setSocials] = useState<RedSocial[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setSocials(getActiveSocials())

    const handler = () => setSocials(getActiveSocials())
    window.addEventListener("socials-updated", handler)
    window.addEventListener("storage", handler)
    return () => {
      window.removeEventListener("socials-updated", handler)
      window.removeEventListener("storage", handler)
    }
  }, [])

  if (!mounted) return null

  return (
    <aside className="flex flex-col gap-2 mb-4" aria-label="Redes sociales">
      {/* Titulo */}
      <div className="flex items-center gap-2 w-full">
        <span className="w-1 h-4 bg-news-red inline-block shrink-0" />
        <span className="text-[9px] font-black uppercase tracking-widest text-foreground">
          Nuestras Redes
        </span>
        <span className="flex-1 h-px bg-border" />
      </div>

      {/* Botones de redes */}
      <div className="flex flex-col gap-1.5 w-full">
        {socials.length === 0 ? (
          <p className="text-[10px] text-muted-foreground italic px-1">
            Sin redes configuradas
          </p>
        ) : (
          socials.map((red) => {
            const Icono = ICON_MAP[red.icono]
            return (
              <a
                key={red.id}
                href={red.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Seguir en ${red.nombre}`}
                className={`
                  flex items-center gap-2 px-2.5 py-2 w-full rounded-sm
                  text-white font-bold text-[11px] uppercase tracking-wide
                  transition-all duration-150 hover:opacity-90 hover:-translate-y-px
                  ${COLOR_MAP[red.icono]}
                `}
              >
                <Icono size={15} className="shrink-0" />
                <span className="truncate">{red.nombre}</span>
              </a>
            )
          })
        )}
      </div>

      {/* Enlace al admin */}
      <a
        href="/admin/redes"
        className="text-[9px] text-muted-foreground hover:text-news-red transition-colors underline text-right mt-0.5"
      >
        Editar redes
      </a>
    </aside>
  )
}
