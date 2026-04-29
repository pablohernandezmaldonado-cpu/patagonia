"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, Save, Check, Plus, Trash2, Radio, ToggleLeft, ToggleRight, Star } from "lucide-react"
import { getRadioConfig, saveRadioConfig, type RadioConfig, type RadioStation } from "@/lib/radio-store"

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">{label}</label>
      {children}
      {hint && <p className="text-[10px] text-zinc-600">{hint}</p>}
    </div>
  )
}

function Input({ value, onChange, placeholder, className = "" }: {
  value: string; onChange: (v: string) => void; placeholder?: string; className?: string
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`bg-zinc-800 border border-zinc-700 text-white text-sm px-3 py-2 focus:outline-none focus:border-zinc-500 w-full ${className}`}
    />
  )
}

const EMPTY_STATION: Omit<RadioStation, "id"> = {
  nombre: "", descripcion: "", ciudad: "", streamUrl: "",
  logoUrl: "", genero: "Noticias", activo: true, destacada: false,
}

const GENRES = ["Noticias", "Musica", "Deportes", "Regional", "Entretenimiento", "Cultura"]

export default function AdminRadioPage() {
  const [config, setConfig] = useState<RadioConfig | null>(null)
  const [editing, setEditing] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => { setConfig(getRadioConfig()) }, [])

  if (!config) return null

  function updateConfig(patch: Partial<RadioConfig>) {
    setConfig((c) => c ? { ...c, ...patch } : c)
  }

  function addStation() {
    const station: RadioStation = { ...EMPTY_STATION, id: Date.now().toString() }
    updateConfig({ stations: [...config!.stations, station] })
    setEditing(station.id)
  }

  function updateStation(id: string, patch: Partial<RadioStation>) {
    updateConfig({
      stations: config!.stations.map((s) => s.id === id ? { ...s, ...patch } : s),
    })
  }

  function removeStation(id: string) {
    updateConfig({ stations: config!.stations.filter((s) => s.id !== id) })
    if (editing === id) setEditing(null)
  }

  function handleSave() {
    if (!config) return
    saveRadioConfig(config)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between flex-wrap gap-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="font-black text-base text-white uppercase tracking-widest flex items-center gap-2">
              <Radio size={16} className="text-red-500" /> Radio Online
            </h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Gestiona las emisoras del portal</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2 text-sm font-black uppercase tracking-widest transition-colors ${
            saved ? "bg-green-600" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {saved ? <><Check size={15} /> Guardado</> : <><Save size={15} /> Guardar</>}
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">

        {/* Configuracion general */}
        <section className="bg-zinc-900 border border-zinc-800 p-6 space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-800 pb-2 flex items-center gap-2">
            <span className="w-1 h-3 bg-red-500 inline-block" /> Configuracion General
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Titulo de la seccion">
              <Input value={config.titulo} onChange={(v) => updateConfig({ titulo: v })} placeholder="Radio en Vivo" />
            </Field>
            <Field label="Subtitulo">
              <Input value={config.subtitulo} onChange={(v) => updateConfig({ subtitulo: v })} placeholder="Escucha las mejores emisoras..." />
            </Field>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => updateConfig({ activo: !config.activo })}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                config.activo ? "bg-green-700 text-white" : "bg-zinc-700 text-zinc-400"
              }`}
            >
              {config.activo ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
              {config.activo ? "Seccion visible" : "Seccion oculta"}
            </button>
            <p className="text-[11px] text-zinc-500">Controla si la seccion de radio aparece en el portal</p>
          </div>
        </section>

        {/* Lista de emisoras */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
              <span className="w-1 h-3 bg-red-500 inline-block" /> Emisoras ({config.stations.length})
            </h2>
            <button
              onClick={addStation}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 text-xs font-black uppercase tracking-widest transition-colors"
            >
              <Plus size={13} /> Agregar emisora
            </button>
          </div>

          {config.stations.length === 0 && (
            <div className="bg-zinc-900 border border-dashed border-zinc-700 p-10 text-center text-zinc-600">
              <Radio size={36} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">No hay emisoras. Agrega la primera.</p>
            </div>
          )}

          {config.stations.map((station) => (
            <div key={station.id} className={`bg-zinc-900 border ${station.activo ? "border-zinc-700" : "border-zinc-800 opacity-60"}`}>
              {/* Fila resumen */}
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-9 h-9 bg-zinc-800 flex items-center justify-center shrink-0">
                  {station.logoUrl ? (
                    <img src={station.logoUrl} alt="" className="w-full h-full object-contain" />
                  ) : (
                    <Radio size={16} className="text-zinc-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white line-clamp-1">{station.nombre || <span className="text-zinc-600 italic">Sin nombre</span>}</p>
                  <p className="text-[11px] text-zinc-500">{station.ciudad || "Sin ciudad"} — {station.genero}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    title={station.destacada ? "Quitar destacada" : "Marcar destacada"}
                    onClick={() => updateStation(station.id, { destacada: !station.destacada })}
                    className={`p-1.5 transition-colors ${station.destacada ? "text-yellow-400" : "text-zinc-600 hover:text-yellow-400"}`}
                  >
                    <Star size={14} fill={station.destacada ? "currentColor" : "none"} />
                  </button>
                  <button
                    onClick={() => updateStation(station.id, { activo: !station.activo })}
                    className={station.activo ? "text-green-500 hover:text-zinc-400" : "text-zinc-600 hover:text-green-500"}
                    title={station.activo ? "Desactivar" : "Activar"}
                  >
                    {station.activo ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                  </button>
                  <button
                    onClick={() => setEditing(editing === station.id ? null : station.id)}
                    className="text-xs font-bold text-zinc-400 hover:text-white px-2 py-1 border border-zinc-700 hover:border-zinc-500 transition-colors uppercase tracking-widest"
                  >
                    {editing === station.id ? "Cerrar" : "Editar"}
                  </button>
                  <button
                    onClick={() => removeStation(station.id)}
                    className="p-1.5 text-zinc-600 hover:text-red-500 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Editor expandible */}
              {editing === station.id && (
                <div className="border-t border-zinc-800 p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Nombre de la emisora">
                    <Input value={station.nombre} onChange={(v) => updateStation(station.id, { nombre: v })} placeholder="Radio Patagonia" />
                  </Field>
                  <Field label="Ciudad">
                    <Input value={station.ciudad} onChange={(v) => updateStation(station.id, { ciudad: v })} placeholder="Coyhaique" />
                  </Field>
                  <Field label="URL del stream" hint="URL directa de audio: .mp3, .aac, .m3u8 — Si no tienes URL, dejalo vacio (aparecera como Proximo)">
                    <Input value={station.streamUrl} onChange={(v) => updateStation(station.id, { streamUrl: v })} placeholder="https://..." className="font-mono text-xs" />
                  </Field>
                  <Field label="URL del logo" hint="URL de imagen del logo (opcional)">
                    <Input value={station.logoUrl} onChange={(v) => updateStation(station.id, { logoUrl: v })} placeholder="https://..." />
                  </Field>
                  <Field label="Genero / Tipo">
                    <select
                      value={station.genero}
                      onChange={(e) => updateStation(station.id, { genero: e.target.value })}
                      className="bg-zinc-800 border border-zinc-700 text-white text-sm px-3 py-2 focus:outline-none focus:border-zinc-500 w-full"
                    >
                      {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </Field>
                  <Field label="Descripcion">
                    <Input value={station.descripcion} onChange={(v) => updateStation(station.id, { descripcion: v })} placeholder="Descripcion breve de la emisora..." />
                  </Field>
                </div>
              )}
            </div>
          ))}
        </section>

        <div className="bg-zinc-900 border border-zinc-800 p-4 text-xs text-zinc-500">
          <p className="font-bold text-zinc-400 mb-1 uppercase tracking-widest">Como agregar una radio</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Haz clic en <strong className="text-zinc-300">Agregar emisora</strong> y luego en <strong className="text-zinc-300">Editar</strong>.</li>
            <li>Ingresa el nombre, ciudad y genero de la emisora.</li>
            <li>Pega la <strong className="text-zinc-300">URL directa del stream</strong> (termina en .mp3, .aac o .m3u8).</li>
            <li>Si no tienes URL, dejala vacia — aparecera como &quot;Proximo&quot; en el portal.</li>
            <li>Guarda los cambios — la emisora aparece de inmediato en la seccion Radio.</li>
          </ol>
        </div>

      </div>
    </div>
  )
}
