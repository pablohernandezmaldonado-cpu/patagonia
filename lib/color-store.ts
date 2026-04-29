export interface SiteColors {
  // Fondo y texto general
  background: string
  foreground: string
  // Tarjetas
  card: string
  cardForeground: string
  // Color primario (header, botones principales)
  primary: string
  primaryForeground: string
  // Acento / noticias destacadas
  newsRed: string
  // Bordes
  border: string
  // Reloj – bloques
  clockBlockBg: string
  clockBlockText: string
  clockSecondsBg: string
  clockSecondsText: string
  clockSeparator: string
  clockDateText: string
  // Barra del tiempo
  weatherBg: string
  weatherBorder: string
  weatherCityText: string
  weatherHourText: string
  weatherTempText: string
  weatherDotActive: string
  weatherDotInactive: string
  // Modo oscuro activado
  darkMode: boolean
}

const KEY = "patagonia_colors"

export const DEFAULT_COLORS: SiteColors = {
  background:        "#f7f6f0",
  foreground:        "#111a12",
  card:              "#ffffff",
  cardForeground:    "#111a12",
  primary:           "#2d5a31",
  primaryForeground: "#ffffff",
  newsRed:           "#d46a1a",
  border:            "#d9ddd0",
  clockBlockBg:         "#18181b",
  clockBlockText:       "#ffffff",
  clockSecondsBg:       "#e4e4e7",
  clockSecondsText:     "#27272a",
  clockSeparator:       "#52525b",
  clockDateText:        "#71717a",
  weatherBg:            "#082f49",
  weatherBorder:        "#0c4a6e",
  weatherCityText:      "#38bdf8",
  weatherHourText:      "#7dd3fc",
  weatherTempText:      "#ffffff",
  weatherDotActive:     "#38bdf8",
  weatherDotInactive:   "rgba(148,163,184,0.4)",
  darkMode:             false,
}

export function getSiteColors(): SiteColors {
  if (typeof window === "undefined") return DEFAULT_COLORS
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULT_COLORS
    return { ...DEFAULT_COLORS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_COLORS
  }
}

export function saveSiteColors(colors: SiteColors) {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY, JSON.stringify(colors))
  window.dispatchEvent(new Event("colors-updated"))
}

export function applyCSSVars(colors: SiteColors) {
  const root = document.documentElement
  const hexToOklch = (hex: string) => hex // usamos hex directamente via style
  root.style.setProperty("--background-hex",          colors.background)
  root.style.setProperty("--foreground-hex",          colors.foreground)
  root.style.setProperty("--card-hex",                colors.card)
  root.style.setProperty("--card-foreground-hex",     colors.cardForeground)
  root.style.setProperty("--primary-hex",             colors.primary)
  root.style.setProperty("--primary-foreground-hex",  colors.primaryForeground)
  root.style.setProperty("--news-red-hex",            colors.newsRed)
  root.style.setProperty("--border-hex",              colors.border)
  // Colores del reloj
  root.style.setProperty("--clock-block-bg",          colors.clockBlockBg)
  root.style.setProperty("--clock-block-text",        colors.clockBlockText)
  root.style.setProperty("--clock-seconds-bg",        colors.clockSecondsBg)
  root.style.setProperty("--clock-seconds-text",      colors.clockSecondsText)
  root.style.setProperty("--clock-separator",         colors.clockSeparator)
  root.style.setProperty("--clock-date-text",          colors.clockDateText)
  // Barra del tiempo
  root.style.setProperty("--weather-bg",              colors.weatherBg)
  root.style.setProperty("--weather-border",          colors.weatherBorder)
  root.style.setProperty("--weather-city-text",       colors.weatherCityText)
  root.style.setProperty("--weather-hour-text",       colors.weatherHourText)
  root.style.setProperty("--weather-temp-text",       colors.weatherTempText)
  root.style.setProperty("--weather-dot-active",      colors.weatherDotActive)
  root.style.setProperty("--weather-dot-inactive",    colors.weatherDotInactive)
  // Aplicar directamente al body
  document.body.style.backgroundColor = colors.background
  document.body.style.color            = colors.foreground
}
