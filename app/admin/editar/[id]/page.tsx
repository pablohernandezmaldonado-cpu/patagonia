"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getNews, saveNews, type NewsItem } from "@/lib/news-store"
import NewsForm from "@/components/news/NewsForm"
import { ChevronLeft, Newspaper } from "lucide-react"

export default function EditarNoticiaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [article, setArticle] = useState<NewsItem | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const all = getNews()
    const found = all.find((n) => n.id === id)
    if (found) {
      setArticle(found)
    } else {
      setNotFound(true)
    }
  }, [id])

  function handleSave(data: Omit<NewsItem, "id">) {
    const all = getNews()
    const updated = all.map((n) => (n.id === id ? { ...n, ...data } : n))
    saveNews(updated)
    router.push("/admin")
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="font-serif text-xl font-black mb-4">Noticia no encontrada</p>
          <Link href="/admin" className="text-news-red underline text-sm">
            Volver al panel
          </Link>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin header */}
      <div className="bg-primary text-primary-foreground shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Newspaper size={22} />
            <div>
              <h1 className="font-serif font-black text-base leading-none">Patagonia al Día</h1>
              <p className="text-[11px] text-primary-foreground/60 uppercase tracking-widest">Editar Noticia</p>
            </div>
          </div>
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-sm text-primary-foreground/70 hover:text-white transition-colors"
          >
            <ChevronLeft size={16} />
            Volver al Panel
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="font-serif font-black text-2xl">Editar Noticia</h2>
          <p className="text-muted-foreground text-sm mt-1 line-clamp-1">{article.title}</p>
        </div>

        <div className="bg-card border border-border p-6 md:p-8">
          <NewsForm
            initial={article}
            isEdit
            onSave={handleSave}
            onCancel={() => router.push("/admin")}
          />
        </div>
      </div>
    </div>
  )
}
