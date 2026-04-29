export interface FooterLink {
  id: string
  label: string
  url: string
  activo: boolean
}

export interface ContactInfo {
  nombreSitio: string
  slogan: string
  descripcion: string
  direccion: string
  telefono: string
  email: string
  whatsapp: string
  whatsappMensaje: string
  whatsappActivo: boolean
  copyright: string
  ciudad: string
  // Links editables del bloque "Portal" del footer
  portalLinks: FooterLink[]
}

const KEY = "patagonia_contacto"

const DEFAULT: ContactInfo = {
  nombreSitio:     "Patagonia al Día",
  slogan:          "Noticias de la Región de Aysén",
  descripcion:     "El portal de noticias más actualizado de la Patagonia Chilena. Información regional con rigor periodístico y compromiso comunitario.",
  direccion:       "Coyhaique, Región de Aysén, Chile",
  telefono:        "+56 67 2 241430",
  email:           "contacto@patagoniaaldia.cl",
  whatsapp:        "56912345678",
  whatsappMensaje: "Hola, me comunico desde el portal Patagonia al Día.",
  whatsappActivo:  true,
  copyright:       "Patagonia al Día",
  ciudad:          "Coyhaique, Patagonia Chilena",
  portalLinks: [
    { id: "1", label: "Administrar Noticias", url: "/admin",         activo: true },
    { id: "2", label: "Publicar Nueva Noticia", url: "/admin/nueva", activo: true },
    { id: "3", label: "Nosotros",              url: "/nosotros",     activo: true },
    { id: "4", label: "Música",                url: "/musica",       activo: true },
    { id: "5", label: "Entrevistas",           url: "/entrevistas",  activo: true },
  ],
}

export function getContactInfo(): ContactInfo {
  if (typeof window === "undefined") return DEFAULT
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT
  } catch {
    return DEFAULT
  }
}

export function saveContactInfo(info: ContactInfo): void {
  localStorage.setItem(KEY, JSON.stringify(info))
  window.dispatchEvent(new Event("contact-updated"))
}
