export interface Canal {
  id: string
  nombre: string
  descripcion: string
  url: string          // enlace a la transmision (sitio web, youtube, etc.)
  logoUrl: string      // URL o base64 del logo del canal
  ciudad: string       // ej: "Santiago", "Nacional", "Punta Arenas"
  activo: boolean
  orden: number
}

const KEY = "patagonia_canales"

const DEFAULT: Canal[] = [
  {
    id: "1",
    nombre: "TVN",
    descripcion: "Television Nacional de Chile",
    url: "https://www.tvn.cl/envivo",
    logoUrl: "https://placehold.co/120x80?text=TVN",
    ciudad: "Nacional",
    activo: true,
    orden: 1,
  },
  {
    id: "2",
    nombre: "Canal 13",
    descripcion: "Canal 13 en vivo",
    url: "https://www.canal13.cl/envivo",
    logoUrl: "https://placehold.co/120x80?text=Canal+13",
    ciudad: "Nacional",
    activo: true,
    orden: 2,
  },
  {
    id: "3",
    nombre: "Mega",
    descripcion: "Mega TV en vivo",
    url: "https://www.mega.cl/envivo",
    logoUrl: "https://placehold.co/120x80?text=Mega",
    ciudad: "Nacional",
    activo: true,
    orden: 3,
  },
  {
    id: "4",
    nombre: "CHV",
    descripcion: "Chilevision en vivo",
    url: "https://www.chilevision.cl/envivo",
    logoUrl: "https://placehold.co/120x80?text=CHV",
    ciudad: "Nacional",
    activo: true,
    orden: 4,
  },
  {
    id: "5",
    nombre: "24 Horas",
    descripcion: "Noticias en vivo TVN",
    url: "https://www.24horas.cl/envivo",
    logoUrl: "https://placehold.co/120x80?text=24+Horas",
    ciudad: "Nacional",
    activo: true,
    orden: 5,
  },
  {
    id: "6",
    nombre: "CNN Chile",
    descripcion: "Noticias Chile en vivo",
    url: "https://www.cnnchile.com/en-vivo",
    logoUrl: "https://placehold.co/120x80?text=CNN+Chile",
    ciudad: "Nacional",
    activo: true,
    orden: 6,
  },
]

export function getCanales(): Canal[] {
  if (typeof window === "undefined") return DEFAULT
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : DEFAULT
  } catch {
    return DEFAULT
  }
}

export function saveCanales(canales: Canal[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(KEY, JSON.stringify(canales))
    window.dispatchEvent(new Event("canales-updated"))
  } catch {}
}

export function getActiveCanales(): Canal[] {
  return getCanales()
    .filter((c) => c.activo)
    .sort((a, b) => a.orden - b.orden)
}
