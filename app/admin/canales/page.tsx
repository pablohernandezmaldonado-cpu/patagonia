"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, Plus, Trash2, Save, Check, ToggleLeft, ToggleRight, Tv, ArrowUp, ArrowDown } from "lucide-react"
import { getCanales, saveCanales, type Canal } from "@/lib/canales-store"

const EMPTY: Omit<Canal, "id" | "orden"> = {
  nombre: "",
  descripcion: "",
  url: "",
  logoUrl: "",
  ciudad: "Nacional",
  activo: true,
}

export default function AdminCanalesPage() {
  const [canales, setCanales] = useState<Canal[]>([])
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Canal, "id" | "orden">>(EMPTY)
  const [saved, setSaved] = useState(false)
  const [logoFile, setLogoFile] = useState<string>("")

  useEffect(() => {
    setCanales(getCanales())
  }, [])

  function openNew() {
    setEditId("__new__")
    setForm(EMPTY)
    setLogoFile("")
  }

  function openEdit(canal: Canal) {
    setEditId(canal.id)
    setForm({
      nombre: canal.nombre,
      descripcion: canal.descripcion,
      url: canal.url,
      logoUrl: canal.logoUrl,
      ciudad: canal.ciudad,
      activo: canal.activo,
    })
    setLogoFile("")
  }

  function handleLogoFile(file: File | null) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      const img = new Image()
      img.onload = () => {
        const MAX = 400
        let { width, height } = img
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round((height * MAX) / width); width = MAX }
          else { width = Math.round((width * MAX) / height); height = MAX }
        }
        const canvas = document.createElement("canvas")
        canvas.width = width; canvas.height = height
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height)
        const compressed = canvas.toDataURL("image/png")
        setLogoFile(compressed)
        setForm(f => ({ ...f, logoUrl: compressed }))
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  }

  function handleSave() {
    let updated: Canal[]
    if (editId === "__new__") {
      const nuevo: Canal = {
        ...form,
        id: Date.now().toString(),
        orden: canales.length + 1,
      }
      updated = [...canales, nuevo]
    } else {
      updated = canales.map(c => c.id === editId ? { ...c, ...form } : c)
    }
    setCanales(updated)
    saveCanales(updated)
    setEditId(null)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function handleDelete(id: string) {
    const updated = canales.filter(c => c.id !== id)
    setCanales(updated)
    saveCanales(updated)
  }

  function toggleActivo(id: string) {
    const updated = canales.map(c => c.id === id ? { ...c, activo: !c.activo } : c)
    setCanales(updated)
    saveCanales(updated)
  }

  function moveUp(id: string) {
    const sorted = [...canales].sort((a, b) => a.orden - b.orden)
    const idx = sorted.findIndex(c => c.id === id)
    if (idx <= 0) return
    const updated = sorted.map((c, i) => {
      if (i === idx - 1) return { ...c, orden: idx + 1 }
      if (i === idx)     return { ...c, orden: idx }
      return c
    })
    setCanales(updated)
    saveCanales(updated)
  }

  function moveDown(id: string) {
    const sorted = [...canales].sort((a, b) => a.orden - b.orden)
    const idx = sorted.findIndex(c => c.id === id)
    if (idx >= sorted.length - 1) return
    const updated = sorted.map((c, i) => {
      if (i === idx)     return { ...c, orden: idx + 2 }
      if (i === idx + 1) return { ...c, orden: idx + 1 }
      return c
    })
    setCanales(updated)
    saveCanales(updated)
  }

  const sorted = [...canales].sort((a, b) => a.orden - b.orden)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Tv size={22} />
            <div>
              <h1 className="font-serif font-black text-lg leading-none">Canales en Vivo</h1>
              <p className="text-[11px] text-primary-foreground/60 uppercase tracking-widest">Panel de administracion</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="flex items-center gap-1 text-green-300 text-sm font-bold">
                <Check size={15} /> Guardado
              </span>
            )}
            <Link href="/admin" className="flex items-center gap-1.5 text-sm text-primary-foreground/70 hover:text-white transition-colors">
              <ChevronLeft size={16} /> Volver al Admin
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* Boton agregar */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {sorted.length} canal{sorted.length !== 1 ? "es" : ""} configurado{sorted.length !== 1 ? "s" : ""}
          </p>
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-news-red text-white px-4 py-2 font-bold text-sm hover:opacity-90 transition-opacity"
          >
            <Plus size={16} /> Agregar Canal
          </button>
        </div>

        {/* Formulario de nuevo / edicion */}
        {editId && (
          <div className="bg-card border-2 border-primary p-6 space-y-5">
            <h2 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
              <span className="w-1 h-4 bg-news-red inline-block" />
              {editId === "__new__" ? "Nuevo Canal" : "Editar Canal"}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Nombre del canal *</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                  placeholder="ej: TVN, Canal 13, Mega..."
                  className="border border-input px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Ciudad */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Region / Ciudad</label>
                <input
                  type="text"
                  value={form.ciudad}
                  onChange={e => setForm(f => ({ ...f, ciudad: e.target.value }))}
                  placeholder="ej: Nacional, Santiago, Punta Arenas..."
                  className="border border-input px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Descripcion */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Descripcion breve</label>
                <input
                  type="text"
                  value={form.descripcion}
                  onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                  placeholder="ej: Television Nacional de Chile en vivo..."
                  className="border border-input px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* URL */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Link al canal en vivo *</label>
                <input
                  type="url"
                  value={form.url}
                  onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                  placeholder="https://www.tvn.cl/envivo  o  https://youtube.com/watch?v=..."
                  className="border border-input px-3 py-2 text-sm bg-background font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-[10px] text-muted-foreground">Puede ser sitio web, YouTube, Twitch u otro enlace directo.</p>
              </div>

              {/* Logo */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Logo del canal</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => handleLogoFile(e.target.files?.[0] ?? null)}
                  className="border border-input px-3 py-2 text-sm bg-background file:mr-3 file:border-0 file:bg-primary file:text-primary-foreground file:px-3 file:py-1 file:text-xs file:font-bold file:cursor-pointer"
                />
                <p className="text-[10px] text-muted-foreground">O pega una URL de imagen:</p>
                <input
                  type="url"
                  value={logoFile ? "" : form.logoUrl}
                  onChange={e => { setLogoFile(""); setForm(f => ({ ...f, logoUrl: e.target.value })) }}
                  placeholder="https://ejemplo.com/logo.png"
                  className="border border-input px-3 py-2 text-sm bg-background font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Preview logo */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Vista previa</label>
                <div className="border border-border bg-black h-24 flex items-center justify-center">
                  {form.logoUrl ? (
                    <img src={form.logoUrl} alt="preview" className="max-h-full max-w-full object-contain p-2" />
                  ) : (
                    <span className="text-[10px] text-white/30 italic">Sin logo</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-border">
              <button
                onClick={handleSave}
                disabled={!form.nombre || !form.url}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Save size={15} /> Guardar Canal
              </button>
              <button
                onClick={() => setEditId(null)}
                className="px-4 py-2 border border-border text-sm font-semibold hover:bg-secondary transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Lista de canales */}
        <div className="space-y-2">
          {sorted.length === 0 && (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border">
              <Tv size={36} strokeWidth={1} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No hay canales. Agrega el primero con el boton de arriba.</p>
            </div>
          )}
          {sorted.map((canal, idx) => (
            <div
              key={canal.id}
              className={`flex items-center gap-3 p-3 border ${canal.activo ? "border-border bg-card" : "border-border/50 bg-card/50 opacity-60"}`}
            >
              {/* Logo miniatura */}
              <div className="w-16 h-11 bg-black flex items-center justify-center shrink-0 border border-border">
                {canal.logoUrl ? (
                  <img src={canal.logoUrl} alt={canal.nombre} className="max-h-full max-w-full object-contain p-1" />
                ) : (
                  <Tv size={16} className="text-muted-foreground" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm truncate">{canal.nombre}</p>
                <p className="text-[10px] text-muted-foreground truncate">{canal.descripcion}</p>
                <a href={canal.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline truncate block font-mono">
                  {canal.url}
                </a>
              </div>

              {/* Ciudad */}
              <span className="text-[10px] text-muted-foreground hidden sm:block px-2 py-1 bg-secondary shrink-0">
                {canal.ciudad}
              </span>

              {/* Orden */}
              <div className="flex flex-col gap-0.5 shrink-0">
                <button onClick={() => moveUp(canal.id)} disabled={idx === 0} className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors">
                  <ArrowUp size={13} />
                </button>
                <button onClick={() => moveDown(canal.id)} disabled={idx === sorted.length - 1} className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors">
                  <ArrowDown size={13} />
                </button>
              </div>

              {/* Toggle activo */}
              <button
                onClick={() => toggleActivo(canal.id)}
                title={canal.activo ? "Desactivar" : "Activar"}
                className={`shrink-0 transition-colors ${canal.activo ? "text-primary" : "text-muted-foreground"}`}
              >
                {canal.activo ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
              </button>

              {/* Editar */}
              <button
                onClick={() => openEdit(canal)}
                className="shrink-0 text-xs font-bold px-3 py-1.5 border border-border hover:border-primary hover:text-primary transition-colors"
              >
                Editar
              </button>

              {/* Eliminar */}
              <button
                onClick={() => handleDelete(canal.id)}
                className="shrink-0 text-destructive hover:opacity-70 transition-opacity"
                title="Eliminar canal"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Preview de como se ve */}
        {sorted.filter(c => c.activo).length > 0 && (
          <div className="bg-foreground text-background p-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-background/40 mb-4 flex items-center gap-2">
              <Tv size={12} /> Vista previa de la seccion en el portal
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {sorted.filter(c => c.activo).map(canal => (
                <div key={canal.id} className="flex flex-col items-center gap-2 p-2 bg-background/5 border border-background/10">
                  <div className="w-full aspect-video bg-black/30 flex items-center justify-center">
                    {canal.logoUrl
                      ? <img src={canal.logoUrl} alt={canal.nombre} className="max-h-full max-w-full object-contain p-1" />
                      : <Tv size={14} className="text-background/30" />
                    }
                  </div>
                  <p className="text-[10px] font-black text-background text-center truncate w-full">{canal.nombre}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
