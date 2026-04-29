export interface RadioStation {
  id: string
  nombre: string
  descripcion: string
  ciudad: string
  streamUrl: string      // URL del stream de audio (mp3/aac/m3u8)
  logoUrl: string
  genero: string
  activo: boolean
  destacada: boolean
}

export interface RadioConfig {
  titulo: string
  subtitulo: string
  activo: boolean
  stations: RadioStation[]
}

const KEY = "patagonia_radio"

const DEFAULT: RadioConfig = {
  titulo:    "Radio en Vivo",
  subtitulo: "Escucha las mejores emisoras de Chile y la Patagonia",
  activo:    true,
  stations: [
    {
      id: "1",
      nombre:      "Radio Cooperativa",
      descripcion: "Noticias y actualidad nacional",
      ciudad:      "Santiago",
      streamUrl:   "https://stream.cooperativa.cl/cooperativa-128.mp3",
      logoUrl:     "",
      genero:      "Noticias",
      activo:      true,
      destacada:   true,
    },
    {
      id: "2",
      nombre:      "Radio Bío-Bío",
      descripcion: "Noticias, deportes y entretenimiento",
      ciudad:      "Concepcion",
      streamUrl:   "https://unlimited3-cl.dps.live/biobio/aac/icecast.audio",
      logoUrl:     "",
      genero:      "Noticias",
      activo:      true,
      destacada:   false,
    },
    {
      id: "3",
      nombre:      "Radio Polar",
      descripcion: "La radio de la Patagonia Chilena",
      ciudad:      "Punta Arenas",
      streamUrl:   "",
      logoUrl:     "",
      genero:      "Regional",
      activo:      true,
      destacada:   true,
    },
  ],
}

export function getRadioConfig(): RadioConfig {
  if (typeof window === "undefined") return DEFAULT
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULT
    return { ...DEFAULT, ...JSON.parse(raw) }
  } catch {
    return DEFAULT
  }
}

export function saveRadioConfig(config: RadioConfig) {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY, JSON.stringify(config))
  window.dispatchEvent(new Event("radio-updated"))
}
