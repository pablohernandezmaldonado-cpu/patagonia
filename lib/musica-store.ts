"use client"

export type TipoMusica = "video" | "entrevista" | "noticia" | "artista"

export interface ItemMusica {
  id: string
  tipo: TipoMusica
  titulo: string
  descripcion: string
  contenido: string        // texto completo para noticias/entrevistas
  autor: string
  fecha: string
  imageUrl: string
  videoUrl: string         // URL de YouTube/Vimeo o embed para videos
  genero: string
  artista: string          // nombre del artista (para tipo artista)
  album: string
  duracion: string
  activo: boolean
}

const KEY = "patagonia_musica"

const defaults: ItemMusica[] = [
  {
    id: "1",
    tipo: "video",
    titulo: "Festival de Música Patagónica 2026 – Actuaciones en vivo",
    descripcion: "Resumen de las mejores presentaciones del festival anual de música regional de Aysén.",
    contenido: "",
    autor: "Redacción Música",
    fecha: new Date(Date.now() - 86400000).toISOString(),
    imageUrl: "https://placehold.co/800x450?text=Festival+Musica+Patagonica+escenario+luces+publico+Coyhaique",
    videoUrl: "",
    genero: "Folclor",
    artista: "Varios Artistas",
    album: "",
    duracion: "45:00",
    activo: true,
  },
  {
    id: "2",
    tipo: "entrevista",
    titulo: "Entrevista: Los Patagones hablan de su nuevo álbum «Raíces del Sur»",
    descripcion: "El grupo más emblemático de la región comparte los detalles de su trabajo más personal hasta la fecha.",
    contenido: "En exclusiva para Patagonia al Día, los integrantes de Los Patagones conversaron sobre el proceso creativo de su nuevo disco, grabado íntegramente en la Patagonia con instrumentos tradicionales y sonidos del entorno natural. «Queríamos capturar el viento, el agua y la tierra en cada canción», señaló su vocalista. El álbum se lanzará en junio de 2026 con una gira por toda la región de Aysén.",
    autor: "Editor de Música",
    fecha: new Date(Date.now() - 172800000).toISOString(),
    imageUrl: "https://placehold.co/800x450?text=Entrevista+Los+Patagones+banda+folklorica+estudio+grabacion+sur",
    videoUrl: "",
    genero: "Folclor",
    artista: "Los Patagones",
    album: "Raíces del Sur",
    duracion: "",
    activo: true,
  },
  {
    id: "3",
    tipo: "noticia",
    titulo: "Municipio de Coyhaique abre convocatoria para el Festival de Música Patagónica 2026",
    descripcion: "Artistas y bandas de toda la región pueden inscribirse hasta el 30 de mayo para participar en el festival más importante del sur.",
    contenido: "La Municipalidad de Coyhaique anunció la apertura de inscripciones para el Festival de Música Patagónica 2026, que se realizará durante el mes de agosto en la Plaza de Armas de la ciudad. Los interesados pueden postular hasta el 30 de mayo enviando sus materiales a cultura@municipalidadcoyhaique.cl. El festival contará con tres escenarios simultáneos y espera convocar a más de 5.000 asistentes durante sus tres días de actividades.",
    autor: "Redacción Regional",
    fecha: new Date(Date.now() - 259200000).toISOString(),
    imageUrl: "https://placehold.co/800x450?text=Festival+Musica+Coyhaique+convocatoria+artistas+escenario+sur",
    videoUrl: "",
    genero: "Varios",
    artista: "",
    album: "",
    duracion: "",
    activo: true,
  },
  {
    id: "4",
    tipo: "artista",
    titulo: "Viento del Sur",
    descripcion: "Una canción que evoca los vientos eternos de la estepa patagónica y sus paisajes únicos.",
    contenido: "",
    autor: "Los Patagones",
    fecha: new Date(Date.now() - 345600000).toISOString(),
    imageUrl: "https://placehold.co/300x300?text=Los+Patagones+Viento+del+Sur+album+cover+folklorico",
    videoUrl: "",
    genero: "Folclor",
    artista: "Los Patagones",
    album: "Raíces del Sur",
    duracion: "3:42",
    activo: true,
  },
  {
    id: "5",
    tipo: "artista",
    titulo: "Río Simpson",
    descripcion: "Homenaje al río más emblemático de la región de Aysén, sus peces y sus riberas.",
    contenido: "",
    autor: "Conjunto Aysén",
    fecha: new Date(Date.now() - 432000000).toISOString(),
    imageUrl: "https://placehold.co/300x300?text=Conjunto+Aysen+Rio+Simpson+album+aguas+cristalinas",
    videoUrl: "",
    genero: "Folclor",
    artista: "Conjunto Aysén",
    album: "Aguas Cristalinas",
    duracion: "4:15",
    activo: true,
  },
]

export function getMusicaItems(): ItemMusica[] {
  if (typeof window === "undefined") return defaults
  try {
    const stored = localStorage.getItem(KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as ItemMusica[]
      if (parsed.length > 0) return parsed
    }
  } catch {}
  return defaults
}

export function saveMusicaItems(items: ItemMusica[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(KEY, JSON.stringify(items))
    window.dispatchEvent(new Event("musica-updated"))
  } catch (e) {
    console.error("Error saving musica:", e)
  }
}

export const TIPOS_MUSICA: { value: TipoMusica; label: string; color: string }[] = [
  { value: "video",       label: "Video",       color: "bg-red-600 text-white" },
  { value: "entrevista",  label: "Entrevista",  color: "bg-amber-600 text-white" },
  { value: "noticia",     label: "Noticia",     color: "bg-primary text-primary-foreground" },
  { value: "artista",     label: "Artista",     color: "bg-foreground text-background" },
]

export const GENEROS_MUSICA = ["Folclor", "Cumbia", "Rock Nacional", "Tropical", "Patagónico", "Pop", "Varios", "Otro"]
