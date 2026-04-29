export interface BgSection {
  id: "hero" | "medio"
  label: string
  imageUrl: string       // base64 o URL externa
  opacidad: number       // 0–100, cuánto se ve la imagen (0 = invisible, 100 = muy visible)
  blur: number           // 0–20px
  activo: boolean
}

const KEY = "patagonia_fondos"

const DEFAULT: BgSection[] = [
  {
    id: "hero",
    label: "Sección superior (Hero)",
    imageUrl: "",
    opacidad: 15,
    blur: 6,
    activo: false,
  },
  {
    id: "medio",
    label: "Sección central (Noticias)",
    imageUrl: "",
    opacidad: 10,
    blur: 8,
    activo: false,
  },
]

export function getBgSections(): BgSection[] {
  if (typeof window === "undefined") return DEFAULT
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULT
    const parsed = JSON.parse(raw) as BgSection[]
    // Merge con DEFAULT para no perder nuevas propiedades
    return DEFAULT.map((d) => ({ ...d, ...(parsed.find((p) => p.id === d.id) ?? {}) }))
  } catch {
    return DEFAULT
  }
}

export function saveBgSections(sections: BgSection[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY, JSON.stringify(sections))
  window.dispatchEvent(new Event("bg-updated"))
}

export function getBgSection(id: BgSection["id"]): BgSection {
  return getBgSections().find((s) => s.id === id) ?? DEFAULT.find((d) => d.id === id)!
}
