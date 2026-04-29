"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { getNews, saveNews, createNewsItem, type NewsItem } from "@/lib/news-store"
import NewsForm from "@/components/news/NewsForm"
import { ChevronLeft, Newspaper } from "lucide-react"

export default function NuevaNoticiaPage() {
  const router = useRouter()

  function handleSave(data: Omit<NewsItem, "id">) {
    const existing = getNews()
    const newItem = createNewsItem(data)
    saveNews([newItem, ...existing])
    router.push("/admin")
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
              <p className="text-[11px] text-primary-foreground/60 uppercase tracking-widest">Nueva Noticia</p>
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
          <h2 className="font-serif font-black text-2xl">Publicar Nueva Noticia</h2>
          <p className="text-muted-foreground text-sm mt-1">Completa el formulario para agregar una nueva noticia al portal.</p>
        </div>

        <div className="bg-card border border-border p-6 md:p-8">
          <NewsForm
            onSave={handleSave}
            onCancel={() => router.push("/admin")}
          />
        </div>
      </div>
    </div>
  )
}
