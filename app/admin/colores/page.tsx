"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, Save, Check, RotateCcw } from "lucide-react"
import { getSiteColors, saveSiteColors, applyCSSVars, DEFAULT_COLORS, type SiteColors } from "@/lib/color-store"

const SECTIONS = [
  {
    label: "Fondo y Texto",
    fields: [
      { key: "background",     label: "Fondo de pagina"     },
      { key: "foreground",     label: "Texto principal"     },
      { key: "card",           label: "Fondo de tarjetas"   },
      { key: "cardForeground", label: "Texto en tarjetas"   },
      { key: "border",         label: "Bordes"              },
    ],
  },
  {
    label: "Colores Primarios",
    fields: [
      { key: "primary",           label: "Color primario (header, botones)" },
      { key: "primaryForeground", label: "Texto sobre primario"             },
      { key: "newsRed",           label: "Acento / destacados"              },
    ],
  },
  {
    label: "Reloj Digital",
    fields: [
      { key: "clockBlockBg",      label: "Fondo bloques Hora/Min"  },
      { key: "clockBlockText",    label: "Texto Hora/Min"          },
      { key: "clockSecondsBg",    label: "Fondo bloque Segundos"   },
      { key: "clockSecondsText",  label: "Texto Segundos"          },
      { key: "clockSeparator",    label: "Separador \":\" "        },
      { key: "clockDateText",     label: "Texto de la fecha"       },
    ],
  },
  {
    label: "Barra del Tiempo (WeatherStrip)",
    fields: [
      { key: "weatherBg",           label: "Fondo de la barra"        },
      { key: "weatherBorder",       label: "Borde / divisores"        },
      { key: "weatherCityText",     label: "Texto ciudad / etiqueta"  },
      { key: "weatherHourText",     label: "Texto de hora"            },
      { key: "weatherTempText",     label: "Texto temperatura"        },
      { key: "weatherDotActive",    label: "Punto activo"             },
      { key: "weatherDotInactive",  label: "Punto inactivo"           },
    ],
  },
]

const PRESETS: { label: string; colors: Partial<SiteColors> }[] = [
  {
    label: "Original",
    colors: DEFAULT_COLORS,
  },
  {
    label: "Noche Patagonica",
    colors: {
      background: "#0f1117", foreground: "#e8e8e8",
      card: "#1a1d27", cardForeground: "#e8e8e8",
      primary: "#1e4d6b", primaryForeground: "#ffffff",
      newsRed: "#e05a1c", border: "#2a2d3a",
      clockBlockBg: "#1a1d27", clockBlockText: "#4fc3f7",
      clockSecondsBg: "#0f1117", clockSecondsText: "#80deea",
      clockSeparator: "#4fc3f7", clockDateText: "#9e9e9e",
    },
  },
  {
    label: "Bosque Sur",
    colors: {
      background: "#f0f4f0", foreground: "#1a2e1a",
      card: "#ffffff", cardForeground: "#1a2e1a",
      primary: "#1b5e20", primaryForeground: "#ffffff",
      newsRed: "#bf360c", border: "#c8d8c8",
      clockBlockBg: "#1b5e20", clockBlockText: "#ffffff",
      clockSecondsBg: "#e8f5e9", clockSecondsText: "#1b5e20",
      clockSeparator: "#2e7d32", clockDateText: "#558b2f",
    },
  },
  {
    label: "Hielo Austral",
    colors: {
      background: "#f0f5f8", foreground: "#1a2d3a",
      card: "#ffffff", cardForeground: "#1a2d3a",
      primary: "#0d47a1", primaryForeground: "#ffffff",
      newsRed: "#c62828", border: "#cdd8e0",
      clockBlockBg: "#0d47a1", clockBlockText: "#ffffff",
      clockSecondsBg: "#e3eaf3", clockSecondsText: "#0d47a1",
      clockSeparator: "#1565c0", clockDateText: "#546e7a",
    },
  },
]

export default function AdminColoresPage() {
  const [colors, setColors] = useState<SiteColors>(DEFAULT_COLORS)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const c = getSiteColors()
    setColors(c)
    applyCSSVars(c)
  }, [])

  function handleChange(key: keyof SiteColors, value: string) {
    const updated = { ...colors, [key]: value }
    setColors(updated)
    applyCSSVars(updated) // preview en tiempo real
  }

  function applyPreset(preset: Partial<SiteColors>) {
    const updated = { ...colors, ...preset }
    setColors(updated)
    applyCSSVars(updated)
  }

  function handleSave() {
    saveSiteColors(colors)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  function handleReset() {
    setColors(DEFAULT_COLORS)
    applyCSSVars(DEFAULT_COLORS)
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
            <h1 className="font-black text-base text-white uppercase tracking-widest">Paleta de Colores</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Los cambios se aplican en tiempo real</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 border border-zinc-700 text-xs text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors font-semibold"
          >
            <RotateCcw size={13} /> Restablecer
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2 text-sm font-black uppercase tracking-widest transition-colors ${
              saved ? "bg-green-600" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {saved ? <><Check size={15} /> Guardado</> : <><Save size={15} /> Guardar</>}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">

        {/* Presets */}
        <section>
          <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-3 border-b border-zinc-800 pb-2 flex items-center gap-2">
            <span className="w-1 h-3 bg-red-500 inline-block" /> Temas Predefinidos
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => applyPreset(p.colors)}
                className="border border-zinc-700 hover:border-zinc-500 p-3 text-left transition-all group"
                style={{ backgroundColor: (p.colors as SiteColors).background ?? "#f7f6f0" }}
              >
                <div className="flex gap-1 mb-2">
                  {[
                    (p.colors as SiteColors).primary,
                    (p.colors as SiteColors).newsRed,
                    (p.colors as SiteColors).foreground,
                  ].map((c, i) => (
                    <span key={i} className="w-5 h-5 rounded-full border border-black/10" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <p
                  className="text-xs font-bold"
                  style={{ color: (p.colors as SiteColors).foreground ?? "#111" }}
                >
                  {p.label}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Secciones de colores */}
        {SECTIONS.map((section) => (
          <section key={section.label}>
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4 border-b border-zinc-800 pb-2 flex items-center gap-2">
              <span className="w-1 h-3 bg-red-500 inline-block" /> {section.label}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.fields.map(({ key, label }) => {
                const val = colors[key as keyof SiteColors] as string
                return (
                  <div key={key} className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-4 py-3">
                    <div className="relative shrink-0">
                      <div
                        className="w-10 h-10 rounded-sm border-2 border-zinc-700 cursor-pointer"
                        style={{ backgroundColor: val }}
                      />
                      <input
                        type="color"
                        value={val}
                        onChange={(e) => handleChange(key as keyof SiteColors, e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        title="Seleccionar color"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white">{label}</p>
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => handleChange(key as keyof SiteColors, e.target.value)}
                        className="text-[11px] font-mono text-zinc-400 bg-transparent border-b border-zinc-700 focus:outline-none focus:border-zinc-400 w-full mt-0.5"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        ))}

        {/* Vista previa del reloj */}
        <section>
          <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4 border-b border-zinc-800 pb-2 flex items-center gap-2">
            <span className="w-1 h-3 bg-red-500 inline-block" /> Vista previa del Reloj
          </h2>
          <div className="bg-zinc-900 border border-zinc-800 p-6 flex justify-center">
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm font-medium capitalize" style={{ color: colors.clockDateText }}>
                Mar, 21. Abr 2026
              </span>
              <div className="flex items-center gap-2">
                {[
                  { bg: colors.clockBlockBg, text: colors.clockBlockText, val: "08" },
                  null,
                  { bg: colors.clockBlockBg, text: colors.clockBlockText, val: "27" },
                  null,
                  { bg: colors.clockSecondsBg, text: colors.clockSecondsText, val: "13" },
                ].map((item, i) =>
                  item === null ? (
                    <span key={i} className="text-2xl font-black" style={{ color: colors.clockSeparator }}>:</span>
                  ) : (
                    <div
                      key={i}
                      className="flex items-center justify-center rounded-sm shadow-md"
                      style={{ width: 52, height: 52, backgroundColor: item.bg }}
                    >
                      <span className="font-mono font-black text-2xl tabular-nums" style={{ color: item.text }}>
                        {item.val}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Vista previa de la barra del tiempo */}
        <section>
          <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4 border-b border-zinc-800 pb-2 flex items-center gap-2">
            <span className="w-1 h-3 bg-red-500 inline-block" /> Vista previa Barra del Tiempo
          </h2>
          <div
            className="overflow-hidden"
            style={{ backgroundColor: colors.weatherBg, border: `1px solid ${colors.weatherBorder}` }}
          >
            <div className="flex items-stretch min-h-[60px] px-4">
              {/* Bloque ciudad */}
              <div
                className="shrink-0 flex flex-col items-center justify-center pr-4 mr-3 min-w-[100px] gap-1"
                style={{ borderRight: `1px solid ${colors.weatherBorder}` }}
              >
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: colors.weatherCityText }}>
                  Region de Aysen
                </span>
                <span className="text-xs font-bold" style={{ color: colors.weatherTempText }}>Coyhaique</span>
                <div className="flex gap-1 mt-0.5">
                  {[0,1,2,3].map((i) => (
                    <span
                      key={i}
                      className="rounded-full"
                      style={{
                        width: i === 0 ? 14 : 5,
                        height: 5,
                        display: "inline-block",
                        background: i === 0 ? colors.weatherDotActive : colors.weatherDotInactive,
                      }}
                    />
                  ))}
                </div>
              </div>
              {/* Columnas de hora simuladas */}
              <div className="flex gap-0 py-2">
                {[
                  { h: "02:00", t: 5 }, { h: "05:00", t: 5 }, { h: "08:00", t: 6 },
                  { h: "11:00", t: 8 }, { h: "14:00", t: 9 }, { h: "17:00", t: 8 },
                  { h: "20:00", t: 7 }, { h: "23:00", t: 7 },
                ].map((col, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-center gap-1 px-3 min-w-[52px] last:border-0"
                    style={{ borderRight: `1px solid ${colors.weatherBorder}` }}
                  >
                    <span className="text-[10px] font-semibold tabular-nums" style={{ color: colors.weatherHourText }}>{col.h}</span>
                    {/* Icono nube simplificado */}
                    <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                      <ellipse cx="16" cy="14" rx="9" ry="6" fill={colors.weatherHourText} opacity="0.7" />
                      {[9,14,19,24].map((x, j) => (
                        <line key={j} x1={x} y1="21" x2={x-2} y2="28" stroke={colors.weatherCityText} strokeWidth="2" strokeLinecap="round" />
                      ))}
                    </svg>
                    <span className="text-[11px] font-black tabular-nums" style={{ color: colors.weatherTempText }}>{col.t} °C</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
