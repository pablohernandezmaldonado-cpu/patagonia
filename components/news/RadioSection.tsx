"use client"

import { useEffect, useRef, useState } from "react"
import { Radio, Play, Square, Volume2, VolumeX, Wifi } from "lucide-react"
import { getRadioConfig, type RadioStation, type RadioConfig } from "@/lib/radio-store"

function RadioCard({
  station,
  isPlaying,
  onPlay,
}: {
  station: RadioStation
  isPlaying: boolean
  onPlay: (s: RadioStation) => void
}) {
  const genreColors: Record<string, string> = {
    Noticias:       "bg-blue-700 text-white",
    Regional:       "bg-green-700 text-white",
    Musica:         "bg-purple-700 text-white",
    Deportes:       "bg-orange-600 text-white",
    Entretenimiento:"bg-pink-600 text-white",
  }
  const genreClass = genreColors[station.genero] ?? "bg-zinc-600 text-white"

  return (
    <div
      className={`relative flex flex-col gap-3 p-4 border transition-all cursor-pointer ${
        isPlaying
          ? "border-news-red bg-news-red/5 shadow-md"
          : "border-border bg-card hover:border-primary/50 hover:shadow-sm"
      }`}
      onClick={() => onPlay(station)}
    >
      {/* Estado en vivo */}
      {isPlaying && (
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-news-red text-white text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          EN VIVO
        </div>
      )}

      {/* Logo / icono */}
      <div className="flex items-center gap-3">
        {station.logoUrl ? (
          <img src={station.logoUrl} alt={station.nombre} className="w-12 h-12 object-contain rounded-sm bg-zinc-100" />
        ) : (
          <div className="w-12 h-12 bg-zinc-900 flex items-center justify-center rounded-sm shrink-0">
            <Radio size={22} className="text-white/60" />
          </div>
        )}
        <div className="min-w-0">
          <p className="font-bold text-sm text-foreground leading-tight line-clamp-1">{station.nombre}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{station.ciudad}</p>
          <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 mt-1 inline-block ${genreClass}`}>
            {station.genero}
          </span>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground line-clamp-2">{station.descripcion}</p>

      {/* Boton */}
      <button
        className={`flex items-center justify-center gap-2 py-2 text-xs font-black uppercase tracking-widest transition-colors ${
          isPlaying
            ? "bg-news-red text-white"
            : station.streamUrl
              ? "bg-primary text-primary-foreground hover:opacity-90"
              : "bg-secondary text-muted-foreground cursor-not-allowed"
        }`}
        disabled={!station.streamUrl && !isPlaying}
        onClick={(e) => { e.stopPropagation(); onPlay(station) }}
      >
        {isPlaying ? (
          <><Square size={12} fill="currentColor" /> Detener</>
        ) : station.streamUrl ? (
          <><Play size={12} fill="currentColor" /> Escuchar</>
        ) : (
          <><Wifi size={12} /> Proximamente</>
        )}
      </button>
    </div>
  )
}

export default function RadioSection() {
  const [config, setConfig] = useState<RadioConfig | null>(null)
  const [current, setCurrent]   = useState<RadioStation | null>(null)
  const [muted, setMuted]       = useState(false)
  const [volume, setVolume]     = useState(80)
  const [loading, setLoading]   = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const load = () => setConfig(getRadioConfig())
    load()
    window.addEventListener("radio-updated", load)
    return () => window.removeEventListener("radio-updated", load)
  }, [])

  function handlePlay(station: RadioStation) {
    if (!station.streamUrl) return

    // Si ya esta sonando la misma, detener
    if (current?.id === station.id) {
      audioRef.current?.pause()
      audioRef.current = null
      setCurrent(null)
      return
    }

    // Detener anterior
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    setLoading(true)
    const audio = new Audio(station.streamUrl)
    audio.volume = volume / 100
    audio.muted  = muted
    audio.play()
      .then(() => setLoading(false))
      .catch(() => setLoading(false))
    audio.addEventListener("ended", () => { setCurrent(null); audioRef.current = null })
    audioRef.current = audio
    setCurrent(station)
  }

  function handleVolume(v: number) {
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v / 100
  }

  function handleMute() {
    const next = !muted
    setMuted(next)
    if (audioRef.current) audioRef.current.muted = next
  }

  if (!config || !config.activo) return null

  const visible = config.stations.filter((s) => s.activo)
  if (visible.length === 0) return null

  return (
    <section className="w-full bg-zinc-950 text-white mt-8">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Encabezado */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-news-red px-3 py-1.5">
              <Radio size={14} />
              <span className="text-xs font-black uppercase tracking-widest">Radio Online</span>
            </div>
            <div>
              <h2 className="font-serif font-black text-lg leading-none">{config.titulo}</h2>
              <p className="text-xs text-white/50 mt-0.5">{config.subtitulo}</p>
            </div>
          </div>

          {/* Mini player si hay algo sonando */}
          {current && (
            <div className="flex items-center gap-3 bg-zinc-800 px-4 py-2 border border-zinc-700">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-news-red animate-pulse" />
                <span className="text-xs font-bold text-white">{current.nombre}</span>
                {loading && <span className="text-[10px] text-white/50">cargando...</span>}
              </div>
              <div className="flex items-center gap-2 border-l border-zinc-700 pl-3">
                <button onClick={handleMute} className="text-white/70 hover:text-white transition-colors">
                  {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={(e) => handleVolume(Number(e.target.value))}
                  className="w-20 accent-news-red"
                />
                <button
                  onClick={() => handlePlay(current)}
                  className="flex items-center gap-1 bg-news-red px-2 py-1 text-[10px] font-black uppercase"
                >
                  <Square size={10} fill="currentColor" /> Detener
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Grilla de radios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visible.map((station) => (
            <RadioCard
              key={station.id}
              station={station}
              isPlaying={current?.id === station.id}
              onPlay={handlePlay}
            />
          ))}
        </div>

        <p className="text-[10px] text-white/30 text-center mt-6 uppercase tracking-widest">
          Reproduccion de audio en streaming — Se requiere conexion a internet
        </p>
      </div>
    </section>
  )
}
