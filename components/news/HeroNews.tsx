import Link from "next/link"
import { type NewsItem, CATEGORY_COLORS, formatDate } from "@/lib/news-store"
import { Clock, ChevronRight, User } from "lucide-react"

interface HeroNewsProps {
  featured: NewsItem
  secondary: NewsItem[]
}

export default function HeroNews({ featured, secondary }: HeroNewsProps) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-0.5 mb-8 rounded overflow-hidden border border-border shadow-sm">
      {/* Main featured */}
      <Link
        href={`/noticia/${featured.id}`}
        className="lg:col-span-2 relative group block"
      >
        <div className="relative h-72 lg:h-[440px] overflow-hidden">
          <img
            src={featured.imageUrl}
            alt={featured.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          {featured.breaking && (
            <span className="absolute top-4 left-4 bg-news-red text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest animate-pulse">
              Última Hora
            </span>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
            <span className={`text-[10px] font-bold px-2 py-1 ${CATEGORY_COLORS[featured.category]}`}>
              {featured.category}
            </span>
            <h2 className="text-white font-serif font-black text-xl lg:text-3xl mt-2 leading-tight text-balance">
              {featured.title}
            </h2>
            <p className="text-white/75 text-sm mt-2 line-clamp-2 leading-relaxed hidden sm:block">{featured.summary}</p>
            <div className="text-white/55 text-xs mt-3 flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1">
                <User size={11} />
                {featured.author}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {formatDate(featured.date)}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Secondary stack */}
      <div className="flex flex-col gap-0.5">
        {secondary.slice(0, 3).map((news) => (
          <Link
            key={news.id}
            href={`/noticia/${news.id}`}
            className="relative group flex-1 block"
          >
            <div className="relative h-36 overflow-hidden">
              <img
                src={news.imageUrl}
                alt={news.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 ${CATEGORY_COLORS[news.category]}`}>
                  {news.category}
                </span>
                <h3 className="text-white font-serif font-bold text-sm mt-1 leading-snug line-clamp-2">
                  {news.title}
                </h3>
                <p className="text-white/55 text-[10px] mt-1 flex items-center gap-1">
                  <Clock size={9} />
                  {formatDate(news.date)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function BreakingNewsTicker({ items }: { items: NewsItem[] }) {
  if (items.length === 0) return null
  return (
    <div className="bg-news-red text-white py-2 px-0 flex items-center gap-0 mb-5 overflow-hidden">
      <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap bg-foreground text-background px-3 py-2 shrink-0">
        Urgente
      </span>
      <div className="overflow-hidden flex-1 px-4">
        <div className="flex items-center gap-8 text-xs font-semibold overflow-x-auto">
          {items.map((item) => (
            <Link key={item.id} href={`/noticia/${item.id}`} className="flex items-center gap-1 whitespace-nowrap hover:underline shrink-0">
              <ChevronRight size={13} />
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
