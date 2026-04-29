"use client"

import { useState, useRef } from "react"
import { type NewsItem, type Category, CATEGORIES } from "@/lib/news-store"
import { Save, X, Upload, ImageIcon, Trash2 } from "lucide-react"

interface NewsFormProps {
  initial?: Partial<NewsItem>
  onSave: (data: Omit<NewsItem, "id">) => void
  onCancel: () => void
  isEdit?: boolean
}

export default function NewsForm({ initial, onSave, onCancel, isEdit = false }: NewsFormProps) {
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    summary: initial?.summary ?? "",
    content: initial?.content ?? "",
    category: initial?.category ?? ("REGIONAL" as Category),
    author: initial?.author ?? "Redacción Patagonia",
    date: initial?.date ? new Date(initial.date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
    imageUrl: initial?.imageUrl ?? "",
    featured: initial?.featured ?? false,
    breaking: initial?.breaking ?? false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [imageMode, setImageMode] = useState<"upload" | "url">(initial?.imageUrl ? "url" : "upload")
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(file: File | null) {
    if (!file) return
    if (!file.type.startsWith("image/")) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setForm((f) => ({ ...f, imageUrl: result }))
    }
    reader.readAsDataURL(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleFileChange(file)
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.title.trim()) errs.title = "El título es obligatorio"
    if (!form.summary.trim()) errs.summary = "El resumen es obligatorio"
    if (!form.content.trim()) errs.content = "El contenido es obligatorio"
    if (!form.author.trim()) errs.author = "El autor es obligatorio"
    return errs
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    onSave({
      ...form,
      date: new Date(form.date).toISOString(),
      imageUrl:
        form.imageUrl.trim() ||
        `https://placehold.co/800x450?text=${encodeURIComponent(form.title.slice(0, 40))}`,
    })
  }

  function field(
    label: string,
    key: keyof typeof form,
    type: "text" | "textarea" | "select" | "datetime-local" | "checkbox" = "text",
    options?: string[],
  ) {
    const value = form[key]
    const error = errors[key]

    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-foreground">{label}</label>
        {type === "textarea" ? (
          <textarea
            value={value as string}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            rows={key === "content" ? 8 : 3}
            className={`border rounded px-3 py-2 text-sm resize-y bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${error ? "border-destructive" : "border-input"}`}
            placeholder={label}
          />
        ) : type === "select" ? (
          <select
            value={value as string}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value as Category }))}
            className="border border-input rounded px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : type === "checkbox" ? (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value as boolean}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))}
              className="w-4 h-4 accent-news-red"
            />
            <span className="text-sm text-muted-foreground">{label}</span>
          </label>
        ) : (
          <input
            type={type}
            value={value as string}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            className={`border rounded px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${error ? "border-destructive" : "border-input"}`}
            placeholder={label}
          />
        )}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {field("Título de la noticia *", "title")}
      {field("Resumen (máx. 2 líneas) *", "summary", "textarea")}
      {field("Contenido completo *", "content", "textarea")}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {field("Categoría", "category", "select", CATEGORIES)}
        {field("Autor", "author")}
      </div>

      {field("Fecha y hora de publicación", "date", "datetime-local")}

      {/* Imagen */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-foreground">Imagen de la noticia</label>
          <div className="flex gap-1 text-xs">
            <button
              type="button"
              onClick={() => setImageMode("upload")}
              className={`px-3 py-1 font-semibold border transition-colors ${imageMode === "upload" ? "bg-primary text-primary-foreground border-primary" : "border-input text-muted-foreground hover:bg-secondary"}`}
            >
              Cargar archivo
            </button>
            <button
              type="button"
              onClick={() => setImageMode("url")}
              className={`px-3 py-1 font-semibold border transition-colors ${imageMode === "url" ? "bg-primary text-primary-foreground border-primary" : "border-input text-muted-foreground hover:bg-secondary"}`}
            >
              Pegar URL
            </button>
          </div>
        </div>

        {imageMode === "upload" ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            className={`relative flex flex-col items-center justify-center gap-3 border-2 border-dashed cursor-pointer transition-colors min-h-[160px] ${
              dragOver ? "border-primary bg-primary/5" : "border-input hover:border-primary hover:bg-secondary/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
            />
            {form.imageUrl ? (
              <>
                <img
                  src={form.imageUrl}
                  alt="Vista previa"
                  className="w-full max-h-56 object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setForm((f) => ({ ...f, imageUrl: "" })) }}
                  className="absolute top-2 right-2 bg-destructive text-white p-1.5 rounded-full hover:opacity-90 transition-opacity shadow"
                  title="Quitar imagen"
                >
                  <Trash2 size={14} />
                </button>
              </>
            ) : (
              <>
                <Upload size={32} className="text-muted-foreground" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">Haz clic para seleccionar una imagen</p>
                  <p className="text-xs text-muted-foreground mt-1">o arrastra y suelta aqui</p>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP hasta 10 MB</p>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={form.imageUrl}
                onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                placeholder="https://ejemplo.com/imagen.jpg"
                className="flex-1 border border-input px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {form.imageUrl && (
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, imageUrl: "" }))}
                  className="px-3 py-2 bg-secondary border border-input text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
            {form.imageUrl && (
              <img
                src={form.imageUrl}
                alt="Vista previa"
                className="w-full max-h-48 object-cover border border-border"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
              />
            )}
            {!form.imageUrl && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground border border-input px-3 py-4 justify-center">
                <ImageIcon size={16} />
                <span>La imagen se generara automaticamente si este campo esta vacio</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
            className="w-4 h-4 accent-primary"
          />
          <span className="text-sm font-medium">Noticia destacada (portada)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.breaking}
            onChange={(e) => setForm((f) => ({ ...f, breaking: e.target.checked }))}
            className="w-4 h-4 accent-news-red"
          />
          <span className="text-sm font-medium text-news-red">Última Hora / Urgente</span>
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <Save size={16} />
          {isEdit ? "Guardar Cambios" : "Publicar Noticia"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2.5 rounded font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <X size={16} />
          Cancelar
        </button>
      </div>
    </form>
  )
}
