"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getNews, saveNews, type NewsItem, CATEGORY_COLORS, formatDate } from "@/lib/news-store"
import { Plus, Pencil, Trash2, Eye, ChevronLeft, Star, Zap, Tv, Music, Users, ImageIcon, Phone, Share2, Megaphone, KeyRound, Newspaper, Radio, Palette } from "lucide-react"
import { LogoutButton } from "@/components/news/AdminGuard"

const PANELS = [
  { href: "/admin/nueva",        label: "Nueva Noticia",     icon: Newspaper,  color: "bg-red-600"    },
  { href: "/admin/radio",        label: "Radio Online",      icon: Radio,      color: "bg-rose-800"   },
  { href: "/admin/colores",      label: "Paleta de Colores", icon: Palette,    color: "bg-indigo-700" },
  { href: "/admin/canales",      label: "Canales TV",        icon: Tv,         color: "bg-red-900"    },
  { href: "/admin/musica",       label: "Música",            icon: Music,      color: "bg-green-700"  },
  { href: "/admin/nosotros",     label: "Nosotros",          icon: Users,      color: "bg-zinc-600"   },
  { href: "/admin/fondos",       label: "Fondos",            icon: ImageIcon,  color: "bg-violet-700" },
  { href: "/admin/contacto",     label: "Contacto / Footer", icon: Phone,      color: "bg-teal-700"   },
  { href: "/admin/redes",        label: "Redes Sociales",    icon: Share2,     color: "bg-blue-700"   },
  { href: "/admin/comerciales",  label: "Comerciales",       icon: Megaphone,  color: "bg-amber-600"  },
  { href: "/admin/credenciales", label: "Cambiar Clave",     icon: KeyRound,   color: "bg-slate-600"  },
]

export default function AdminPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  useEffect(() => { setNews(getNews()) }, [])

  function handleDelete(id: string) {
    const updated = news.filter((n) => n.id !== id)
    setNews(updated)
    saveNews(updated)
    setDeleteId(null)
  }

  function toggleFeatured(id: string) {
    const updated = news.map((n) =>
      n.id === id ? { ...n, featured: !n.featured } : { ...n, featured: false }
    )
    setNews(updated)
    saveNews(updated)
  }

  function toggleBreaking(id: string) {
    const updated = news.map((n) => (n.id === id ? { ...n, breaking: !n.breaking } : n))
    setNews(updated)
    saveNews(updated)
  }

  const sorted = [...news]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .filter(
      (n) =>
        !search ||
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.category.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--background)" }}>

      {/* ── SIDEBAR IZQUIERDO ── */}
      <aside style={{
        width: "220px",
        flexShrink: 0,
        background: "#09090b",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        borderRight: "1px solid #27272a",
        overflowY: "auto",
      }}>
        {/* Logo */}
        <div style={{ padding: "16px", borderBottom: "1px solid #27272a", display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/api-attachments/qbX9m88wfpFbR3PGWuHbe-9RO2Fice8ftjgBtfnujeQlteUxBG4j.png"
            alt="Logo"
            style={{ width: 36, height: 36, objectFit: "contain" }}
          />
          <div>
            <p style={{ color: "#fff", fontWeight: 900, fontSize: 11, lineHeight: 1 }}>Patagonia al Día</p>
            <p style={{ color: "#71717a", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 2 }}>Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 3, padding: 8, flex: 1 }}>
          {PANELS.map(({ href, label, icon: Icon, color }) => (
            <Link
              key={href}
              href={href}
              className={`${color} flex items-center gap-2.5 px-3 py-2.5 text-white text-[11px] font-bold uppercase tracking-wide hover:opacity-80 transition-opacity`}
            >
              <Icon size={13} style={{ flexShrink: 0 }} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer sidebar */}
        <div style={{ borderTop: "1px solid #27272a", padding: 8 }}>
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={13} /> Ver Portal
          </Link>
          <div className="px-1 mt-1">
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Header */}
        <div className="bg-primary text-primary-foreground px-6 py-3 flex items-center justify-between shrink-0">
          <div>
            <h1 className="font-serif font-black text-base leading-none">Panel de Administración</h1>
            <p className="text-[10px] text-primary-foreground/60 uppercase tracking-widest mt-0.5">Gestión de noticias</p>
          </div>
          <Link
            href="/admin/nueva"
            className="flex items-center gap-1.5 bg-white text-primary px-3 py-1.5 text-xs font-black uppercase tracking-wide hover:opacity-90 transition-opacity"
          >
            <Plus size={13} /> Nueva Noticia
          </Link>
        </div>

        {/* Scroll area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total",      value: news.length,                                                                             color: "text-primary",    border: "border-primary/30"  },
              { label: "Urgente",    value: news.filter((n) => n.breaking).length,                                                   color: "text-red-500",    border: "border-red-300"     },
              { label: "Destacadas", value: news.filter((n) => n.featured).length,                                                   color: "text-yellow-600", border: "border-yellow-300"  },
              { label: "Hoy",        value: news.filter((n) => new Date(n.date).toDateString() === new Date().toDateString()).length, color: "text-green-600",  border: "border-green-300"   },
            ].map((s) => (
              <div key={s.label} className={`bg-card border-2 ${s.border} p-5 text-center`}>
                <p className={`text-4xl font-black font-serif ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1.5 uppercase tracking-widest font-semibold">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Buscador */}
          <div className="flex items-center gap-4 mb-5">
            <input
              type="search"
              placeholder="Buscar por titulo o categoria..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-input px-3 py-2 text-sm bg-background flex-1 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-sm text-muted-foreground whitespace-nowrap">{sorted.length} noticias</p>
          </div>

          {/* Tabla */}
          <div className="bg-card border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary text-secondary-foreground text-xs uppercase tracking-wide">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold">Noticia</th>
                    <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Categoria</th>
                    <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Fecha</th>
                    <th className="text-center px-4 py-3 font-semibold">Dest.</th>
                    <th className="text-center px-4 py-3 font-semibold">Urg.</th>
                    <th className="text-center px-4 py-3 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sorted.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-muted-foreground">
                        No hay noticias.{" "}
                        <Link href="/admin/nueva" className="text-primary underline">Crear la primera</Link>
                      </td>
                    </tr>
                  )}
                  {sorted.map((item) => (
                    <tr key={item.id} className="hover:bg-secondary/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-12 h-10 object-cover hidden sm:block shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold line-clamp-1 text-sm">{item.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{item.author}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`text-[10px] font-bold px-2 py-0.5 ${CATEGORY_COLORS[item.category]}`}>
                          {item.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                        {formatDate(item.date)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleFeatured(item.id)}
                          className={`p-1.5 transition-colors ${item.featured ? "text-yellow-500" : "text-muted-foreground hover:text-yellow-500"}`}
                        >
                          <Star size={16} fill={item.featured ? "currentColor" : "none"} />
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleBreaking(item.id)}
                          className={`p-1.5 transition-colors ${item.breaking ? "text-red-500" : "text-muted-foreground hover:text-red-500"}`}
                        >
                          <Zap size={16} fill={item.breaking ? "currentColor" : "none"} />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <Link href={`/noticia/${item.id}`} className="p-1.5 text-muted-foreground hover:text-primary transition-colors" title="Ver">
                            <Eye size={15} />
                          </Link>
                          <Link href={`/admin/editar/${item.id}`} className="p-1.5 text-muted-foreground hover:text-primary transition-colors" title="Editar">
                            <Pencil size={15} />
                          </Link>
                          <button onClick={() => setDeleteId(item.id)} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors" title="Eliminar">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* Modal eliminar */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-card border border-border p-6 max-w-sm w-full shadow-xl">
            <h2 className="font-serif font-black text-lg mb-2">Eliminar noticia</h2>
            <p className="text-sm text-muted-foreground mb-5">Esta accion no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-600 text-white py-2 font-semibold text-sm hover:opacity-90 transition-opacity">
                Si, eliminar
              </button>
              <button onClick={() => setDeleteId(null)} className="flex-1 bg-secondary text-secondary-foreground py-2 font-semibold text-sm hover:opacity-90 transition-opacity">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
