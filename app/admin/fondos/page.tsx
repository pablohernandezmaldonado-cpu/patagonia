"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ChevronLeft, Save, Check, Upload, Trash2, Eye, EyeOff } from "lucide-react"
import { getBgSections, saveBgSections, type BgSection } from "@/lib/bg-store"

export default function AdminFondosPage() {
  const [sections, setSections] = useState<BgSection[]>([])
  const [saved, setSaved] = useState(false)
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    setSections(getBgSections())
  }, [])

  function update(id: BgSection["id"], field: keyof BgSection, value: string | number | boolean) {
    setSections((prev) => prev.map((s) => s.id === id ? { ...s, [field]: value } : s))
  }

  function handleFile(id: BgSection["id"], file: File | null) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      // Comprimir/redimensionar antes de guardar para no superar limite de localStorage
      const img = new Image()
      img.onload = () => {
        const MAX = 1200 // max dimension en px
        let { width, height } = img
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round((height * MAX) / width); width = MAX }
          else { width = Math.round((width * MAX) / height); height = MAX }
        }
        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")!
        ctx.drawImage(img, 0, 0, width, height)
        const compressed = canvas.toDataURL("image/jpeg", 0.75) // calidad 75%
        update(id, "imageUrl", compressed)
        update(id, "activo", true)
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  }

  function handleSave() {
    saveBgSections(sections)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  function clearImage(id: BgSection["id"]) {
    update(id, "imageUrl", "")
    update(id, "activo", false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-foreground text-background px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-1.5 text-sm text-background/60 hover:text-white transition-colors">
            <ChevronLeft size={16} /> Admin
          </Link>
          <span className="text-background/30">/</span>
          <h1 className="font-black text-sm uppercase tracking-widest">Fondos de Pagina</h1>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2 font-bold text-sm transition-all ${
            saved ? "bg-green-600 text-white" : "bg-news-red text-white hover:opacity-90"
          }`}
        >
          {saved ? <><Check size={15} /> Guardado</> : <><Save size={15} /> Guardar cambios</>}
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <p className="text-sm text-muted-foreground">
          Carga una imagen de fondo para cada seccion. La imagen aparecera <strong>difuminada</strong> detras
          del contenido, respetando los colores de la paleta del sitio. Controla cuanto se ve con
          los controles de <strong>opacidad</strong> y <strong>desenfoque</strong>.
        </p>

        {sections.map((sec) => (
          <section key={sec.id} className="bg-card border border-border overflow-hidden">
            {/* Titulo seccion */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/30">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-5 inline-block ${sec.id === "hero" ? "bg-primary" : "bg-news-red"}`} />
                <h2 className="font-black text-sm uppercase tracking-widest">{sec.label}</h2>
              </div>
              <button
                type="button"
                onClick={() => update(sec.id, "activo", !sec.activo)}
                title={sec.activo ? "Desactivar fondo" : "Activar fondo"}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold border transition-colors ${
                  sec.activo
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-input text-muted-foreground hover:border-primary"
                }`}
              >
                {sec.activo ? <><Eye size={13} /> Activo</> : <><EyeOff size={13} /> Inactivo</>}
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Upload imagen */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Imagen de fondo (JPG, PNG, WEBP — hasta 3000x3000)
                </label>

                <input
                  ref={(el) => { fileRefs.current[sec.id] = el }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(sec.id, e.target.files?.[0] ?? null)}
                />

                {sec.imageUrl ? (
                  <div className="relative group">
                    {/* Preview con el efecto real */}
                    <div className="relative h-40 overflow-hidden border border-border">
                      <img
                        src={sec.imageUrl}
                        alt="Vista previa"
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ filter: `blur(${sec.blur}px)`, transform: "scale(1.08)", zIndex: 0 }}
                      />
                      <div
                        className="absolute inset-0 bg-background"
                        style={{ opacity: 1 - (sec.opacidad / 100), zIndex: 1 }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 2 }}>
                        <span className="text-foreground font-bold text-sm bg-card/80 px-4 py-2 backdrop-blur-sm">
                          Vista previa del efecto
                        </span>
                      </div>
                    </div>
                    {/* Botones sobre la imagen */}
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => fileRefs.current[sec.id]?.click()}
                        className="bg-foreground text-background px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 hover:opacity-90"
                      >
                        <Upload size={12} /> Cambiar
                      </button>
                      <button
                        type="button"
                        onClick={() => clearImage(sec.id)}
                        className="bg-destructive text-white px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 hover:opacity-90"
                      >
                        <Trash2 size={12} /> Quitar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileRefs.current[sec.id]?.click()}
                    className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-input hover:border-primary hover:bg-secondary/40 cursor-pointer transition-colors min-h-[120px]"
                  >
                    <Upload size={28} className="text-muted-foreground" />
                    <div className="text-center">
                      <p className="text-sm font-semibold text-foreground">Haz clic para subir imagen</p>
                      <p className="text-xs text-muted-foreground mt-0.5">o arrastra y suelta aqui</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Controles opacidad y blur */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Opacidad */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Visibilidad de la imagen
                    </label>
                    <span className="text-xs font-black text-primary">{sec.opacidad}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={60}
                    value={sec.opacidad}
                    onChange={(e) => update(sec.id, "opacidad", Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-[9px] text-muted-foreground">
                    <span>Muy sutil</span>
                    <span>Muy visible</span>
                  </div>
                </div>

                {/* Blur */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Nivel de desenfoque
                    </label>
                    <span className="text-xs font-black text-primary">{sec.blur}px</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={20}
                    value={sec.blur}
                    onChange={(e) => update(sec.id, "blur", Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-[9px] text-muted-foreground">
                    <span>Sin desenfoque</span>
                    <span>Muy difuminado</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Guardar */}
        <button
          onClick={handleSave}
          className={`w-full flex items-center justify-center gap-2 py-3 font-black text-sm transition-all ${
            saved ? "bg-green-600 text-white" : "bg-news-red text-white hover:opacity-90"
          }`}
        >
          {saved ? <><Check size={16} /> Cambios guardados</> : <><Save size={16} /> Guardar cambios</>}
        </button>
      </div>
    </div>
  )
}
