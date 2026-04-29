"use client"

import { useEffect, useState } from "react"
import { Tv, ExternalLink, Radio } from "lucide-react"
import { getActiveCanales, type Canal } from "@/lib/canales-store"

export default function CanalesEnVivo() {
  const [canales, setCanales] = useState<Canal[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setCanales(getActiveCanales())
    const handler = () => setCanales(getActiveCanales())
    window.addEventListener("canales-updated", handler)
    window.addEventListener("storage", handler)
    return () => {
      window.removeEventListener("canales-updated", handler)
      window.removeEventListener("storage", handler)
    }
  }, [])

  if (!mounted || canales.length === 0) return null

  return (
    <section className="bg-foreground text-background py-10 mt-10" aria-label="Canales en vivo">
      {/* Franja roja superior */}
      <div className="h-1 bg-news-red w-full absolute" style={{ marginTop: "-40px" }} />

      <div className="max-w-7xl mx-auto px-4">
        {/* Cabecera de sección */}
        <div className="flex items-center gap-3 mb-7">
          <span className="w-1.5 h-7 bg-news-red inline-block shrink-0" />
          <div className="flex items-center gap-2">
            <Tv size={20} className="text-news-red" />
            <h2 className="font-serif font-black text-xl uppercase tracking-widest text-background">
              Canales en Vivo
            </h2>
          </div>
          {/* Indicador LIVE pulsante */}
          <div className="flex items-center gap-1.5 ml-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-red-400">En Vivo</span>
          </div>
          <span className="flex-1 h-px bg-background/10" />
          <span className="text-[10px] text-background/40 uppercase tracking-widest">
            Haz clic para ver
          </span>
        </div>

        {/* Grilla de canales */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {canales.map((canal) => (
            <a
              key={canal.id}
              href={canal.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ver ${canal.nombre} en vivo`}
              className="
                group flex flex-col items-center gap-3 p-4
                bg-background/5 border border-background/10
                hover:bg-background/15 hover:border-news-red/50
                transition-all duration-200 cursor-pointer
                hover:-translate-y-1 hover:shadow-lg hover:shadow-news-red/10
              "
            >
              {/* Logo / imagen del canal */}
              <div className="relative w-full aspect-video bg-black/30 overflow-hidden flex items-center justify-center">
                {canal.logoUrl ? (
                  <img
                    src={canal.logoUrl}
                    alt={`Logo ${canal.nombre}`}
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <Radio size={28} className="text-background/30" />
                )}
                {/* Overlay LIVE en la esquina */}
                <span className="absolute top-1 left-1 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 uppercase tracking-widest">
                  EN VIVO
                </span>
              </div>

              {/* Info */}
              <div className="text-center w-full">
                <p className="font-black text-sm text-background leading-tight truncate group-hover:text-news-red transition-colors">
                  {canal.nombre}
                </p>
                {canal.ciudad && (
                  <p className="text-[10px] text-background/40 uppercase tracking-widest mt-0.5 truncate">
                    {canal.ciudad}
                  </p>
                )}
                {canal.descripcion && (
                  <p className="text-[10px] text-background/50 mt-1 line-clamp-2 leading-tight">
                    {canal.descripcion}
                  </p>
                )}
              </div>

              {/* Boton VER */}
              <div className="flex items-center gap-1 bg-news-red/0 group-hover:bg-news-red px-3 py-1 transition-colors border border-background/20 group-hover:border-news-red w-full justify-center">
                <ExternalLink size={11} className="text-background/50 group-hover:text-white transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-widest text-background/50 group-hover:text-white transition-colors">
                  Ver Canal
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
