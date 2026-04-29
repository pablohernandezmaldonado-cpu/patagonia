"use client"

import { useState, useEffect } from "react"
import { ExternalLink, Facebook } from "lucide-react"
import { getActiveAds, type Anuncio } from "@/lib/ads-store"

// Tamaño visible del cuadro según configuración (siempre aspecto 1:1)
const TAMANO_CLASS: Record<Anuncio["tamano"], string> = {
  chico:   "w-36 h-36",
  mediano: "w-44 h-44",
  grande:  "w-52 h-52",
}

function AnuncioCard({ ad }: { ad: Anuncio }) {
  const isFacebook = ad.url?.includes("facebook.com")

  const card = (
    <div
      className={`
        group relative overflow-hidden border-2 border-border bg-card
        hover:border-news-red hover:shadow-lg transition-all duration-300
        ${TAMANO_CLASS[ad.tamano]} shrink-0
      `}
      role="complementary"
      aria-label={`Publicidad: ${ad.titulo}`}
    >
      {/* Imagen cuadrada 1:1 */}
      <div className="absolute inset-0">
        <img
          src={ad.imagen}
          alt={`Publicidad de ${ad.titulo}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            ;(e.target as HTMLImageElement).src =
              "https://placehold.co/1080x1080?text=Imagen+no+disponible"
          }}
        />
        {/* Overlay degradado en la parte inferior */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Contenido superpuesto al hover */}
      <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-white font-black text-[11px] uppercase tracking-wide leading-tight line-clamp-1">
          {ad.titulo}
        </p>
        <p className="text-white/80 text-[9px] leading-snug mt-0.5 line-clamp-2">
          {ad.descripcion}
        </p>
        {ad.url && (
          <div className="flex items-center gap-1 mt-1.5">
            {isFacebook ? <Facebook size={9} className="text-blue-300" /> : <ExternalLink size={9} className="text-white/70" />}
            <span className="text-[9px] text-white/70 font-semibold">
              {isFacebook ? "Ver en Facebook" : "Visitar sitio"}
            </span>
          </div>
        )}
      </div>

      {/* Etiqueta publicidad siempre visible */}
      <span className="absolute top-1 right-1 bg-black/60 text-white text-[7px] font-bold uppercase tracking-widest px-1.5 py-0.5">
        Publi
      </span>
    </div>
  )

  if (ad.url) {
    return (
      <a
        href={ad.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        aria-label={`Ir al sitio de ${ad.titulo}`}
      >
        {card}
      </a>
    )
  }

  return card
}

export default function PublicidadPanel() {
  const [ads, setAds] = useState<Anuncio[]>([])

  useEffect(() => {
    setAds(getActiveAds())
    // Escuchar cambios desde el admin en la misma pestaña
    const handler = () => setAds(getActiveAds())
    window.addEventListener("ads-updated", handler)
    window.addEventListener("storage", handler)
    return () => {
      window.removeEventListener("ads-updated", handler)
      window.removeEventListener("storage", handler)
    }
  }, [])

  if (ads.length === 0) return null

  return (
    <aside className="flex flex-col items-center gap-3" aria-label="Panel de publicidad">
      <div className="flex items-center gap-2 w-full">
        <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">
          Comerciales
        </span>
        <span className="flex-1 h-px bg-border" />
      </div>
      {ads.map((ad) => (
        <AnuncioCard key={ad.id} ad={ad} />
      ))}
    </aside>
  )
}
