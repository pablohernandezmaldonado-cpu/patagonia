"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Mic, Video, Play, Clock, User, ChevronRight, Plus } from "lucide-react"
import Header from "@/components/news/Header"
import Footer from "@/components/news/Footer"
import { getNews, type NewsItem, formatDate } from "@/lib/news-store"

// Placeholder video entries — ready for real videos in the future
const placeholderVideos = [
  {
    id: "v1",
    title: "Próximamente: Entrevista con el Seremi de Salud de Aysén",
    description: "Conversaremos sobre el plan de salud rural y los nuevos centros médicos en zonas aisladas de la región.",
    duration: "Próximamente",
    thumbnail: "https://placehold.co/640x360?text=Entrevista+Seremi+Salud+Aysen+estudio+television+microfono",
    upcoming: true,
  },
  {
    id: "v2",
    title: "Próximamente: Emprendedoras de la Patagonia — historias que inspiran",
    description: "Tres mujeres de Coyhaique cuentan cómo construyeron sus proyectos en uno de los territorios más desafiantes del país.",
    duration: "Próximamente",
    thumbnail: "https://placehold.co/640x360?text=Emprendedoras+Patagonia+mujeres+negocios+locales+Coyhaique",
    upcoming: true,
  },
  {
    id: "v3",
    title: "Próximamente: Carretera Austral — el sueño inconcluso",
    description: "Reportaje especial sobre el estado actual de la ruta y los desafíos de conectar la Patagonia.",
    duration: "Próximamente",
    thumbnail: "https://placehold.co/640x360?text=Carretera+Austral+reportaje+ruta+paisaje+montanas+patagonia",
    upcoming: true,
  },
]

export default function EntrevistasPage() {
  const [interviews, setInterviews] = useState<NewsItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const all = getNews()
    setInterviews(all.filter((n) => n.category === "ENTREVISTAS"))
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero banner */}
      <div className="bg-primary text-primary-foreground py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Mic size={28} className="text-news-red" />
            <h1 className="font-serif font-black text-3xl md:text-4xl tracking-tight">Entrevistas</h1>
          </div>
          <p className="text-primary-foreground/70 text-sm max-w-xl leading-relaxed">
            Conversaciones con las personas que construyen, piensan y transforman la Patagonia. Entrevistas en profundidad con autoridades, vecinos y referentes de la región.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">

        {/* Videos section — ready for future */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1.5 h-6 bg-news-red inline-block" />
            <Video size={18} className="text-news-red" />
            <h2 className="font-serif font-black text-lg uppercase tracking-widest">Video Entrevistas</h2>
            <span className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide border border-border px-2 py-1">
              Sección en construcción
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {placeholderVideos.map((video) => (
              <div key={video.id} className="group border border-border bg-card overflow-hidden">
                {/* Thumbnail */}
                <div className="relative overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-44 object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
                    <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white flex items-center justify-center backdrop-blur-sm">
                      <Play size={22} className="text-white ml-1" fill="white" />
                    </div>
                  </div>
                  {/* Upcoming badge */}
                  <span className="absolute top-0 left-0 bg-amber-600 text-white text-[9px] font-black px-2 py-1 uppercase tracking-widest">
                    Próximamente
                  </span>
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 flex items-center gap-1">
                    <Clock size={9} /> {video.duration}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-serif font-bold text-sm leading-snug line-clamp-2 text-foreground">
                    {video.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA to add videos in the future */}
          <div className="mt-4 border border-dashed border-border p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-secondary/30">
            <div>
              <p className="font-semibold text-sm text-foreground">¿Quieres publicar una video entrevista?</p>
              <p className="text-xs text-muted-foreground mt-1">
                La sección de videos estara disponible proximamente. Por ahora puedes subir tus entrevistas como noticias de texto.
              </p>
            </div>
            <Link
              href="/admin/nueva"
              className="shrink-0 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-news-red transition-colors"
            >
              <Plus size={14} /> Publicar Entrevista
            </Link>
          </div>
        </section>

        {/* Text interviews from news store */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1.5 h-6 bg-primary inline-block" />
            <Mic size={18} className="text-primary" />
            <h2 className="font-serif font-black text-lg uppercase tracking-widest">Entrevistas Publicadas</h2>
            <span className="flex-1 h-px bg-border" />
          </div>

          {!mounted ? (
            <p className="text-muted-foreground text-sm py-8 text-center">Cargando entrevistas...</p>
          ) : interviews.length === 0 ? (
            <div className="border border-dashed border-border py-16 text-center flex flex-col items-center gap-4">
              <Mic size={40} strokeWidth={1} className="text-muted-foreground" />
              <div>
                <p className="font-serif font-bold text-base text-foreground">Aun no hay entrevistas publicadas</p>
                <p className="text-xs text-muted-foreground mt-1">Publica la primera entrevista desde el panel de administracion.</p>
              </div>
              <Link
                href="/admin/nueva"
                className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-news-red transition-colors"
              >
                <Plus size={14} /> Nueva entrevista
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-0">
              {interviews.map((item, i) => (
                <Link
                  key={item.id}
                  href={`/noticia/${item.id}`}
                  className={`group flex gap-4 p-4 hover:bg-secondary/50 transition-colors border-b border-border ${i === 0 ? "border-t" : ""}`}
                >
                  <div className="shrink-0 w-32 h-24 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/320x240?text=Entrevista"
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-black bg-amber-600 text-white px-2 py-0.5 uppercase tracking-widest">
                        Entrevista
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-sm leading-snug group-hover:text-news-red transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1 leading-relaxed">{item.summary}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1"><User size={9} />{item.author}</span>
                      <span className="flex items-center gap-1"><Clock size={9} />{formatDate(item.date)}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="shrink-0 self-center text-muted-foreground group-hover:text-news-red transition-colors" />
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
