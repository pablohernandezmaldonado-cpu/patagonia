import Link from "next/link"
import { type NewsItem, CATEGORY_COLORS, formatDate } from "@/lib/news-store"
import { Clock, User } from "lucide-react"

interface NewsCardProps {
  news: NewsItem
  variant?: "horizontal" | "vertical" | "compact"
}

export default function NewsCard({ news, variant = "vertical" }: NewsCardProps) {
  if (variant === "compact") {
    return (
      <Link href={`/noticia/${news.id}`} className="flex gap-3 group py-3 border-b border-border last:border-0">
        <div className="w-20 h-16 shrink-0 overflow-hidden">
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
    )
  }

  if (variant === "horizontal") {
    return (
      <Link href={`/noticia/${news.id}`} className="flex gap-4 group bg-card border border-border p-3 hover:shadow-sm transition-shadow">
        <div className="w-28 h-20 shrink-0 overflow-hidden">
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className={`text-[9px] font-bold px-1.5 py-0.5 ${CATEGORY_COLORS[news.category]}`}>
            {news.category}
          </span>
          <h3 className="text-sm font-bold font-serif mt-1 leading-snug group-hover:text-news-red transition-colors line-clamp-2">
            {news.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1 leading-relaxed">{news.summary}</p>
          <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-2">
            <span className="flex items-center gap-1"><Clock size={9} />{formatDate(news.date)}</span>
            <span className="flex items-center gap-1"><User size={9} />{news.author}</span>
          </p>
        </div>
      </Link>
    )
  }

  // vertical (default)
  return (
    <Link href={`/noticia/${news.id}`} className="group block bg-card border border-border overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative overflow-hidden">
        <img
          src={news.imageUrl}
          alt={news.title}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {news.breaking && (
          <span className="absolute top-0 left-0 bg-news-red text-white text-[9px] font-black px-2 py-1 uppercase tracking-widest">
            Última Hora
          </span>
        )}
        <div className="absolute top-0 right-0">
          <span className={`text-[9px] font-bold px-2 py-1 block ${CATEGORY_COLORS[news.category]}`}>
            {news.category}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold font-serif leading-snug group-hover:text-news-red transition-colors line-clamp-3">
          {news.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{news.summary}</p>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-3 pt-3 border-t border-border flex-wrap">
          <span className="flex items-center gap-1"><Clock size={9} />{formatDate(news.date)}</span>
          <span className="flex items-center gap-1"><User size={9} />{news.author}</span>
        </div>
      </div>
    </Link>
  )
}
