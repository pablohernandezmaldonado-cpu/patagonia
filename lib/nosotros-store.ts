export interface TeamMember {
  id: string
  name: string
  role: string
  description: string
  img: string
  activo: boolean
}

export interface NosotrosValue {
  id: string
  title: string
  description: string
  activo: boolean
}

export interface NosotrosStat {
  id: string
  value: string
  label: string
  activo: boolean
}

export interface NosotrosInfo {
  // Hero
  heroSubtitle: string
  heroTitle: string
  heroDescription: string
  // Historia
  historiaTitle: string
  historiaTexto1: string
  historiaTexto2: string
  historiaTexto3: string
  historiaDesde: string
  // Mision / Vision
  misionTexto: string
  visionTexto: string
  // Equipo subtitulo
  equipoSubtitulo: string
  equipoDescripcion: string
  // Stats
  stats: NosotrosStat[]
  // Valores
  values: NosotrosValue[]
  // Equipo
  team: TeamMember[]
}

const KEY = "patagonia_nosotros"

const DEFAULT: NosotrosInfo = {
  heroSubtitle: "Quienes Somos",
  heroTitle: "La voz periodística de la Patagonia Chilena",
  heroDescription: "Desde Coyhaique hasta los confines de Aysén, contamos las historias que importan a nuestra comunidad con rigor, cercanía y compromiso regional.",
  historiaTitle: "Nacimos para dar voz a la Patagonia",
  historiaTexto1: "Patagonia al Día nació en 2019 con una convicción clara: la Región de Aysén merecía un medio de comunicación digital moderno, ágil y profundamente comprometido con su comunidad. Desde Coyhaique, capital patagónica, comenzamos a cubrir la actualidad regional con el rigor que nuestros lectores exigen.",
  historiaTexto2: "En pocos años nos convertimos en una referencia informativa para los habitantes de Aysén y para todos quienes siguen de cerca la vida en la Patagonia Chilena. Cubrimos desde los grandes proyectos de infraestructura hasta las historias cotidianas de las comunidades más apartadas.",
  historiaTexto3: "Creemos que el periodismo regional es esencial para la democracia local y para mantener viva la identidad de nuestra tierra. Cada noticia que publicamos es un paso más en ese compromiso.",
  historiaDesde: "Desde 2019",
  misionTexto: "Informar a la comunidad patagónica con veracidad, oportunidad y profundidad, siendo el medio de comunicación digital líder de la Región de Aysén. Nos comprometemos a visibilizar las necesidades, logros y desafíos de nuestra región ante el país y el mundo.",
  visionTexto: "Ser el portal de noticias de referencia para la Patagonia Chilena, reconocido por su calidad periodística, su innovación tecnológica y su rol fundamental en el fortalecimiento de la ciudadanía informada en la Región de Aysén.",
  equipoSubtitulo: "Quienes nos escriben",
  equipoDescripcion: "Periodistas comprometidos con la Patagonia, que trabajan cada día para mantenerte informado.",
  stats: [
    { id: "1", value: "2019", label: "Año de fundación",     activo: true },
    { id: "2", value: "15K+", label: "Lectores mensuales",   activo: true },
    { id: "3", value: "5",    label: "Categorías informativas", activo: true },
    { id: "4", value: "365",  label: "Días al año activos",  activo: true },
  ],
  values: [
    { id: "1", title: "Transparencia",       description: "Informamos con honestidad y claridad, sin agendas ocultas. Nuestros lectores merecen la verdad.", activo: true },
    { id: "2", title: "Rigor Periodístico",  description: "Verificamos cada fuente antes de publicar. La precisión no es opcional, es nuestra norma de trabajo.", activo: true },
    { id: "3", title: "Compromiso Regional", description: "Somos parte de esta comunidad. Entendemos las realidades de la Patagonia porque la vivimos a diario.", activo: true },
    { id: "4", title: "Actualidad",          description: "Noticias frescas cada día. Nos comprometemos a mantener informada a la comunidad en tiempo real.", activo: true },
  ],
  team: [
    { id: "1", name: "Carmen Vásquez",  role: "Directora Editorial", description: "Periodista con 18 años de trayectoria cubriendo la Región de Aysén. Egresada de la Universidad Austral de Chile.", img: "https://placehold.co/200x200?text=Directora+Editorial", activo: true },
    { id: "2", name: "Rodrigo Mansilla", role: "Jefe de Redacción",  description: "Comunicador social especializado en periodismo regional e investigación. Nacido y criado en Coyhaique.", img: "https://placehold.co/200x200?text=Jefe+de+Redaccion", activo: true },
    { id: "3", name: "Valentina Soto",  role: "Reportera Regional",  description: "Cobertura de terreno en comunas rurales de Aysén. Especialista en temas medioambientales y comunitarios.", img: "https://placehold.co/200x200?text=Reportera+Regional", activo: true },
    { id: "4", name: "Felipe Navarrete", role: "Reportero",          description: "Cubre toda la actividad deportiva regional, desde fútbol hasta deportes de montaña y aventura en la Patagonia.", img: "https://placehold.co/200x200?text=Reportero", activo: true },
  ],
}

export function getNosotrosInfo(): NosotrosInfo {
  if (typeof window === "undefined") return DEFAULT
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULT
    const parsed = JSON.parse(raw)
    // Merge para no perder campos nuevos en actualizaciones
    return {
      ...DEFAULT,
      ...parsed,
      stats:  parsed.stats  ?? DEFAULT.stats,
      values: parsed.values ?? DEFAULT.values,
      team:   parsed.team   ?? DEFAULT.team,
    }
  } catch {
    return DEFAULT
  }
}

export function saveNosotrosInfo(info: NosotrosInfo): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(info))
    window.dispatchEvent(new Event("nosotros-updated"))
  } catch (e) {
    console.error("Error guardando info Nosotros:", e)
  }
}
