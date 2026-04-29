"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  getAds, saveAds, deleteAd, type Anuncio,
} from "@/lib/ads-store"
import {
  ChevronLeft, Plus, Trash2, Pencil, Eye, EyeOff,
  Upload, Trash, Facebook, ExternalLink, GripVertical, Check, X,
} from "lucide-react"

const TAMANO_LABELS: Record<Anuncio["tamano"], string> = {
  chico:   "Chico  (144×144 px visible)",
  mediano: "Mediano (176×176 px visible)",
  grande:  "Grande  (208×208 px visible)",
}

const EMPTY_AD: Omit<Anuncio, "id"> = {
  titulo: "",
  descripcion: "",
  imagen: "",
  url: "",
  orden: 99,
  activo: true,
  tamano: "mediano",
}

function ImageUploader({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const ref = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)
  const [mode, setMode] = useState<"upload" | "url">(value ? "url" : "upload")

  function handleFile(file: File | null) {
    if (!file || !file.type.startsWith("image/")) return
    const reader = new FileReader()
    reader.onload = (e) => onChange(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Mode tabs */}
      <div className="flex gap-1 text-xs">
        {(["upload", "url"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`px-3 py-1 font-bold border transition-colors ${
              mode === m
                ? "bg-primary text-primary-foreground border-primary"
                : "border-input text-muted-foreground hover:bg-secondary"
            }`}
          >
            {m === "upload" ? "Cargar archivo" : "Pegar URL"}
          </button>
        ))}
      </div>

      {mode === "upload" ? (
        <div
          onClick={() => ref.current?.click()}
          onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]) }}
          onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          className={`relative flex flex-col items-center justify-center cursor-pointer border-2 border-dashed transition-colors min-h-40 ${
            drag ? "border-primary bg-primary/5" : "border-input hover:border-primary hover:bg-secondary/40"
          }`}
        >
          <input
            ref={ref}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
          {value ? (
            <>
              {/* Preview 1:1 */}
              <img
                src={value}
                alt="Vista previa del anuncio"
                className="w-full max-h-64 object-cover"
              />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange("") }}
                className="absolute top-2 right-2 bg-destructive text-white p-1.5 rounded-full shadow hover:opacity-90"
                title="Quitar imagen"
              >
                <Trash size={13} />
              </button>
              <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[9px] px-2 py-0.5 font-bold uppercase tracking-widest">
                1080 × 1080 recomendado
              </span>
            </>
          ) : (
            <>
              <Upload size={28} className="text-muted-foreground mb-2" />
              <p className="text-sm font-bold">Haz clic o arrastra una imagen</p>
              <p className="text-xs text-muted-foreground mt-1">1080×1080 hasta 3000×3000 px — JPG, PNG, WEBP</p>
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://ejemplo.com/imagen.jpg"
            className="border border-input px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-full"
          />
          {value && (
            <div className="relative aspect-square w-full max-w-xs overflow-hidden border border-border">
              <img
                src={value}
                alt="Vista previa del anuncio"
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
              />
              <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-2 py-0.5 font-bold uppercase tracking-widest">
                Proporción 1:1
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function AdForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Omit<Anuncio, "id"> & { id?: string }
  onSave: (data: Omit<Anuncio, "id"> & { id?: string }) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState(initial)

  function set(k: keyof typeof form, v: unknown) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  function field(label: string, key: keyof typeof form, type = "text", placeholder = "") {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold uppercase tracking-wide text-foreground">{label}</label>
        <input
          type={type}
          value={String(form[key] ?? "")}
          onChange={(e) => set(key, e.target.value)}
          placeholder={placeholder}
          className="border border-input px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
    )
  }

  const isFacebook = form.url?.includes("facebook.com")

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSave(form) }}
      className="bg-card border border-border p-5 flex flex-col gap-4"
    >
      <h3 className="font-black font-serif text-lg">
        {form.id ? "Editar comercial" : "Nuevo comercial"}
      </h3>

      {field("Nombre del negocio *", "titulo", "text", "Ej: Ferretería Don Luis")}
      {field("Descripcion (se ve al pasar el mouse)", "descripcion", "text", "Slogan o breve descripcion")}

      {/* URL */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold uppercase tracking-wide text-foreground">
          Enlace (Facebook, Instagram, sitio web)
        </label>
        <div className="flex gap-2 items-center">
          {isFacebook
            ? <Facebook size={16} className="text-blue-600 shrink-0" />
            : <ExternalLink size={16} className="text-muted-foreground shrink-0" />
          }
          <input
            type="url"
            value={form.url}
            onChange={(e) => set("url", e.target.value)}
            placeholder="https://facebook.com/tu-pagina  o  https://tu-sitio.cl"
            className="flex-1 border border-input px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <p className="text-[10px] text-muted-foreground">
          Al hacer clic en el anuncio se redirigira a esta URL en una nueva pestaña.
        </p>
      </div>

      {/* Tamaño */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold uppercase tracking-wide text-foreground">Tamaño visible del cuadro</label>
        <div className="flex gap-2 flex-wrap">
          {(["chico", "mediano", "grande"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => set("tamano", t)}
              className={`px-3 py-2 text-xs font-bold border transition-colors ${
                form.tamano === t
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-input text-muted-foreground hover:bg-secondary"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground">
          La imagen siempre es 1:1 (1080×1080). El tamaño solo cambia cuanto espacio ocupa en pantalla.
        </p>
      </div>

      {/* Orden */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold uppercase tracking-wide text-foreground">Orden de aparicion (1 = primero)</label>
        <input
          type="number"
          min={1}
          value={form.orden}
          onChange={(e) => set("orden", Number(e.target.value))}
          className="border border-input px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-24"
        />
      </div>

      {/* Imagen */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold uppercase tracking-wide text-foreground">
          Imagen del anuncio (1080×1080 — hasta 3000×3000)
        </label>
        <ImageUploader value={form.imagen} onChange={(v) => set("imagen", v)} />
      </div>

      {/* Activo */}
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <div
          onClick={() => set("activo", !form.activo)}
          className={`w-10 h-5 rounded-full transition-colors relative ${form.activo ? "bg-primary" : "bg-input"}`}
        >
          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${form.activo ? "left-5" : "left-0.5"}`} />
        </div>
        <span className="text-sm font-bold">{form.activo ? "Anuncio activo (visible en el portal)" : "Anuncio inactivo (oculto)"}</span>
      </label>

      {/* Acciones */}
      <div className="flex gap-3 pt-2 border-t border-border">
        <button
          type="submit"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 font-bold text-sm hover:opacity-90 transition-opacity"
        >
          <Check size={15} />
          {form.id ? "Guardar cambios" : "Crear anuncio"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2 font-bold text-sm hover:opacity-90 transition-opacity"
        >
          <X size={15} />
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default function AdminComercialesPage() {
  const [ads, setAds] = useState<Anuncio[]>([])
  const [editing, setEditing] = useState<(Omit<Anuncio, "id"> & { id?: string }) | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    setAds(getAds().sort((a, b) => a.orden - b.orden))
  }, [])

  function refresh() {
    const updated = getAds().sort((a, b) => a.orden - b.orden)
    setAds(updated)
    window.dispatchEvent(new Event("ads-updated"))
  }

  function handleSave(data: Omit<Anuncio, "id"> & { id?: string }) {
    if (!data.titulo.trim()) return
    const all = getAds()
    if (data.id) {
      // update
      const next = all.map((a) => (a.id === data.id ? { ...a, ...data } as Anuncio : a))
      saveAds(next)
    } else {
      // create
      const newAd: Anuncio = { ...data, id: `ad-${Date.now()}` }
      saveAds([...all, newAd])
    }
    setEditing(null)
    refresh()
  }

  function handleDelete(id: string) {
    deleteAd(id)
    setDeleteId(null)
    refresh()
  }

  function toggleActive(id: string) {
    const all = getAds().map((a) => (a.id === id ? { ...a, activo: !a.activo } : a))
    saveAds(all)
    refresh()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground shadow">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/api-attachments/qbX9m88wfpFbR3PGWuHbe-9RO2Fice8ftjgBtfnujeQlteUxBG4j.png"
              alt="Patagonia al Día"
              className="w-10 h-10 object-contain"
            />
            <div>
              <h1 className="font-serif font-black text-lg leading-none">Comerciales</h1>
              <p className="text-[11px] text-primary-foreground/60 uppercase tracking-widest">
                Gestión de publicidad
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-sm text-primary-foreground/70 hover:text-white transition-colors"
            >
              <ChevronLeft size={16} />
              Admin
            </Link>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-primary-foreground/70 hover:text-white transition-colors"
            >
              Ver portal
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">

        {/* Accion principal */}
        {!editing && (
          <button
            onClick={() => setEditing({ ...EMPTY_AD, orden: ads.length + 1 })}
            className="flex items-center gap-2 self-start bg-news-red text-white px-5 py-2.5 font-bold text-sm hover:opacity-90 transition-opacity"
          >
            <Plus size={16} />
            Nuevo comercial
          </button>
        )}

        {/* Formulario */}
        {editing && (
          <AdForm
            initial={editing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        )}

        {/* Info tamaños */}
        <div className="bg-card border border-border p-4 text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground font-black uppercase tracking-wide">Formatos de imagen admitidos:</strong>
          {" "}Las imagenes deben tener proporcion <strong className="text-foreground">1:1 cuadrada</strong>.
          El tamaño recomendado es <strong className="text-foreground">1080 × 1080 px</strong>
          {" "}(Instagram estandar), con soporte hasta <strong className="text-foreground">3000 × 3000 px</strong>.
          El ajuste del tamano del cuadro controla solo cuanto espacio ocupa en pantalla, no modifica la imagen original.
        </div>

        {/* Lista de anuncios */}
        <div className="flex flex-col gap-3">
          <h2 className="font-black font-serif text-base uppercase tracking-wide">
            Anuncios activos ({ads.filter((a) => a.activo).length}) / Total ({ads.length})
          </h2>
          {ads.length === 0 && (
            <p className="text-sm text-muted-foreground py-6 text-center border border-dashed border-border">
              No hay anuncios creados. Haz clic en "Nuevo comercial" para empezar.
            </p>
          )}
          {ads.map((ad) => (
            <div
              key={ad.id}
              className={`bg-card border-2 flex gap-4 items-start p-4 transition-colors ${
                ad.activo ? "border-border" : "border-dashed border-border opacity-60"
              }`}
            >
              {/* Thumb cuadrado */}
              <div className="w-20 h-20 shrink-0 overflow-hidden border border-border bg-secondary">
                {ad.imagen ? (
                  <img
                    src={ad.imagen}
                    alt={`Imagen de ${ad.titulo}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px]">
                    Sin imagen
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-black text-sm">{ad.titulo || <em className="text-muted-foreground">Sin nombre</em>}</p>
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 ${ad.activo ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                    {ad.activo ? "Activo" : "Inactivo"}
                  </span>
                  <span className="text-[9px] font-bold uppercase px-2 py-0.5 bg-secondary text-muted-foreground">
                    {ad.tamano} · orden {ad.orden}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{ad.descripcion}</p>
                {ad.url && (
                  <a
                    href={ad.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] text-primary hover:underline mt-1 truncate"
                  >
                    {ad.url.includes("facebook.com")
                      ? <Facebook size={10} />
                      : <ExternalLink size={10} />
                    }
                    {ad.url}
                  </a>
                )}
              </div>

              {/* Acciones */}
              <div className="flex flex-col gap-1.5 shrink-0">
                <button
                  onClick={() => setEditing({ ...ad })}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-input hover:bg-secondary transition-colors"
                  title="Editar"
                >
                  <Pencil size={12} />
                  Editar
                </button>
                <button
                  onClick={() => toggleActive(ad.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-input hover:bg-secondary transition-colors"
                  title={ad.activo ? "Ocultar" : "Mostrar"}
                >
                  {ad.activo ? <EyeOff size={12} /> : <Eye size={12} />}
                  {ad.activo ? "Ocultar" : "Mostrar"}
                </button>
                <button
                  onClick={() => setDeleteId(ad.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-destructive/30 text-destructive hover:bg-destructive hover:text-white transition-colors"
                  title="Eliminar"
                >
                  <Trash2 size={12} />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de confirmacion */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-card border border-border p-6 max-w-sm w-full shadow-xl">
            <h2 className="font-serif font-black text-lg mb-2">Eliminar anuncio</h2>
            <p className="text-sm text-muted-foreground mb-5">
              Esta accion no se puede deshacer. El anuncio desaparecera del portal.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-destructive text-white py-2 font-bold text-sm hover:opacity-90 transition-opacity"
              >
                Eliminar
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 bg-secondary text-secondary-foreground py-2 font-bold text-sm hover:opacity-90 transition-opacity"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
