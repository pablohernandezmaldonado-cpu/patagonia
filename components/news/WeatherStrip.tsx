"use client"

import { useEffect, useState, useCallback } from "react"

// Ciudades de la Región de Aysén con coordenadas
const CITIES = [
  { name: "Coyhaique",       lat: -45.5752, lon: -72.0662 },
  { name: "Puerto Aysén",    lat: -45.4035, lon: -72.6996 },
  { name: "Chile Chico",     lat: -46.5397, lon: -71.7270 },
  { name: "Cochrane",        lat: -47.2481, lon: -72.5759 },
  { name: "Villa O'Higgins", lat: -48.4736, lon: -72.5632 },
  { name: "Puerto Cisnes",   lat: -44.7435, lon: -72.6872 },
  { name: "La Junta",        lat: -43.9667, lon: -72.4000 },
]

// WMO code → icono SVG + color
function WeatherIcon({ code, size = 28 }: { code: number; size?: number }) {
  // Sol
  if (code === 0) return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="6" fill="#FBBF24" />
      {[0,45,90,135,180,225,270,315].map((deg, i) => {
        const r = Math.PI * deg / 180
        return <line key={i} x1={16 + Math.cos(r)*8} y1={16 + Math.sin(r)*8} x2={16 + Math.cos(r)*12} y2={16 + Math.sin(r)*12} stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
      })}
    </svg>
  )
  // Sol parcial
  if (code <= 2) return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="13" cy="13" r="5" fill="#FBBF24" />
      {[0,60,120,180,240,300].map((deg, i) => {
        const r = Math.PI * deg / 180
        return <line key={i} x1={13 + Math.cos(r)*7} y1={13 + Math.sin(r)*7} x2={13 + Math.cos(r)*10} y2={13 + Math.sin(r)*10} stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" />
      })}
      <ellipse cx="19" cy="20" rx="7" ry="5" fill="#94A3B8" />
      <ellipse cx="14" cy="22" rx="6" ry="4.5" fill="#94A3B8" />
    </svg>
  )
  // Nublado
  if (code === 3) return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <ellipse cx="18" cy="17" rx="8" ry="6" fill="#94A3B8" />
      <ellipse cx="12" cy="20" rx="7" ry="5" fill="#94A3B8" />
      <ellipse cx="20" cy="21" rx="6" ry="4.5" fill="#94A3B8" />
    </svg>
  )
  // Llovizna
  if (code >= 51 && code <= 57) return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <ellipse cx="16" cy="13" rx="9" ry="6" fill="#64748B" />
      <ellipse cx="10" cy="16" rx="7" ry="5" fill="#64748B" />
      {[11,16,21].map((x, i) => (
        <line key={i} x1={x} y1="22" x2={x-1} y2="27" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" />
      ))}
    </svg>
  )
  // Lluvia
  if (code >= 61 && code <= 67) return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <ellipse cx="16" cy="12" rx="9" ry="6" fill="#475569" />
      <ellipse cx="10" cy="15" rx="7" ry="5" fill="#475569" />
      {[9,14,19,24].map((x, i) => (
        <line key={i} x1={x} y1="21" x2={x-2} y2="28" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
      ))}
    </svg>
  )
  // Nieve
  if (code >= 71 && code <= 77) return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <ellipse cx="16" cy="12" rx="9" ry="6" fill="#64748B" />
      {[9,14,19,24].map((x, i) => (
        <text key={i} x={x} y="28" fontSize="7" fill="#BAE6FD" textAnchor="middle">*</text>
      ))}
    </svg>
  )
  // Tormenta
  if (code >= 95) return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <ellipse cx="16" cy="11" rx="9" ry="6" fill="#374151" />
      <polygon points="17,18 13,25 16,23 14,30 20,22 17,24" fill="#FDE047" />
    </svg>
  )
  // Chubascos
  if (code >= 80 && code <= 82) return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <ellipse cx="16" cy="12" rx="9" ry="6" fill="#475569" />
      {[10,15,20].map((x, i) => (
        <line key={i} x1={x} y1="20" x2={x-2} y2="27" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />
      ))}
    </svg>
  )
  // Default nuboso
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <ellipse cx="16" cy="16" rx="10" ry="7" fill="#94A3B8" />
    </svg>
  )
}

interface HourData {
  hour: string
  temp: number
  code: number
}

interface CityForecast {
  name: string
  hours: HourData[]
}

// Datos de fallback para cuando la API no responde
function makeFallback(name: string): CityForecast {
  const baseCodes = [61, 61, 3, 3, 2, 3, 61, 61]
  const baseTemps = [5, 5, 6, 8, 9, 8, 7, 7]
  return {
    name,
    hours: [2, 5, 8, 11, 14, 17, 20, 23].map((h, i) => ({
      hour: `${String(h).padStart(2, "0")}:00`,
      temp: baseTemps[i] + Math.floor(Math.random() * 3) - 1,
      code: baseCodes[i],
    })),
  }
}

async function fetchCityForecast(city: typeof CITIES[0]): Promise<CityForecast> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${city.lat}&longitude=${city.lon}` +
      `&hourly=temperature_2m,weather_code` +
      `&timezone=America%2FSantiago&forecast_days=1`
    const res = await fetch(url, { signal: controller.signal, cache: "no-store" })
    clearTimeout(timeout)
    const json = await res.json()
    const times: string[] = json.hourly?.time ?? []
    const temps: number[] = json.hourly?.temperature_2m ?? []
    const codes: number[] = json.hourly?.weather_code ?? []
    if (times.length === 0) return makeFallback(city.name)

    const hours: HourData[] = []
    for (let i = 0; i < 24; i += 3) {
      if (temps[i] !== undefined) {
        const timeStr = times[i] ?? ""
        const hourPart = timeStr.split("T")[1]?.slice(0, 5) ?? `${String(i).padStart(2, "0")}:00`
        hours.push({ hour: hourPart, temp: Math.round(temps[i]), code: codes[i] ?? 0 })
      }
    }
    return hours.length > 0 ? { name: city.name, hours } : makeFallback(city.name)
  } catch {
    return makeFallback(city.name)
  }
}

export default function WeatherStrip() {
  const [forecasts, setForecasts] = useState<CityForecast[]>([])
  const [cityIdx, setCityIdx] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const results = await Promise.all(CITIES.map(fetchCityForecast))
      setForecasts(results)
      setLoading(false)
    }
    load()
    const refresh = setInterval(load, 30 * 60 * 1000)
    return () => clearInterval(refresh)
  }, [])

  // Rotar ciudad cada 8 segundos
  useEffect(() => {
    if (forecasts.length === 0) return
    const id = setInterval(() => {
      setCityIdx((i) => (i + 1) % forecasts.length)
    }, 8000)
    return () => clearInterval(id)
  }, [forecasts])

  const current = forecasts[cityIdx]

  return (
    <div
      className="w-full overflow-hidden"
      style={{ backgroundColor: "var(--weather-bg, #082f49)", borderBottom: "1px solid var(--weather-border, #0c4a6e)" }}
      role="region"
      aria-label="Pronostico del tiempo Region de Aysen"
    >
      <div className="max-w-7xl mx-auto px-4 flex items-stretch min-h-[64px]">

        {/* Nombre ciudad + selector */}
        <div
          className="shrink-0 flex flex-col items-center justify-center pr-4 mr-3 min-w-[110px] gap-1"
          style={{ borderRight: "1px solid var(--weather-border, #0c4a6e)" }}
        >
          <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: "var(--weather-city-text, #38bdf8)" }}>
            Region de Aysen
          </span>
          {loading ? (
            <span className="text-xs animate-pulse" style={{ color: "var(--weather-hour-text, #7dd3fc)" }}>Cargando...</span>
          ) : (
            <span className="text-xs font-bold text-center leading-tight" style={{ color: "var(--weather-temp-text, #ffffff)" }}>
              {current?.name ?? "—"}
            </span>
          )}
          {/* Puntos indicadores */}
          <div className="flex gap-1 mt-0.5">
            {forecasts.map((_, i) => (
              <button
                key={i}
                onClick={() => setCityIdx(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === cityIdx ? 14 : 5,
                  height: 5,
                  background: i === cityIdx
                    ? "var(--weather-dot-active, #38bdf8)"
                    : "var(--weather-dot-inactive, rgba(148,163,184,0.4))",
                }}
                aria-label={forecasts[i]?.name}
              />
            ))}
          </div>
        </div>

        {/* Horas con scroll horizontal */}
        <div className="flex-1 overflow-x-auto flex items-center">
          {loading || !current ? (
            <div className="flex gap-6 py-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1 opacity-30 animate-pulse min-w-[44px]">
                  <div className="h-3 w-10 rounded" style={{ background: "var(--weather-hour-text, #7dd3fc)" }} />
                  <div className="h-7 w-7 rounded-full" style={{ background: "var(--weather-hour-text, #7dd3fc)" }} />
                  <div className="h-3 w-8 rounded" style={{ background: "var(--weather-hour-text, #7dd3fc)" }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-0 py-2">
              {current.hours.map((h, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center gap-1 px-3 min-w-[58px] last:border-0"
                  style={{ borderRight: "1px solid var(--weather-border, #0c4a6e)" }}
                >
                  <span className="text-[10px] font-semibold tabular-nums" style={{ color: "var(--weather-hour-text, #7dd3fc)" }}>
                    {h.hour}
                  </span>
                  <WeatherIcon code={h.code} size={26} />
                  <span className="text-[11px] font-black tabular-nums" style={{ color: "var(--weather-temp-text, #ffffff)" }}>
                    {h.temp} °C
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
