"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Mail, Phone, MapPin, Newspaper } from "lucide-react"
import { CATEGORIES } from "@/lib/news-store"
import { getContactInfo, type ContactInfo } from "@/lib/contact-store"
// getContactInfo se usa como fallback síncrono inicial

export default function Footer() {
  const year = new Date().getFullYear()
  const [info, setInfo] = useState<ContactInfo | null>(null)

  useEffect(() => {
    setInfo(getContactInfo())
    const handler = () => setInfo(getContactInfo())
    window.addEventListener("contact-updated", handler)
    window.addEventListener("storage", handler)
    return () => {
      window.removeEventListener("contact-updated", handler)
      window.removeEventListener("storage", handler)
    }
  }, [])

  // Siempre leemos desde el store para que los cambios del admin se reflejen
  const base = getContactInfo()
  const c = info ?? base

  return (
    <footer className="bg-foreground text-background mt-12">
      <div className="h-1 bg-news-red w-full" />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/api-attachments/qbX9m88wfpFbR3PGWuHbe-9RO2Fice8ftjgBtfnujeQlteUxBG4j.png"
                alt={c.nombreSitio}
                className="w-14 h-14 object-contain shrink-0"
              />
              <div>
                <span className="block font-serif font-black text-lg leading-none text-background">{c.nombreSitio}</span>
                <span className="text-[10px] text-background/50 uppercase tracking-widest">{c.slogan}</span>
              </div>
            </div>
            <p className="text-xs text-background/60 leading-relaxed">
              {c.descripcion}
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest mb-4 border-b border-background/15 pb-2 flex items-center gap-2">
              <Newspaper size={13} /> Secciones
            </h4>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link href={cat === "ENTREVISTAS" ? "/entrevistas" : `/?categoria=${cat}`} className="text-xs text-background/55 hover:text-news-red transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
              <li><Link href="/musica" className="text-xs text-background/55 hover:text-news-red transition-colors">MUSICA</Link></li>
              <li><Link href="/nosotros" className="text-xs text-background/55 hover:text-news-red transition-colors">NOSOTROS</Link></li>
            </ul>
          </div>

          {/* Contact – dinamico */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest mb-4 border-b border-background/15 pb-2">
              Contacto
            </h4>
            <ul className="space-y-3 text-xs text-background/55">
              <li className="flex items-start gap-2">
                <MapPin size={13} className="shrink-0 mt-0.5" />
                <span>{c.direccion}</span>
              </li>
              {c.telefono && (
                <li className="flex items-center gap-2">
                  <Phone size={13} />
                  <a href={`tel:${c.telefono.replace(/\s/g, "")}`} className="hover:text-white transition-colors">
                    {c.telefono}
                  </a>
                </li>
              )}
              {c.email && (
                <li className="flex items-center gap-2">
                  <Mail size={13} />
                  <a href={`mailto:${c.email}`} className="hover:text-white transition-colors break-all">
                    {c.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Portal links – fondo negro */}
          <div className="bg-black rounded p-4 -mx-1">
            <h4 className="font-black text-xs uppercase tracking-widest mb-4 border-b border-white/15 pb-2 text-white flex items-center gap-2">
              <span className="w-1 h-3 bg-news-red inline-block" />
              Portal
            </h4>
            <ul className="space-y-2">
              {c.portalLinks
                .filter((l) => l.activo)
                .map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.url}
                      className="text-xs text-white/55 hover:text-news-red transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              <li>
                <Link href="/admin/contacto" className="text-xs text-white/40 hover:text-news-red transition-colors italic">
                  Editar pie de pagina
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      <div className="border-t border-background/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-background/35">
            &copy; {year} {c.copyright} &mdash; Todos los derechos reservados.
          </p>
          <p className="text-[11px] text-background/35">{c.ciudad}</p>
        </div>
      </div>
    </footer>
  )
}
