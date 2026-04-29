"use client"

export type Category =
  | "REGIONAL"
  | "NACIONAL"
  | "ENTREVISTAS"

export interface NewsItem {
  id: string
  title: string
  summary: string
  content: string
  category: Category
  author: string
  date: string
  imageUrl: string
  featured: boolean
  breaking: boolean
}

const STORAGE_KEY = "patagonia_al_dia_news"

const defaultNews: NewsItem[] = [
  {
    id: "1",
    title: "Gobierno Regional de Aysén anuncia inversión histórica en infraestructura vial para la Carretera Austral",
    summary:
      "La autoridad regional confirmó una inversión de más de 12.000 millones de pesos para pavimentar tramos clave de la ruta entre Coyhaique y Cochrane.",
    content:
      "El Gobierno Regional de Aysén anunció esta mañana una inversión histórica de 12.500 millones de pesos destinados a mejorar la infraestructura vial de la Carretera Austral. Los trabajos contemplarán la pavimentación de 45 kilómetros entre Villa Ortega y Cochrane, beneficiando a más de 15.000 habitantes de las comunas afectadas. El intendente regional señaló que las obras comenzarán en el primer trimestre del próximo año y se espera que estén concluidas en un plazo de 24 meses.",
    category: "REGIONAL",
    author: "Redacción Patagonia",
    date: new Date().toISOString(),
    imageUrl:
      "https://placehold.co/800x450?text=Carretera+Austral+Patagonia+paisaje+montanoso+con+lago+turquesa+y+bosque+nativo",
    featured: true,
    breaking: true,
  },

  {
    id: "5",
    title: "Senado aprueba proyecto de ley que beneficiará a comunidades rurales de zonas extremas de Chile",
    summary:
      "La iniciativa contempla subsidios directos para conectividad, salud y transporte en localidades aisladas del sur y norte del país.",
    content:
      "El Senado de la República aprobó por amplia mayoría el proyecto de ley de zonas extremas que beneficiará a más de 200.000 chilenos que viven en localidades remotas. Entre las medidas destacan subsidios para internet satelital, bonos de transporte aéreo y refuerzo de la red de postas rurales. Aysén, Magallanes y la Provincia de Palena son las regiones con mayor número de beneficiarios.",
    category: "NACIONAL",
    author: "Redacción Nacional",
    date: new Date(Date.now() - 43200000).toISOString(),
    imageUrl:
      "https://placehold.co/800x450?text=Senado+Chile+sesion+plenaria+proyecto+ley+zonas+extremas",
    featured: false,
    breaking: false,
  },
  {
    id: "6",
    title: "Entrevista: Alcalde de Coyhaique habla sobre los desafíos del turismo sostenible en la Patagonia",
    summary:
      "El alcalde conversó con Patagonia al Día sobre el plan de desarrollo turístico 2026-2030 y los ejes de sustentabilidad medioambiental.",
    content:
      "En una extensa conversación con nuestro equipo, el alcalde de Coyhaique detalló los pilares del nuevo plan de turismo sostenible que busca triplicar los visitantes a la región sin comprometer los ecosistemas únicos de la Patagonia. Habló sobre los avances en senderos certificados, la capacitación de guías locales y los acuerdos con operadores nacionales e internacionales para promover un turismo de bajo impacto.",
    category: "ENTREVISTAS",
    author: "Editor Periodístico",
    date: new Date(Date.now() - 129600000).toISOString(),
    imageUrl:
      "https://placehold.co/800x450?text=Entrevista+alcalde+Coyhaique+turismo+sostenible+Patagonia+oficina",
    featured: false,
    breaking: false,
  },
  {
    id: "4",
    title: "Comunidades de Puerto Cisnes exigen pavimentación de acceso al poblado tras décadas de promesas",
    summary:
      "Vecinos bloquearon durante horas el ingreso al poblado en señal de protesta, exigiendo a las autoridades regionales una respuesta concreta.",
    content:
      "Cansados de décadas de promesas incumplidas, los vecinos de Puerto Cisnes se organizaron para bloquear el acceso principal al poblado en demanda de la pavimentación de los 12 kilómetros que los conectan con la Carretera Austral. El seremi de Obras Públicas se comprometió a presentar el proyecto definitivo antes de agosto de 2026.",
    category: "REGIONAL",
    author: "Corresponsal Puerto Cisnes",
    date: new Date(Date.now() - 259200000).toISOString(),
    imageUrl:
      "https://placehold.co/800x450?text=Puerto+Cisnes+vecinos+manifestacion+acceso+Patagonia+carretera+austral",
    featured: false,
    breaking: false,
  },
]

export function getNews(): NewsItem[] {
  if (typeof window === "undefined") return defaultNews
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as NewsItem[]
      if (parsed.length > 0) return parsed
    }
  } catch {
    // fallback to defaults
  }
  return defaultNews
}

export function saveNews(news: NewsItem[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(news))
  } catch (error) {
    console.error("Failed to save news:", error)
  }
}

export function createNewsItem(item: Omit<NewsItem, "id">): NewsItem {
  return {
    ...item,
    id: crypto.randomUUID(),
  }
}

export function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  } catch {
    return dateStr
  }
}

export const CATEGORIES: Category[] = [
  "REGIONAL",
  "NACIONAL",
  "ENTREVISTAS",
]

export const CATEGORY_COLORS: Record<Category, string> = {
  REGIONAL: "bg-primary text-primary-foreground",
  NACIONAL: "bg-foreground text-background",
  ENTREVISTAS: "bg-amber-600 text-white",
}
