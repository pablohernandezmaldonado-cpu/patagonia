"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  getSocials, saveSocials, createSocial, updateSocial, deleteSocial,
  type RedSocial,
} from "@/lib/social-store"
import {
  Plus, Trash2, ChevronLeft, ChevronUp, ChevronDown,
  Facebook, Instagram, Youtube, Twitter, Globe, MessageCircle, Music2, ExternalLink,
  Save, X, ToggleLeft, ToggleRight,
} from "lucide-react"

const ICONOS: { value: RedSocial["icono"]; label: string; grupo: string }[] = [
  // Redes populares
  { value: "facebook",   label: "Facebook",    grupo: "Redes Populares" },
  { value: "instagram",  label: "Instagram",   grupo: "Redes Populares" },
  { value: "youtube",    label: "YouTube",     grupo: "Redes Populares" },
  { value: "twitter",    label: "Twitter / X", grupo: "Redes Populares" },
  { value: "tiktok",     label: "TikTok",      grupo: "Redes Populares" },
  { value: "threads",    label: "Threads",     grupo: "Redes Populares" },
  // Mensajeria
  { value: "whatsapp",   label: "WhatsApp",    grupo: "Mensajeria" },
  { value: "telegram",   label: "Telegram",    grupo: "Mensajeria" },
  { value: "snapchat",   label: "Snapchat",    grupo: "Mensajeria" },
  // Musica / Streaming
  { value: "spotify",    label: "Spotify",     grupo: "Musica y Streaming" },
  { value: "soundcloud", label: "SoundCloud",  grupo: "Musica y Streaming" },
  { value: "twitch",     label: "Twitch",      grupo: "Musica y Streaming" },
  // Profesional / Otro
  { value: "linkedin",   label: "LinkedIn",    grupo: "Profesional" },
  { value: "pinterest",  label: "Pinterest",   grupo: "Profesional" },
  { value: "web",        label: "Sitio Web",   grupo: "Otro" },
  { value: "otro",       label: "Otro",        grupo: "Otro" },
]

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

const COLOR_PREVIEW: Record<RedSocial["icono"], string> = {
  facebook:   "bg-[#1877F2]",
  instagram:  "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400",
  youtube:    "bg-[#FF0000]",
  twitter:    "bg-[#1DA1F2]",
  tiktok:     "bg-[#010101]",
  whatsapp:   "bg-[#25D366]",
  telegram:   "bg-[#2AABEE]",
  spotify:    "bg-[#1DB954]",
  linkedin:   "bg-[#0A66C2]",
  pinterest:  "bg-[#E60023]",
  twitch:     "bg-[#9146FF]",
  threads:    "bg-[#101010]",
  snapchat:   "bg-[#FFFC00] text-black",
  soundcloud: "bg-[#FF5500]",
  web:        "bg-primary",
  otro:       "bg-muted-foreground",
}

const EMPTY: Omit<RedSocial, "id"> = {
  nombre: "", url: "", icono: "facebook", activo: true, orden: 99,
}

export default function AdminRedesPage() {
  const [socials, setSocials] = useState<RedSocial[]>([])
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<RedSocial, "id">>(EMPTY)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { setSocials(getSocials()) }, [])

  function sorted() {
    return [...socials].sort((a, b) => a.orden - b.orden)
  }

  function openNew() {
    setEditId(null)
    setForm({ ...EMPTY, orden: socials.length + 1 })
    setShowForm(true)
  }

  function openEdit(red: RedSocial) {
    setEditId(red.id)
    setForm({ nombre: red.nombre, url: red.url, icono: red.icono, activo: red.activo, orden: red.orden })
    setShowForm(true)
  }

  function handleSave() {
    if (!form.nombre.trim() || !form.url.trim()) return
    if (editId) {
      updateSocial(editId, form)
    } else {
      createSocial(form)
    }
    setSocials(getSocials())
    setShowForm(false)
    setEditId(null)
  }

  function handleDelete(id: string) {
    deleteSocial(id)
    setSocials(getSocials())
    setDeleteId(null)
  }

  function handleToggle(id: string) {
    const red = socials.find((s) => s.id === id)
    if (!red) return
    updateSocial(id, { activo: !red.activo })
    setSocials(getSocials())
  }

  function moveUp(id: string) {
    const list = sorted()
    const idx = list.findIndex((s) => s.id === id)
    if (idx <= 0) return
    const updated = list.map((s, i) => {
      if (i === idx) return { ...s, orden: list[idx - 1].orden }
      if (i === idx - 1) return { ...s, orden: list[idx].orden }
      return s
    })
    saveSocials(updated)
    setSocials(updated)
  }

  function moveDown(id: string) {
    const list = sorted()
    const idx = list.findIndex((s) => s.id === id)
    if (idx >= list.length - 1) return
    const updated = list.map((s, i) => {
      if (i === idx) return { ...s, orden: list[idx + 1].orden }
      if (i === idx + 1) return { ...s, orden: list[idx].orden }
      return s
    })
    saveSocials(updated)
    setSocials(updated)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground shadow">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/api-attachments/qbX9m88wfpFbR3PGWuHbe-9RO2Fice8ftjgBtfnujeQlteUxBG4j.png"
              alt="Patagonia al Día"
              className="w-10 h-10 object-contain"
            />
            <div>
              <h1 className="font-serif font-black text-base leading-none">Patagonia al Día</h1>
              <p className="text-[10px] text-primary-foreground/60 uppercase tracking-widest">Gestionar Redes Sociales</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin" className="flex items-center gap-1 text-sm text-primary-foreground/70 hover:text-white transition-colors">
              <ChevronLeft size={15} /> Admin
            </Link>
            <button
              onClick={openNew}
              className="flex items-center gap-2 bg-news-red text-white px-4 py-2 font-bold text-sm hover:opacity-90 transition-opacity"
            >
              <Plus size={15} /> Agregar red
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Formulario */}
        {showForm && (
          <div className="bg-card border-2 border-primary p-6 shadow-lg">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-black text-lg font-serif">
                {editId ? "Editar red social" : "Nueva red social"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Nombre</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                  placeholder="Ej: Facebook Patagonia al Día"
                  className="border border-input px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Icono – grid visual */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Red social / Plataforma
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                  {ICONOS.map((op) => {
                    const I = ICON_MAP[op.value]
                    const selected = form.icono === op.value
                    return (
                      <button
                        key={op.value}
                        type="button"
                        title={op.label}
                        onClick={() => setForm((f) => ({ ...f, icono: op.value as RedSocial["icono"] }))}
                        className={`
                          flex flex-col items-center gap-1 p-2 border-2 transition-all
                          ${selected
                            ? "border-primary ring-2 ring-primary scale-105"
                            : "border-border hover:border-primary/40"
                          }
                        `}
                      >
                        <div className={`w-8 h-8 flex items-center justify-center text-white text-xs ${COLOR_PREVIEW[op.value]}`}>
                          <I size={16} />
                        </div>
                        <span className="text-[9px] font-bold text-muted-foreground truncate w-full text-center">
                          {op.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* URL */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">URL / Enlace</label>
                <input
                  type="url"
                  value={form.url}
                  onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                  placeholder="https://facebook.com/tupagina"
                  className="border border-input px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Orden */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Orden de aparicion</label>
                <input
                  type="number"
                  min={1}
                  value={form.orden}
                  onChange={(e) => setForm((f) => ({ ...f, orden: Number(e.target.value) }))}
                  className="border border-input px-3 py-2 text-sm bg-background w-24 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Preview */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Vista previa</label>
                {form.nombre && (
                  <div className={`flex items-center gap-2.5 px-3 py-2.5 text-white font-bold text-xs uppercase tracking-wide w-fit ${COLOR_PREVIEW[form.icono]}`}>
                    {(() => { const I = ICON_MAP[form.icono]; return <I size={15} /> })()}
                    <span>{form.nombre}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Activo toggle */}
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, activo: !f.activo }))}
                className={`flex items-center gap-2 text-sm font-bold transition-colors ${form.activo ? "text-primary" : "text-muted-foreground"}`}
              >
                {form.activo ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                {form.activo ? "Activo – visible en el portal" : "Inactivo – oculto en el portal"}
              </button>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={handleSave}
                disabled={!form.nombre.trim() || !form.url.trim()}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                <Save size={15} /> Guardar
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-2 border border-input text-sm font-bold text-muted-foreground hover:bg-secondary transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Lista */}
        <div className="bg-card border border-border overflow-hidden">
          <div className="bg-secondary px-4 py-3 border-b border-border">
            <h2 className="font-black text-sm uppercase tracking-widest">Redes configuradas ({sorted().length})</h2>
          </div>

          {sorted().length === 0 && (
            <div className="py-16 text-center text-muted-foreground text-sm">
              No hay redes sociales. Agrega la primera con el boton de arriba.
            </div>
          )}

          <div className="divide-y divide-border">
            {sorted().map((red, idx) => {
              const Icono = ICON_MAP[red.icono]
              return (
                <div key={red.id} className={`flex items-center gap-3 px-4 py-3 transition-colors ${!red.activo ? "opacity-50" : ""} hover:bg-secondary/40`}>

                  {/* Orden buttons */}
                  <div className="flex flex-col gap-0.5 shrink-0">
                    <button onClick={() => moveUp(red.id)} disabled={idx === 0} className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30">
                      <ChevronUp size={13} />
                    </button>
                    <button onClick={() => moveDown(red.id)} disabled={idx === sorted().length - 1} className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30">
                      <ChevronDown size={13} />
                    </button>
                  </div>

                  {/* Icono preview */}
                  <div className={`w-9 h-9 flex items-center justify-center text-white shrink-0 ${COLOR_PREVIEW[red.icono]}`}>
                    <Icono size={18} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{red.nombre}</p>
                    <a
                      href={red.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors truncate block"
                    >
                      {red.url}
                    </a>
                  </div>

                  {/* Estado */}
                  <span className={`text-[10px] font-bold px-2 py-0.5 uppercase shrink-0 ${red.activo ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {red.activo ? "Activo" : "Inactivo"}
                  </span>

                  {/* Acciones */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleToggle(red.id)}
                      title={red.activo ? "Desactivar" : "Activar"}
                      className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {red.activo ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                    </button>
                    <button
                      onClick={() => openEdit(red)}
                      title="Editar"
                      className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Save size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteId(red.id)}
                      title="Eliminar"
                      className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Modal eliminar */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-card border border-border p-6 max-w-sm w-full shadow-xl">
            <h2 className="font-serif font-black text-lg mb-2">Eliminar red social</h2>
            <p className="text-sm text-muted-foreground mb-5">Esta accion no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-destructive text-white py-2 font-bold text-sm hover:opacity-90">
                Eliminar
              </button>
              <button onClick={() => setDeleteId(null)} className="flex-1 bg-secondary text-secondary-foreground py-2 font-bold text-sm hover:opacity-90">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
