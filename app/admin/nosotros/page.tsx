"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ChevronLeft, Save, Check, Plus, Trash2, ToggleLeft, ToggleRight, Upload } from "lucide-react"
import { getNosotrosInfo, saveNosotrosInfo, type NosotrosInfo, type TeamMember, type NosotrosStat, type NosotrosValue } from "@/lib/nosotros-store"

type Section = "hero" | "historia" | "mision" | "stats" | "valores" | "equipo"

const SECTIONS: { id: Section; label: string; color: string }[] = [
  { id: "hero",     label: "Hero / Encabezado",   color: "bg-primary" },
  { id: "historia", label: "Historia",             color: "bg-foreground" },
  { id: "mision",   label: "Misión y Visión",      color: "bg-news-red" },
  { id: "stats",    label: "Estadísticas",         color: "bg-amber-600" },
  { id: "valores",  label: "Valores",              color: "bg-blue-600" },
  { id: "equipo",   label: "Equipo",               color: "bg-violet-600" },
]

export default function AdminNosotrosPage() {
  const [form, setForm] = useState<NosotrosInfo>(() => getNosotrosInfo())
  const [saved, setSaved] = useState(false)
  const [active, setActive] = useState<Section>("hero")
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => { setForm(getNosotrosInfo()) }, [])

  function set(field: keyof NosotrosInfo, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function handleSave() {
    saveNosotrosInfo(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  // Stats
  function addStat() {
    const s: NosotrosStat = { id: Date.now().toString(), value: "", label: "", activo: true }
    setForm(f => ({ ...f, stats: [...f.stats, s] }))
  }
  function updateStat(id: string, field: keyof NosotrosStat, val: string | boolean) {
    setForm(f => ({ ...f, stats: f.stats.map(s => s.id === id ? { ...s, [field]: val } : s) }))
  }
  function removeStat(id: string) {
    setForm(f => ({ ...f, stats: f.stats.filter(s => s.id !== id) }))
  }

  // Valores
  function addValue() {
    const v: NosotrosValue = { id: Date.now().toString(), title: "", description: "", activo: true }
    setForm(f => ({ ...f, values: [...f.values, v] }))
  }
  function updateValue(id: string, field: keyof NosotrosValue, val: string | boolean) {
    setForm(f => ({ ...f, values: f.values.map(v => v.id === id ? { ...v, [field]: val } : v) }))
  }
  function removeValue(id: string) {
    setForm(f => ({ ...f, values: f.values.filter(v => v.id !== id) }))
  }

  // Equipo
  function addMember() {
    const m: TeamMember = { id: Date.now().toString(), name: "", role: "", description: "", img: "", activo: true }
    setForm(f => ({ ...f, team: [...f.team, m] }))
  }
  function updateMember(id: string, field: keyof TeamMember, val: string | boolean) {
    setForm(f => ({ ...f, team: f.team.map(m => m.id === id ? { ...m, [field]: val } : m) }))
  }
  function removeMember(id: string) {
    setForm(f => ({ ...f, team: f.team.filter(m => m.id !== id) }))
  }
  function handleMemberPhoto(id: string, file: File | null) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const MAX = 400
        let { width, height } = img
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round(height * MAX / width); width = MAX }
          else { width = Math.round(width * MAX / height); height = MAX }
        }
        const canvas = document.createElement("canvas")
        canvas.width = width; canvas.height = height
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height)
        updateMember(id, "img", canvas.toDataURL("image/jpeg", 0.8))
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const inputCls = "w-full border border-input px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
  const labelCls = "block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-foreground text-background shadow sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-1.5 text-sm text-background/70 hover:text-white transition-colors">
              <ChevronLeft size={16} /> Admin
            </Link>
            <span className="text-background/30">/</span>
            <h1 className="font-black text-sm uppercase tracking-widest">Editar Nosotros</h1>
          </div>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2 font-black text-sm uppercase tracking-widest transition-all ${saved ? "bg-green-600 text-white" : "bg-news-red text-white hover:opacity-90"}`}
          >
            {saved ? <><Check size={15} /> Guardado</> : <><Save size={15} /> Guardar cambios</>}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 flex gap-6">

        {/* Sidebar de secciones */}
        <aside className="hidden md:flex flex-col gap-1 w-48 shrink-0 sticky top-20 self-start">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`text-left px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-all ${active === s.id ? `${s.color} text-white` : "bg-secondary text-muted-foreground hover:bg-card hover:text-foreground"}`}
            >
              {s.label}
            </button>
          ))}
        </aside>

        {/* Contenido editable */}
        <div className="flex-1 min-w-0 space-y-6">

          {/* Selector móvil */}
          <select
            className="md:hidden w-full border border-input px-3 py-2 text-sm bg-background font-bold"
            value={active}
            onChange={e => setActive(e.target.value as Section)}
          >
            {SECTIONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>

          {/* HERO */}
          {active === "hero" && (
            <section className="bg-card border border-border p-6 space-y-4">
              <SectionHeader color="bg-primary" label="Hero / Encabezado" />
              <div><label className={labelCls}>Subtítulo pequeño</label><input className={inputCls} value={form.heroSubtitle} onChange={e => set("heroSubtitle", e.target.value)} /></div>
              <div><label className={labelCls}>Título principal</label><input className={inputCls} value={form.heroTitle} onChange={e => set("heroTitle", e.target.value)} /></div>
              <div><label className={labelCls}>Descripción</label><textarea className={inputCls} rows={3} value={form.heroDescription} onChange={e => set("heroDescription", e.target.value)} /></div>
            </section>
          )}

          {/* HISTORIA */}
          {active === "historia" && (
            <section className="bg-card border border-border p-6 space-y-4">
              <SectionHeader color="bg-foreground" label="Historia del Portal" />
              <div><label className={labelCls}>Título de la historia</label><input className={inputCls} value={form.historiaTitle} onChange={e => set("historiaTitle", e.target.value)} /></div>
              <div><label className={labelCls}>Texto 1</label><textarea className={inputCls} rows={4} value={form.historiaTexto1} onChange={e => set("historiaTexto1", e.target.value)} /></div>
              <div><label className={labelCls}>Texto 2</label><textarea className={inputCls} rows={4} value={form.historiaTexto2} onChange={e => set("historiaTexto2", e.target.value)} /></div>
              <div><label className={labelCls}>Texto 3</label><textarea className={inputCls} rows={4} value={form.historiaTexto3} onChange={e => set("historiaTexto3", e.target.value)} /></div>
              <div><label className={labelCls}>Etiqueta "Desde" (ej: Desde 2019)</label><input className={inputCls} value={form.historiaDesde} onChange={e => set("historiaDesde", e.target.value)} /></div>
            </section>
          )}

          {/* MISION / VISION */}
          {active === "mision" && (
            <section className="bg-card border border-border p-6 space-y-4">
              <SectionHeader color="bg-news-red" label="Misión y Visión" />
              <div><label className={labelCls}>Texto de la Misión</label><textarea className={inputCls} rows={5} value={form.misionTexto} onChange={e => set("misionTexto", e.target.value)} /></div>
              <div><label className={labelCls}>Texto de la Visión</label><textarea className={inputCls} rows={5} value={form.visionTexto} onChange={e => set("visionTexto", e.target.value)} /></div>
            </section>
          )}

          {/* STATS */}
          {active === "stats" && (
            <section className="bg-card border border-border p-6 space-y-4">
              <SectionHeader color="bg-amber-600" label="Estadísticas (barra naranja)" />
              <div className="space-y-3">
                {form.stats.map((s, i) => (
                  <div key={s.id} className="flex items-center gap-2 p-3 bg-secondary/40 border border-border">
                    <span className="text-xs font-black text-muted-foreground w-4 shrink-0">{i + 1}</span>
                    <input className="flex-1 border border-input px-2 py-1.5 text-sm bg-background text-center font-black focus:outline-none focus:ring-1 focus:ring-primary" value={s.value} onChange={e => updateStat(s.id, "value", e.target.value)} placeholder="15K+" />
                    <input className="flex-1 border border-input px-2 py-1.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary" value={s.label} onChange={e => updateStat(s.id, "label", e.target.value)} placeholder="Lectores mensuales" />
                    <button type="button" onClick={() => updateStat(s.id, "activo", !s.activo)} className={s.activo ? "text-primary" : "text-muted-foreground"}>
                      {s.activo ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                    </button>
                    <button type="button" onClick={() => removeStat(s.id)} className="text-destructive hover:opacity-70"><Trash2 size={15} /></button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addStat} className="flex items-center gap-2 w-full justify-center py-2 border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors font-semibold">
                <Plus size={15} /> Agregar estadística
              </button>
            </section>
          )}

          {/* VALORES */}
          {active === "valores" && (
            <section className="bg-card border border-border p-6 space-y-4">
              <SectionHeader color="bg-blue-600" label="Valores del portal" />
              <div className="space-y-4">
                {form.values.map((v, i) => (
                  <div key={v.id} className="p-4 bg-secondary/40 border border-border space-y-2">
                    <div className="flex items-center gap-2 justify-between">
                      <span className="text-xs font-black text-muted-foreground">Valor {i + 1}</span>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => updateValue(v.id, "activo", !v.activo)} className={v.activo ? "text-primary" : "text-muted-foreground"}>
                          {v.activo ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                        </button>
                        <button type="button" onClick={() => removeValue(v.id)} className="text-destructive hover:opacity-70"><Trash2 size={15} /></button>
                      </div>
                    </div>
                    <input className={inputCls} value={v.title} onChange={e => updateValue(v.id, "title", e.target.value)} placeholder="Nombre del valor" />
                    <textarea className={inputCls} rows={2} value={v.description} onChange={e => updateValue(v.id, "description", e.target.value)} placeholder="Descripción del valor" />
                  </div>
                ))}
              </div>
              <button type="button" onClick={addValue} className="flex items-center gap-2 w-full justify-center py-2 border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors font-semibold">
                <Plus size={15} /> Agregar valor
              </button>
            </section>
          )}

          {/* EQUIPO */}
          {active === "equipo" && (
            <section className="bg-card border border-border p-6 space-y-4">
              <SectionHeader color="bg-violet-600" label="Equipo periodístico" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className={labelCls}>Subtítulo "Quienes nos escriben"</label><input className={inputCls} value={form.equipoSubtitulo} onChange={e => set("equipoSubtitulo", e.target.value)} /></div>
                <div><label className={labelCls}>Descripción del equipo</label><input className={inputCls} value={form.equipoDescripcion} onChange={e => set("equipoDescripcion", e.target.value)} /></div>
              </div>
              <div className="space-y-5">
                {form.team.map((m, i) => (
                  <div key={m.id} className="p-4 bg-secondary/40 border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Integrante {i + 1}</span>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => updateMember(m.id, "activo", !m.activo)} className={m.activo ? "text-primary" : "text-muted-foreground"}>
                          {m.activo ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                        </button>
                        <button type="button" onClick={() => removeMember(m.id)} className="text-destructive hover:opacity-70"><Trash2 size={15} /></button>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      {/* Foto */}
                      <div className="shrink-0">
                        <div
                          className="w-20 h-20 border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden relative bg-secondary"
                          onClick={() => fileRefs.current[m.id]?.click()}
                        >
                          {m.img ? (
                            <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                          ) : (
                            <Upload size={20} className="text-muted-foreground" />
                          )}
                        </div>
                        <input type="file" accept="image/*" className="hidden" ref={el => { fileRefs.current[m.id] = el }} onChange={e => handleMemberPhoto(m.id, e.target.files?.[0] ?? null)} />
                        <p className="text-[9px] text-muted-foreground text-center mt-1">Clic para foto</p>
                      </div>
                      {/* Datos */}
                      <div className="flex-1 space-y-2">
                        <input className={inputCls} value={m.name} onChange={e => updateMember(m.id, "name", e.target.value)} placeholder="Nombre completo" />
                        <input className={inputCls} value={m.role} onChange={e => updateMember(m.id, "role", e.target.value)} placeholder="Cargo / Rol" />
                        <textarea className={inputCls} rows={2} value={m.description} onChange={e => updateMember(m.id, "description", e.target.value)} placeholder="Descripción breve" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addMember} className="flex items-center gap-2 w-full justify-center py-2 border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors font-semibold">
                <Plus size={15} /> Agregar integrante
              </button>
            </section>
          )}

          {/* Boton guardar al fondo */}
          <button
            onClick={handleSave}
            className={`w-full flex items-center justify-center gap-2 py-3 font-black text-sm uppercase tracking-widest transition-all ${saved ? "bg-green-600 text-white" : "bg-news-red text-white hover:opacity-90"}`}
          >
            {saved ? <><Check size={15} /> Guardado correctamente</> : <><Save size={15} /> Guardar cambios</>}
          </button>
        </div>
      </div>
    </div>
  )
}

function SectionHeader({ color, label }: { color: string; label: string }) {
  return (
    <h2 className="font-black text-sm uppercase tracking-widest text-foreground border-b border-border pb-3 flex items-center gap-2">
      <span className={`w-1 h-4 ${color} inline-block`} />
      {label}
    </h2>
  )
}
