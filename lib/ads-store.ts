// Almacenamiento de anuncios publicitarios en localStorage
// Imágenes soportadas: 1080x1080 hasta 3000x3000 (proporción 1:1)

export interface Anuncio {
  id: string
  titulo: string
  descripcion: string
  imagen: string        // base64 o URL externa
  url: string           // enlace a Facebook, sitio web, etc.
  orden: number         // para ordenar los cuadros
  activo: boolean
  tamano: "chico" | "mediano" | "grande"  // controla el alto visible en pantalla
}

const ADS_KEY = "patagonia_ads"

const DEFAULT_ADS: Anuncio[] = [
  {
    id: "ad-1",
    titulo: "Ferretería Don Luis",
    descripcion: "Todo para la construcción y el hogar. Los mejores precios de Coyhaique.",
    imagen: "https://placehold.co/1080x1080?text=Ferreteria+Don+Luis+Coyhaique",
    url: "",
    orden: 1,
    activo: true,
    tamano: "mediano",
  },
  {
    id: "ad-2",
    titulo: "Turismo Patagonia Sur",
    descripcion: "Excursiones y trekking en la Patagonia. Reserva tu aventura hoy.",
    imagen: "https://placehold.co/1080x1080?text=Turismo+Patagonia+Sur+Aventura",
    url: "https://facebook.com",
    orden: 2,
    activo: true,
    tamano: "grande",
  },
  {
    id: "ad-3",
    titulo: "Espacio disponible",
    descripcion: "Publicita tu negocio aquí y llega a miles de lectores de la Patagonia.",
    imagen: "https://placehold.co/1080x1080?text=Tu+Publicidad+Aqui",
    url: "",
    orden: 3,
    activo: true,
    tamano: "chico",
  },
]

export function getAds(): Anuncio[] {
  if (typeof window === "undefined") return DEFAULT_ADS
  try {
    const raw = localStorage.getItem(ADS_KEY)
    if (!raw) {
      localStorage.setItem(ADS_KEY, JSON.stringify(DEFAULT_ADS))
      return DEFAULT_ADS
    }
    return JSON.parse(raw) as Anuncio[]
  } catch {
    return DEFAULT_ADS
  }
}

export function saveAds(ads: Anuncio[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(ADS_KEY, JSON.stringify(ads))
}

export function getActiveAds(): Anuncio[] {
  return getAds()
    .filter((a) => a.activo)
    .sort((a, b) => a.orden - b.orden)
}

export function createAd(ad: Omit<Anuncio, "id">): Anuncio {
  const newAd: Anuncio = { ...ad, id: `ad-${Date.now()}` }
  const ads = getAds()
  ads.push(newAd)
  saveAds(ads)
  return newAd
}

export function updateAd(id: string, updates: Partial<Anuncio>): void {
  const ads = getAds().map((a) => (a.id === id ? { ...a, ...updates } : a))
  saveAds(ads)
}

export function deleteAd(id: string): void {
  saveAds(getAds().filter((a) => a.id !== id))
}
