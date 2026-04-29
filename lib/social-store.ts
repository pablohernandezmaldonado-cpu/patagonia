export interface RedSocial {
  id: string
  nombre: string
  url: string
  icono:
    | "facebook"
    | "instagram"
    | "youtube"
    | "twitter"
    | "tiktok"
    | "whatsapp"
    | "telegram"
    | "spotify"
    | "linkedin"
    | "pinterest"
    | "twitch"
    | "threads"
    | "snapchat"
    | "soundcloud"
    | "web"
    | "otro"
  activo: boolean
  orden: number
}

const SOCIAL_KEY = "patagonia_social"

const DEFAULT_SOCIALS: RedSocial[] = [
  {
    id: "soc-1",
    nombre: "Facebook",
    url: "https://facebook.com",
    icono: "facebook",
    activo: true,
    orden: 1,
  },
  {
    id: "soc-2",
    nombre: "Instagram",
    url: "https://instagram.com",
    icono: "instagram",
    activo: true,
    orden: 2,
  },
  {
    id: "soc-3",
    nombre: "YouTube",
    url: "https://youtube.com",
    icono: "youtube",
    activo: true,
    orden: 3,
  },
]

export function getSocials(): RedSocial[] {
  if (typeof window === "undefined") return DEFAULT_SOCIALS
  try {
    const raw = localStorage.getItem(SOCIAL_KEY)
    if (!raw) {
      localStorage.setItem(SOCIAL_KEY, JSON.stringify(DEFAULT_SOCIALS))
      return DEFAULT_SOCIALS
    }
    return JSON.parse(raw) as RedSocial[]
  } catch {
    return DEFAULT_SOCIALS
  }
}

export function saveSocials(socials: RedSocial[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(SOCIAL_KEY, JSON.stringify(socials))
  window.dispatchEvent(new Event("socials-updated"))
}

export function getActiveSocials(): RedSocial[] {
  return getSocials()
    .filter((s) => s.activo)
    .sort((a, b) => a.orden - b.orden)
}

export function createSocial(s: Omit<RedSocial, "id">): RedSocial {
  const newSocial: RedSocial = { ...s, id: `soc-${Date.now()}` }
  const all = getSocials()
  all.push(newSocial)
  saveSocials(all)
  return newSocial
}

export function updateSocial(id: string, updates: Partial<RedSocial>): void {
  saveSocials(getSocials().map((s) => (s.id === id ? { ...s, ...updates } : s)))
}

export function deleteSocial(id: string): void {
  saveSocials(getSocials().filter((s) => s.id !== id))
}
