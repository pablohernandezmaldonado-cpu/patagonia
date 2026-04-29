"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/news/Header"
import HeroNews, { BreakingNewsTicker } from "@/components/news/HeroNews"
import NewsCard from "@/components/news/NewsCard"
import Sidebar from "@/components/news/Sidebar"
import Footer from "@/components/news/Footer"
import PublicidadPanel from "@/components/news/PublicidadPanel"
import RedesSocialesPanel from "@/components/news/RedesSocialesPanel"
import BgOverlay from "@/components/news/BgOverlay"
import CanalesEnVivo from "@/components/news/CanalesEnVivo"
import RadioSection from "@/components/news/RadioSection"
import ColorProvider from "@/components/news/ColorProvider"
import WeatherStrip from "@/components/news/WeatherStrip"
import { getNews, type NewsItem, type Category, CATEGORY_COLORS } from "@/lib/news-store"
import { Newspaper } from "lucide-react"

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="w-1.5 h-6 bg-news-red inline-block" />
      <h2 className="font-serif font-black text-lg text-foreground uppercase tracking-widest">{title}</h2>
      <span className="flex-1 h-px bg-border" />
    </div>
  )
}

function HomeContent() {
  const searchParams = useSearchParams()
  const categoria = searchParams.get("categoria") as Category | null
  const [news, setNews] = useState<NewsItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setNews(getNews())
  }, [])

  // Re-sync when storage changes (e.g. after admin edits)
  useEffect(() => {
    if (!mounted) return
    const handler = () => setNews(getNews())
    window.addEventListener("storage", handler)
    return () => window.removeEventListener("storage", handler)
  }, [mounted])

  const sortedNews = [...news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const breakingNews = sortedNews.filter((n) => n.breaking)
  const featured = sortedNews.find((n) => n.featured) ?? sortedNews[0]
  const secondaryHero = sortedNews.filter((n) => n.id !== featured?.id).slice(0, 3)

  const filteredNews = categoria ? sortedNews.filter((n) => n.category === categoria) : sortedNews
  const mainGridNews = categoria
    ? filteredNews
    : sortedNews.filter((n) => n.id !== featured?.id)

  const latestForSidebar = sortedNews.slice(0, 8)

  if (!mounted || news.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center gap-4 text-muted-foreground">
        <Newspaper size={52} strokeWidth={1} />
        <p className="font-serif text-lg">Cargando noticias...</p>
      </div>
    )
  }

  return (
    <main className="max-w-[1400px] mx-auto px-4 py-6">
      {/* Breaking news ticker */}
      {breakingNews.length > 0 && <BreakingNewsTicker items={breakingNews} />}

      {/* Category filter header */}
      {categoria && (
        <div className="mb-6 flex items-center gap-3">
          <span className={`px-3 py-1 font-bold text-sm ${CATEGORY_COLORS[categoria]}`}>{categoria}</span>
          <h1 className="font-serif font-black text-xl italic">Noticias de {categoria}</h1>
          <a href="/" className="ml-auto text-sm text-muted-foreground hover:text-foreground transition-colors underline">
            Ver todas las noticias
          </a>
        </div>
      )}

      {/* 3-column layout: Publicidad | Contenido | Sidebar */}
      <div className="flex gap-5">

        {/* LEFT – Columna redes + publicidad (visible desde lg) */}
        <div className="hidden lg:flex flex-col gap-0 w-40 shrink-0">
          <RedesSocialesPanel />
          <PublicidadPanel />
        </div>

        {/* CENTER – contenido principal */}
        <div className="flex-1 min-w-0">

          {/* HERO con fondo difuminado */}
          {!categoria && featured && (
            <BgOverlay section="hero" className="mb-8">
              <HeroNews featured={featured} secondary={secondaryHero} />
            </BgOverlay>
          )}

          {/* SECCIÓN CENTRAL con fondo difuminado */}
          <BgOverlay section="medio">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-0">
              <div className="lg:col-span-2 space-y-8">
                <section>
                  <SectionTitle title={categoria ? `${categoria}` : "Últimas Noticias"} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {mainGridNews.slice(0, 6).map((item) => (
                      <NewsCard key={item.id} news={item} variant="vertical" />
                    ))}
                  </div>
                </section>

                {mainGridNews.length > 6 && (
                  <section>
                    <SectionTitle title="Más Noticias" />
                    <div className="space-y-4">
                      {mainGridNews.slice(6).map((item) => (
                        <NewsCard key={item.id} news={item} variant="horizontal" />
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* Sidebar */}
              <Sidebar latestNews={latestForSidebar} allNews={news} />
            </div>
          </BgOverlay>

        </div>

      </div>
    </main>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ColorProvider />
      <Header />
      <WeatherStrip />
      <Suspense fallback={<div className="flex-1" />}>
        <HomeContent />
      </Suspense>
      <div className="flex-1" />
      <RadioSection />
      <CanalesEnVivo />
      <Footer />
    </div>
  )
}
