"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  ChevronLeft, Plus, Pencil, Trash2, Save, X,
  Video, Mic2, Newspaper, User, ToggleLeft, ToggleRight, Upload, ImageIcon
} from "lucide-react"
import {
  getMusicaItems, saveMusicaItems,
  type ItemMusica, type TipoMusica,
  TIPOS_MUSICA, GENEROS_MUSICA
} from "@/lib/musica-store"

const EMPTY: Omit<ItemMusica, "id"> = {
  tipo: "video",
  titulo: "",
  descripcion: "",
  contenido: "",
  autor: "",
  fecha: new Date().toISOString().slice(0, 16),
  imageUrl: "",
  videoUrl: "",
  genero: "Folclor",
  artista: "",
  album: "",
  duracion: "",
  activo: true,
}

const TIPO_ICONS: Record<TipoMusica, React.ElementType> = {
  video: Video, entrevista: Mic2, noticia: Newspaper, artista: User,
}

export default function AdminMusicaPage() {
  const [items, setItems] = useState<ItemMusica[]>([])
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<ItemMusica, "id">>(EMPTY)
  const [isNew, setIsNew] = useState(false)
  const [saved, setSaved] = useState(false)
  const [filtroTipo, setFiltroTipo] = useState<TipoMusica | "todos">("todos")
  const [imageMode, setImageMode] = useState<"upload" | "url">("upload")
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setItems(getMusicaItems())
  }, [])

  function field(key: keyof Omit<ItemMusica, "id">, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function handleFile(file: File | null) {
    if (!file || !file.type.startsWith("image/")) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      const img = new Image()
      img.onload = () => {
        const MAX = 1200
        let { width, height } = img
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round((height * MAX) / width); width = MAX }
          else { width = Math.round((width * MAX) / height); height = MAX }
        }
        const canvas = document.createElement("canvas")
        canvas.width = width; canvas.height = height
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height)
        field("imageUrl", canvas.toDataURL("image/jpeg", 0.80))
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  }

  function openNew() {
    setForm({ ...EMPTY, fecha: new Date().toISOString().slice(0, 16) })
    setEditId(null)
    setIsNew(true)
    setImageMode("upload")
  }

  function openEdit(item: ItemMusica) {
    const { id, ...rest } = item
    setForm({ ...rest, fecha: rest.fecha.slice(0, 16) })
    setEditId(id)
    setIsNew(false)
    setImageMode(rest.imageUrl.startsWith("data:") ? "upload" : "url")
  }

  function closeForm() {
    setEditId(null)
    setIsNew(false)
  }

  function handleSave() {
    if (!form.titulo.trim()) return
    let updated: ItemMusica[]
    if (isNew) {
      const newItem: ItemMusica = { ...form, id: crypto.randomUUID() }
      updated = [newItem, ...items]
    } else {
      updated = items.map((i) => i.id === editId ? { ...form, id: i.id } : i)
    }
    setItems(updated)
    saveMusicaItems(updated)
    closeForm()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function handleDelete(id: string) {
    if (!confirm("¿Eliminar este elemento?")) return
    const updated = items.filter((i) => i.id !== id)
    setItems(updated)
    saveMusicaItems(updated)
  }

  function toggleActivo(id: string) {
    const updated = items.map((i) => i.id === id ? { ...i, activo: !i.activo } : i)
    setItems(updated)
    saveMusicaItems(updated)
  }

  const filtrados = filtroTipo === "todos" ? items : items.filter((i) => i.tipo === filtroTipo)
  const showForm = isNew || !!editId

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/api-attachments/qbX9m88wfpFbR3PGWuHbe-9RO2Fice8ftjgBtfnujeQlteUxBG4j.png" alt="Logo" className="w-10 h-10 object-contain" />
          <div>
            <h1 className="font-serif font-black text-lg leading-none">Admin / Música</h1>
            <p className="text-primary-foreground/60 text-xs mt-0.5">Videos, entrevistas, noticias y artistas</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/musica" target="_blank" className="text-xs text-primary-foreground/70 hover:text-white transition-colors px-3 py-1.5 border border-white/20">
            Ver Música
          </Link>
          <Link href="/admin" className="flex items-center gap-1.5 text-xs text-primary-foreground/70 hover:text-white transition-colors">
            <ChevronLeft size={14} /> Volver al Admin
          </Link>
        </div>
      </div>
      <div className="h-1 bg-news-red" />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        {/* Guardado confirmacion */}
        {saved && (
          <div className="bg-primary/10 border border-primary text-primary px-4 py-3 text-sm font-bold flex items-center gap-2">
            Guardado correctamente
          </div>
        )}

        {/* Acciones */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-1.5 flex-wrap">
            {[{ value: "todos", label: "Todos" }, ...TIPOS_MUSICA.map((t) => ({ value: t.value, label: t.label }))].map((f) => (
              <button
                key={f.value}
                onClick={() => setFiltroTipo(f.value as TipoMusica | "todos")}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide border transition-colors ${filtroTipo === f.value ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary"}`}
              >
                {f.label} ({f.value === "todos" ? items.length : items.filter((i) => i.tipo === f.value).length})
              </button>
            ))}
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-news-red text-white px-4 py-2 font-bold text-sm hover:opacity-90 transition-opacity"
          >
            <Plus size={15} /> Nuevo contenido
          </button>
        </div>

        {/* FORMULARIO */}
        {showForm && (
          <div className="bg-card border border-border p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-base uppercase tracking-widest">
                {isNew ? "Nuevo contenido" : "Editar contenido"}
              </h2>
              <button onClick={closeForm} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>

            {/* Tipo */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tipo de contenido</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TIPOS_MUSICA.map((t) => {
                  const Icon = TIPO_ICONS[t.value]
                  const sel = form.tipo === t.value
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => field("tipo", t.value)}
                      className={`flex items-center gap-2 px-3 py-2.5 border-2 font-bold text-sm transition-all ${sel ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}
                    >
                      <Icon size={16} className={sel ? "text-primary" : "text-muted-foreground"} />
                      {t.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Titulo */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Titulo *</label>
                <input type="text" value={form.titulo} onChange={(e) => field("titulo", e.target.value)} placeholder="Titulo del contenido..." className="border border-input px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>

              {/* Descripcion */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Descripcion breve</label>
                <textarea value={form.descripcion} onChange={(e) => field("descripcion", e.target.value)} rows={2} placeholder="Resumen corto..." className="border border-input px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
              </div>

              {/* Contenido (solo para noticia/entrevista) */}
              {(form.tipo === "noticia" || form.tipo === "entrevista") && (
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Contenido completo</label>
                  <textarea value={form.contenido} onChange={(e) => field("contenido", e.target.value)} rows={6} placeholder="Texto completo de la noticia o entrevista..." className="border border-input px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-y" />
                </div>
              )}

              {/* URL de video (solo para video) */}
              {form.tipo === "video" && (
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">URL del video (YouTube, Vimeo o embed)</label>
                  <input type="url" value={form.videoUrl} onChange={(e) => field("videoUrl", e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="border border-input px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono" />
                  <p className="text-[10px] text-muted-foreground">Pega la URL de YouTube o Vimeo. El video se reproducirá directo en la página.</p>
                </div>
              )}

              {/* Artista / Album / Duracion (para artista) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Artista</label>
                <input type="text" value={form.artista} onChange={(e) => field("artista", e.target.value)} placeholder="Nombre del artista o banda" className="border border-input px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Genero</label>
                <select value={form.genero} onChange={(e) => field("genero", e.target.value)} className="border border-input px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                  {GENEROS_MUSICA.map((g) => <option key={g}>{g}</option>)}
                </select>
              </div>

              {form.tipo === "artista" && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Album</label>
                    <input type="text" value={form.album} onChange={(e) => field("album", e.target.value)} placeholder="Nombre del álbum" className="border border-input px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Duracion</label>
                    <input type="text" value={form.duracion} onChange={(e) => field("duracion", e.target.value)} placeholder="3:45" className="border border-input px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                </>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Autor / Redactor</label>
                <input type="text" value={form.autor} onChange={(e) => field("autor", e.target.value)} placeholder="Redaccion Música" className="border border-input px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Fecha</label>
                <input type="datetime-local" value={form.fecha} onChange={(e) => field("fecha", e.target.value)} className="border border-input px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>

            {/* Imagen */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Imagen</label>
                <div className="flex gap-1">
                  {(["upload", "url"] as const).map((m) => (
                    <button key={m} type="button" onClick={() => setImageMode(m)}
                      className={`px-3 py-1 text-xs font-bold border transition-colors ${imageMode === m ? "bg-primary text-primary-foreground border-primary" : "border-input text-muted-foreground hover:bg-secondary"}`}>
                      {m === "upload" ? "Cargar archivo" : "Pegar URL"}
                    </button>
                  ))}
                </div>
              </div>

              {imageMode === "upload" ? (
                <div
                  onClick={() => fileRef.current?.click()}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  className={`relative flex flex-col items-center justify-center gap-3 border-2 border-dashed cursor-pointer transition-colors min-h-[140px] ${dragOver ? "border-primary bg-primary/5" : "border-input hover:border-primary hover:bg-secondary/50"}`}
                >
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
                  {form.imageUrl ? (
                    <>
                      <img src={form.imageUrl} alt="Vista previa" className="w-full max-h-48 object-cover" />
                      <button type="button" onClick={(e) => { e.stopPropagation(); field("imageUrl", "") }}
                        className="absolute top-2 right-2 bg-destructive text-white p-1 rounded-full text-xs">
                        <X size={13} />
                      </button>
                    </>
                  ) : (
                    <>
                      <Upload size={28} className="text-muted-foreground" />
                      <p className="text-xs text-muted-foreground text-center">Haz clic o arrastra una imagen aqui</p>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex gap-2">
                  <input type="url" value={form.imageUrl} onChange={(e) => field("imageUrl", e.target.value)} placeholder="https://..." className="flex-1 border border-input px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                  {form.imageUrl && <button type="button" onClick={() => field("imageUrl", "")} className="px-3 border border-input text-muted-foreground hover:text-destructive"><X size={15} /></button>}
                </div>
              )}
              {imageMode === "url" && form.imageUrl && (
                <img src={form.imageUrl} alt="Vista previa" className="w-full max-h-40 object-cover border border-border" onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
              )}
            </div>

            {/* Activo */}
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => field("activo", !form.activo)} className={`transition-colors ${form.activo ? "text-primary" : "text-muted-foreground"}`}>
                {form.activo ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
              </button>
              <span className="text-sm font-semibold">{form.activo ? "Visible en el portal" : "Oculto (borrador)"}</span>
            </div>

            {/* Guardar */}
            <div className="flex gap-3 pt-2 border-t border-border">
              <button onClick={handleSave} disabled={!form.titulo.trim()}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-40">
                <Save size={15} /> Guardar
              </button>
              <button onClick={closeForm} className="px-5 py-2.5 border border-border text-sm font-semibold text-muted-foreground hover:text-foreground">
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* LISTA */}
        <div className="space-y-2">
          {filtrados.length === 0 && (
            <div className="text-center py-16 text-muted-foreground border border-dashed border-border">
              <p className="font-bold">No hay contenido de este tipo aun</p>
              <p className="text-sm mt-1">Haz clic en &ldquo;Nuevo contenido&rdquo; para agregar.</p>
            </div>
          )}
          {filtrados.map((item) => {
            const Icon = TIPO_ICONS[item.tipo]
            const t = TIPOS_MUSICA.find((x) => x.value === item.tipo)
            return (
              <div key={item.id} className={`flex items-center gap-3 p-3 bg-card border transition-colors ${item.activo ? "border-border" : "border-dashed border-border opacity-60"}`}>
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt="" className="w-16 h-12 object-cover shrink-0" />
                ) : (
                  <div className="w-16 h-12 bg-secondary flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[9px] font-black px-1.5 py-0.5 ${t?.color ?? ""}`}>{t?.label}</span>
                    {!item.activo && <span className="text-[9px] text-muted-foreground italic">Borrador</span>}
                  </div>
                  <p className="font-bold text-sm line-clamp-1">{item.titulo}</p>
                  <p className="text-xs text-muted-foreground">{item.artista && `${item.artista} · `}{new Date(item.fecha).toLocaleDateString("es-CL")}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button title={item.activo ? "Ocultar" : "Mostrar"} onClick={() => toggleActivo(item.id)} className={`p-1.5 transition-colors ${item.activo ? "text-primary" : "text-muted-foreground"}`}>
                    {item.activo ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                  </button>
                  <button title="Editar" onClick={() => openEdit(item)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                    <Pencil size={15} />
                  </button>
                  <button title="Eliminar" onClick={() => handleDelete(item.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
