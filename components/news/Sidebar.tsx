import Link from "next/link"
import { type NewsItem, CATEGORY_COLORS, formatDate, CATEGORIES } from "@/lib/news-store"
import { Clock, TrendingUp, Tag, LayoutGrid } from "lucide-react"

interface SidebarProps {
  latestNews: NewsItem[]
  allNews: NewsItem[]
}

function SidebarBlock({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border overflow-hidden">
      <div className="bg-primary px-4 py-2.5 flex items-center gap-2">
        <Icon size={14} className="text-primary-foreground" />
        <h2 className="text-primary-foreground font-black text-xs uppercase tracking-widest">{title}</h2>
      </div>
      {children}
    </div>
  )
}

export default function Sidebar({ latestNews, allNews }: SidebarProps) {
  const categoryCounts = CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat] = allNews.filter((n) => n.category === cat).length
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <aside className="space-y-5">
      {/* Latest news */}
      <SidebarBlock icon={TrendingUp} title="Últimas Noticias">
        <div className="divide-y divide-border">
          {latestNews.slice(0, 7).map((news) => (
            <Link
              key={news.id}
              href={`/noticia/${news.id}`}
              className="flex gap-3 p-3 group hover:bg-secondary/50 transition-colors"
            >
              <div className="w-16 h-13 shrink-0 overflow-hidden">
                <img
                  src={news.imageUrl}
                  alt={news.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  style={{ height: "52px" }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 ${CATEGORY_COLORS[news.category]}`}>
                  {news.category}
                </span>
                <h3 className="text-xs font-bold font-serif mt-1 leading-snug group-hover:text-news-red transition-colors line-clamp-2">
                  {news.title}
                </h3>
                <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                  <Clock size={9} />
                  {formatDate(news.date)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </SidebarBlock>

      {/* Categories */}
      <SidebarBlock icon={Tag} title="Secciones">
        <div className="divide-y divide-border">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/?categoria=${cat}`}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-secondary/50 transition-colors group"
            >
              <span className="text-xs font-bold uppercase tracking-wide group-hover:text-news-red transition-colors">{cat}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 ${CATEGORY_COLORS[cat]}`}>
                {categoryCounts[cat] || 0}
              </span>
            </Link>
          ))}
        </div>
      </SidebarBlock>

      {/* About block */}
      <SidebarBlock icon={LayoutGrid} title="Sobre Nosotros">
        <div className="p-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Patagonia al Día es el portal de noticias más actualizado de la Región de Aysén. Informamos con rigor
            periodístico y compromiso regional desde Coyhaique, Patagonia Chilena.
          </p>
          <Link
            href="/admin"
            className="mt-3 block text-center bg-news-red text-white text-xs font-bold py-2 uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            Publicar Noticia
          </Link>
        </div>
      </SidebarBlock>
    </aside>
  )
}
