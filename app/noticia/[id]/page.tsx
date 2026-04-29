"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import Header from "@/components/news/Header"
import Footer from "@/components/news/Footer"
import Sidebar from "@/components/news/Sidebar"
import NewsCard from "@/components/news/NewsCard"
import { getNews, type NewsItem, CATEGORY_COLORS, formatDate } from "@/lib/news-store"
import { Clock, User, ChevronRight, Home, Pencil } from "lucide-react"

export default function NoticiaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [news, setNews] = useState<NewsItem[]>([])
  const [article, setArticle] = useState<NewsItem | null>(null)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const all = getNews()
    setNews(all)
    const found = all.find((n) => n.id === id)
    setArticle(found ?? null)
  }, [id])

  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-24 flex items-center justify-center text-muted-foreground">
          <p className="font-serif text-lg">Cargando noticia...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="font-serif text-2xl font-black mb-4">Noticia no encontrada</h1>
          <Link href="/" className="text-news-red underline">
            Volver al inicio
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const related = news
    .filter((n) => n.id !== article.id && n.category === article.category)
    .slice(0, 4)
  const latestForSidebar = [...news]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-5" aria-label="Navegación">
          <Link href="/" className="hover:text-foreground flex items-center gap-1">
            <Home size={12} />
            Inicio
          </Link>
          <ChevronRight size={12} />
          <Link href={`/?categoria=${article.category}`} className="hover:text-foreground">
            {article.category}
          </Link>
          <ChevronRight size={12} />
          <span className="line-clamp-1 text-foreground">{article.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Article */}
          <article className="lg:col-span-2">
            <span className={`text-xs font-bold px-2 py-1 rounded ${CATEGORY_COLORS[article.category]}`}>
              {article.category}
            </span>

            <h1 className="font-serif font-black text-2xl lg:text-3xl mt-3 leading-snug text-balance">
              {article.title}
            </h1>

            <p className="text-muted-foreground text-base mt-3 leading-relaxed font-serif italic border-l-4 border-news-red pl-4">
              {article.summary}
            </p>

            <div className="flex items-center gap-4 mt-4 pb-4 border-b border-border text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">
                <User size={14} />
                {article.author}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {formatDate(article.date)}
              </span>
              <Link
                href={`/admin/editar/${article.id}`}
                className="ml-auto flex items-center gap-1 text-xs text-primary hover:text-news-red transition-colors"
              >
                <Pencil size={12} />
                Editar
              </Link>
            </div>

            {/* Hero image */}
            <div className="mt-5 overflow-hidden border border-border">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full max-h-[460px] object-cover"
              />
            </div>

            {/* Body */}
            <div className="mt-6 space-y-4">
              {article.content.split("\n\n").map((paragraph, i) => (
                <p key={i} className="text-base leading-relaxed text-foreground font-sans">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Related */}
            {related.length > 0 && (
              <section className="mt-10">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-1 h-6 bg-news-red rounded-full inline-block" />
                  <h2 className="font-serif font-black text-lg uppercase tracking-wide">Noticias Relacionadas</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {related.map((n) => (
                    <NewsCard key={n.id} news={n} variant="vertical" />
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* Sidebar */}
          <Sidebar latestNews={latestForSidebar} allNews={news} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
