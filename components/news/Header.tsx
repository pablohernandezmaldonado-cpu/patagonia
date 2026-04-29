"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Facebook, Instagram, Youtube, Twitter, Search, MapPin, Snowflake, Sun, Leaf, Flower2 } from "lucide-react"
import { CATEGORIES } from "@/lib/news-store"
import { ThemeToggleButton } from "@/components/news/ThemeProvider"
import WeatherClock from "@/components/news/WeatherClock"

function getEstacion(): { nombre: string; icono: React.ElementType; color: string } {
  // Chile: hemisferio sur – estaciones invertidas respecto al norte
  const mes = new Date().getMonth() + 1 // 1-12
  if (mes >= 12 || mes <= 2) return { nombre: "Verano", icono: Sun, color: "text-amber-400" }
  if (mes >= 3 && mes <= 5)  return { nombre: "Otoño",  icono: Leaf, color: "text-orange-400" }
  if (mes >= 6 && mes <= 8)  return { nombre: "Invierno", icono: Snowflake, color: "text-sky-300" }
  return { nombre: "Primavera", icono: Flower2, color: "text-green-400" }
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const today = new Date().toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const estacion = getEstacion()

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Top utility bar */}
      <div className="bg-foreground text-background py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <span className="capitalize flex items-center gap-2 text-background/70 font-sans">
            <MapPin size={11} />
            <span className="hidden sm:inline">{today} &mdash; Coyhaique, Región de Aysén</span>
            <span className="sm:hidden">{today}</span>
            <span className="hidden sm:flex items-center gap-1 bg-background/10 px-2 py-0.5 rounded-full">
              <estacion.icono size={11} className={estacion.color} />
              <span className={`text-[10px] font-bold italic ${estacion.color}`}>{estacion.nombre}</span>
            </span>
          </span>
          <div className="flex items-center gap-3">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-background/70 hover:text-background transition-colors">
              <Facebook size={13} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-background/70 hover:text-background transition-colors">
              <Twitter size={13} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-background/70 hover:text-background transition-colors">
              <Instagram size={13} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-background/70 hover:text-background transition-colors">
              <Youtube size={13} />
            </a>
            <span className="w-px h-3 bg-background/30" />
            <ThemeToggleButton />
            <span className="w-px h-3 bg-background/30" />
            <Link href="/admin" className="text-background/70 hover:text-background transition-colors font-semibold uppercase tracking-wider text-[10px]">
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Logo / Brand bar */}
      <div className="bg-card border-b border-border py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/api-attachments/qbX9m88wfpFbR3PGWuHbe-9RO2Fice8ftjgBtfnujeQlteUxBG4j.png"
              alt="Patagonia al Día – Noticias de la Región de Aysén"
              width={80}
              height={80}
              className="w-16 h-16 md:w-20 md:h-20 object-contain group-hover:scale-105 transition-transform duration-200"
            />
            <div className="hidden sm:block">
              <span className="whitespace-nowrap font-serif font-black text-2xl md:text-3xl leading-none tracking-tight">
                {/* Fondo claro: verde | Fondo oscuro: blanco brillante */}
                <span className="text-primary dark:text-emerald-400">Patagonia </span>
                {/* Fondo claro: naranja | Fondo oscuro: amarillo dorado */}
                <span className="text-news-red italic dark:text-amber-300">al Día</span>
              </span>
              <span className="block text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                Noticias de la Región de Aysén
              </span>
            </div>
          </Link>

          {/* Clima + Relojes en tiempo real */}
          <WeatherClock />

          {/* Search bar */}
          <div className="flex items-center gap-2">
            <div className={`${searchOpen ? "flex" : "hidden"} sm:flex items-center border border-border rounded bg-secondary px-3 py-2 gap-2 w-40 md:w-56 transition-all`}>
              <Search size={13} className="text-muted-foreground shrink-0" />
              <input
                type="search"
                placeholder="Buscar noticias..."
                aria-label="Buscar noticias"
                className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground"
              />
            </div>
            <button
              className="sm:hidden p-2 rounded hover:bg-secondary transition-colors"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Buscar"
            >
              <Search size={20} />
            </button>
            <button
              className="md:hidden p-2 rounded hover:bg-secondary transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop nav */}
      <nav className="bg-primary text-primary-foreground hidden md:block" aria-label="Secciones">
        <div className="max-w-7xl mx-auto px-4 flex items-center overflow-x-auto">
          <Link
            href="/"
            className="shrink-0 px-4 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-news-red transition-colors border-r border-white/15"
          >
            Inicio
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={cat === "ENTREVISTAS" ? "/entrevistas" : `/?categoria=${cat}`}
              className="shrink-0 px-4 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-news-red transition-colors border-r border-white/15"
            >
              {cat}
            </Link>
          ))}
          <Link
            href="/musica"
            className="shrink-0 px-4 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-news-red transition-colors border-r border-white/15"
          >
            Música
          </Link>
          <Link
            href="/nosotros"
            className="shrink-0 px-4 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-news-red transition-colors"
          >
            Nosotros
          </Link>
        </div>
      </nav>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="md:hidden bg-primary text-primary-foreground" aria-label="Menú móvil">
          <ul className="divide-y divide-white/10">
            <li>
              <Link href="/" className="block px-5 py-3.5 text-sm font-bold uppercase tracking-wide hover:bg-news-red transition-colors" onClick={() => setMenuOpen(false)}>
                Inicio
              </Link>
            </li>
            {CATEGORIES.map((cat) => (
              <li key={cat}>
                <Link
                  href={cat === "ENTREVISTAS" ? "/entrevistas" : `/?categoria=${cat}`}
                  className="block px-5 py-3.5 text-sm font-bold uppercase tracking-wide hover:bg-news-red transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {cat}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/musica" className="block px-5 py-3.5 text-sm font-bold uppercase tracking-wide hover:bg-news-red transition-colors" onClick={() => setMenuOpen(false)}>
                Música
              </Link>
            </li>
            <li>
              <Link href="/nosotros" className="block px-5 py-3.5 text-sm font-bold uppercase tracking-wide hover:bg-news-red transition-colors" onClick={() => setMenuOpen(false)}>
                Nosotros
              </Link>
            </li>
            <li>
              <Link href="/admin" className="block px-5 py-3.5 text-sm font-bold uppercase tracking-wide hover:bg-news-red transition-colors" onClick={() => setMenuOpen(false)}>
                Panel Admin
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
