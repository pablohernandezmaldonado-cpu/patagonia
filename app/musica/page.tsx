"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Header from "@/components/news/Header"
import Footer from "@/components/news/Footer"
import { getMusicaItems, type ItemMusica, TIPOS_MUSICA, GENEROS_MUSICA } from "@/lib/musica-store"
import { Music, Play, Radio, Mic2, Video, Newspaper, User, Clock, ChevronRight, Volume2, Pause } from "lucide-react"

const TIPO_ICONS: Record<ItemMusica["tipo"], React.ElementType> = {
  video:      Video,
  entrevista: Mic2,
  noticia:    Newspaper,
  artista:    User,
}

function TipoBadge({ tipo }: { tipo: ItemMusica["tipo"] }) {
  const t = TIPOS_MUSICA.find((x) => x.value === tipo)
  if (!t) return null
  return (
    <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 ${t.color}`}>
      {t.label}
    </span>
  )
}

function formatFecha(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" })
  } catch { return "" }
}

// Tarjeta para videos
function VideoCard({ item }: { item: ItemMusica }) {
  const [playing, setPlaying] = useState(false)
  const hasVideo = !!item.videoUrl

  return (
    <div className="bg-card border border-border overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-video bg-foreground/10">
        {hasVideo && playing ? (
          <iframe
            src={item.videoUrl.includes("youtube") || item.videoUrl.includes("youtu.be")
              ? item.videoUrl.replace("watch?v=", "embed/").replace("youtu.be/", "www.youtube.com/embed/") + "?autoplay=1"
              : item.videoUrl}
            className="w-full h-full"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        ) : (
          <>
            <img
              src={item.imageUrl || "https://placehold.co/800x450?text=Video+Musica+Patagonia"}
              alt={item.titulo}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <button
                onClick={() => setPlaying(true)}
                aria-label="Reproducir video"
                className="w-16 h-16 rounded-full bg-news-red text-white flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
              >
                <Play size={28} className="ml-1" />
              </button>
            </div>
            <div className="absolute top-2 left-2"><TipoBadge tipo={item.tipo} /></div>
            {item.duracion && (
              <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 flex items-center gap-1">
                <Clock size={10} />{item.duracion}
              </span>
            )}
          </>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1">{item.artista} &bull; {formatFecha(item.fecha)}</p>
        <h3 className="font-serif font-black text-base leading-snug line-clamp-2">{item.titulo}</h3>
        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">{item.descripcion}</p>
      </div>
    </div>
  )
}

// Tarjeta para noticias/entrevistas
function NoticiaCard({ item, onOpen }: { item: ItemMusica; onOpen: (i: ItemMusica) => void }) {
  return (
    <div
      className="flex gap-3 p-3 bg-card border border-border hover:border-primary transition-colors cursor-pointer"
      onClick={() => onOpen(item)}
    >
      <img
        src={item.imageUrl || "https://placehold.co/120x80?text=Musica+Patagonia"}
        alt={item.titulo}
        className="w-24 h-16 object-cover shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <TipoBadge tipo={item.tipo} />
          <span className="text-[10px] text-muted-foreground">{formatFecha(item.fecha)}</span>
        </div>
        <h3 className="font-bold text-sm leading-snug line-clamp-2">{item.titulo}</h3>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.descripcion}</p>
      </div>
    </div>
  )
}

// Tarjeta para artistas
function ArtistaCard({ item, activo, onToggle }: { item: ItemMusica; activo: boolean; onToggle: () => void }) {
  return (
    <div className={`bg-card border overflow-hidden transition-shadow hover:shadow-md ${activo ? "border-primary" : "border-border"}`}>
      <div className="relative">
        <img
          src={item.imageUrl || "https://placehold.co/300x300?text=Artista+Patagonia"}
          alt={item.titulo}
          className="w-full aspect-square object-cover"
        />
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${activo ? "opacity-100 bg-black/40" : "opacity-0 hover:opacity-100 bg-black/30"}`}>
          <button
            onClick={onToggle}
            aria-label={activo ? "Detener" : "Reproducir"}
            className="w-14 h-14 rounded-full bg-news-red text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
          >
            {activo ? <Pause size={20} /> : <Play size={22} className="ml-1" />}
          </button>
        </div>
        <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[9px] font-black px-2 py-0.5 uppercase">{item.genero}</span>
      </div>
      <div className="p-4">
        <h3 className="font-serif font-black text-base leading-snug">{item.titulo}</h3>
        <p className="text-sm font-semibold text-news-red mt-0.5">{item.artista}</p>
        <p className="text-xs text-muted-foreground">{item.album}{item.album && item.duracion && " · "}{item.duracion}</p>
        <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{item.descripcion}</p>
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
          {item.duracion && <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock size={11}/>{item.duracion}</span>}
          <button
            onClick={onToggle}
            className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-3 py-1.5 transition-colors ml-auto ${activo ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground"}`}
          >
            <Play size={11} />{activo ? "Reproduciendo..." : "Escuchar"}
          </button>
        </div>
        {activo && (
          <div className="mt-3 bg-primary/10 border border-primary/20 p-3">
            <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-news-red rounded-full w-1/3 animate-pulse" />
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 text-center">Reproductor de audio — próximamente</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Modal de lectura
function ModalNoticia({ item, onClose }: { item: ItemMusica; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <img src={item.imageUrl || "https://placehold.co/800x400?text=Musica+Patagonia"} alt={item.titulo} className="w-full h-52 object-cover" />
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <TipoBadge tipo={item.tipo} />
            <span className="text-xs text-muted-foreground">{item.autor} &bull; {formatFecha(item.fecha)}</span>
          </div>
          <h2 className="font-serif font-black text-2xl leading-tight mb-3">{item.titulo}</h2>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed italic">{item.descripcion}</p>
          {item.contenido && <p className="text-sm leading-relaxed text-foreground">{item.contenido}</p>}
          <button onClick={onClose} className="mt-6 px-5 py-2 bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MusicaPage() {
  const [items, setItems] = useState<ItemMusica[]>([])
  const [generoActivo, setGeneroActivo] = useState("Todos")
  const [cancionActiva, setCancionActiva] = useState<string | null>(null)
  const [modalItem, setModalItem] = useState<ItemMusica | null>(null)

  useEffect(() => {
    const load = () => setItems(getMusicaItems().filter((i) => i.activo))
    load()
    window.addEventListener("musica-updated", load)
    return () => window.removeEventListener("musica-updated", load)
  }, [])

  const videos     = items.filter((i) => i.tipo === "video")
  const entrevistas = items.filter((i) => i.tipo === "entrevista")
  const noticias   = items.filter((i) => i.tipo === "noticia")
  const artistas   = items.filter((i) => i.tipo === "artista")

  const generosDisponibles = ["Todos", ...Array.from(new Set(artistas.map((a) => a.genero).filter(Boolean)))]
  const artistasFiltrados  = generoActivo === "Todos" ? artistas : artistas.filter((a) => a.genero === generoActivo)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-1.5 h-8 bg-news-red inline-block" />
            <Music size={28} />
            <h1 className="font-serif font-black text-3xl md:text-4xl tracking-tight italic">
              Música Patagónica
            </h1>
          </div>
          <p className="text-primary-foreground/70 text-sm md:text-base max-w-2xl ml-7 leading-relaxed">
            Videos, entrevistas, noticias y artistas que nacen desde el corazón de la Patagonia Chilena.
          </p>
          <div className="flex items-center gap-3 mt-5 ml-7">
            <Link href="/admin/musica" className="text-[10px] text-primary-foreground/50 hover:text-primary-foreground transition-colors underline">
              Administrar contenido musical
            </Link>
          </div>
        </div>
      </section>
      <div className="h-1.5 bg-news-red w-full" />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-10 w-full space-y-14">

        {/* VIDEOS */}
        {videos.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-1.5 h-6 bg-red-600 inline-block" />
              <Video size={18} className="text-red-600" />
              <h2 className="font-serif font-black text-xl uppercase tracking-widest">Videos</h2>
              <span className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {videos.map((v) => <VideoCard key={v.id} item={v} />)}
            </div>
          </section>
        )}

        {/* ENTREVISTAS */}
        {entrevistas.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-1.5 h-6 bg-amber-600 inline-block" />
              <Mic2 size={18} className="text-amber-600" />
              <h2 className="font-serif font-black text-xl uppercase tracking-widest">Entrevistas</h2>
              <span className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {entrevistas.map((e) => <NoticiaCard key={e.id} item={e} onOpen={setModalItem} />)}
            </div>
          </section>
        )}

        {/* NOTICIAS DE MUSICA */}
        {noticias.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-1.5 h-6 bg-primary inline-block" />
              <Newspaper size={18} className="text-primary" />
              <h2 className="font-serif font-black text-xl uppercase tracking-widest">Noticias Musicales</h2>
              <span className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {noticias.map((n) => <NoticiaCard key={n.id} item={n} onOpen={setModalItem} />)}
            </div>
          </section>
        )}

        {/* ARTISTAS */}
        {artistas.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-1.5 h-6 bg-foreground inline-block" />
              <User size={18} />
              <h2 className="font-serif font-black text-xl uppercase tracking-widest">Artistas Locales</h2>
              <span className="flex-1 h-px bg-border" />
            </div>
            {/* Filtros de genero */}
            <div className="flex flex-wrap gap-2 mb-6">
              {generosDisponibles.map((g) => (
                <button
                  key={g}
                  onClick={() => setGeneroActivo(g)}
                  className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wide border transition-colors ${generoActivo === g ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}
                >
                  {g}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {artistasFiltrados.map((a) => (
                <ArtistaCard
                  key={a.id}
                  item={a}
                  activo={cancionActiva === a.id}
                  onToggle={() => setCancionActiva(cancionActiva === a.id ? null : a.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Si no hay contenido */}
        {items.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <Music size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-bold">Aun no hay contenido musical</p>
            <p className="text-sm mt-2">Ve al panel admin para agregar videos, entrevistas, noticias y artistas.</p>
            <Link href="/admin/musica" className="inline-block mt-4 bg-primary text-primary-foreground px-6 py-2 text-sm font-bold hover:opacity-90 transition-opacity">
              Administrar Música
            </Link>
          </div>
        )}

        {/* CTA radio */}
        <div className="bg-foreground text-background p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Radio size={40} className="text-news-red shrink-0" />
            <div>
              <h3 className="font-serif font-black text-xl">Radio Patagonia al Día</h3>
              <p className="text-background/65 text-sm mt-1">Próximamente: escucha nuestra radio online con música regional las 24 horas.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-black uppercase tracking-widest text-background/50 border border-background/20 px-4 py-2.5">En desarrollo</span>
            <Link href="/nosotros" className="flex items-center gap-2 bg-news-red text-white text-xs font-black uppercase tracking-widest px-5 py-2.5 hover:opacity-90 transition-opacity">
              Contáctanos <ChevronRight size={14} />
            </Link>
          </div>
        </div>

      </main>

      <Footer />

      {/* Modal lectura */}
      {modalItem && <ModalNoticia item={modalItem} onClose={() => setModalItem(null)} />}
    </div>
  )
}
