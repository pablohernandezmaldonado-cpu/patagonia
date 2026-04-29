"use client"

import { useState, useEffect } from "react"
import Header from "@/components/news/Header"
import Footer from "@/components/news/Footer"
import { getNosotrosInfo, type NosotrosInfo } from "@/lib/nosotros-store"
import {
  MapPin, Phone, Mail, Newspaper, Eye, Target, Users, Clock, Award, Radio,
} from "lucide-react"
import { getContactInfo } from "@/lib/contact-store"

// Mapa de iconos para valores
const ICON_MAP: Record<string, React.ElementType> = {
  Transparencia: Eye,
  "Rigor Periodístico": Target,
  "Compromiso Regional": Users,
  Actualidad: Clock,
}

export default function NosotrosPage() {
  const [info, setInfo] = useState<NosotrosInfo>(() => getNosotrosInfo())
  const [contacto, setContacto] = useState(() => getContactInfo())

  useEffect(() => {
    const refresh = () => {
      setInfo(getNosotrosInfo())
      setContacto(getContactInfo())
    }
    window.addEventListener("nosotros-updated", refresh)
    window.addEventListener("contact-updated", refresh)
    return () => {
      window.removeEventListener("nosotros-updated", refresh)
      window.removeEventListener("contact-updated", refresh)
    }
  }, [])

  const d = info

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero */}
      <section className="bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 40px,white 40px,white 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,white 40px,white 41px)" }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-0.5 bg-news-red inline-block" />
            <span className="text-xs font-black uppercase tracking-widest text-primary-foreground/60">{d.heroSubtitle}</span>
          </div>
          <h1 className="font-serif font-black text-4xl md:text-5xl leading-tight text-balance max-w-2xl">
            {d.heroTitle}
          </h1>
          <p className="mt-4 text-primary-foreground/70 text-base leading-relaxed max-w-xl">
            {d.heroDescription}
          </p>
          <div className="mt-8 flex items-center gap-3">
            <div className="bg-news-red text-white font-black font-serif text-2xl w-12 h-12 flex items-center justify-center leading-none select-none shrink-0">
              P
            </div>
            <div>
              <span className="block font-serif font-black text-xl leading-none">Patagonia al Día</span>
              <span className="text-xs text-primary-foreground/50 uppercase tracking-widest">Región de Aysén, Chile</span>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1">

        {/* Stats bar */}
        <div className="bg-news-red text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/20">
              {d.stats.filter(s => s.activo).map((s) => (
                <div key={s.id} className="py-6 px-6 text-center">
                  <p className="font-serif font-black text-3xl">{s.value}</p>
                  <p className="text-xs text-white/70 uppercase tracking-widest mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Historia y misión */}
        <section className="max-w-7xl mx-auto px-4 py-14 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-last lg:order-first">
              <div className="relative">
                <img
                  src="https://placehold.co/700x480?text=Redaccion+Patagonia+al+Dia+equipo+periodistas"
                  alt="Equipo de redacción"
                  className="w-full object-cover border border-border"
                />
                <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-primary hidden sm:flex flex-col items-center justify-center text-primary-foreground">
                  <Radio size={22} />
                  <span className="text-[9px] font-black uppercase tracking-widest mt-1 text-center leading-tight px-1">{d.historiaDesde}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-6 bg-news-red inline-block" />
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Nuestra Historia</span>
              </div>
              <h2 className="font-serif font-black text-3xl leading-tight text-balance">{d.historiaTitle}</h2>
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground">
                {d.historiaTexto1 && <p><strong className="text-foreground">Patagonia al Día</strong> {d.historiaTexto1.replace("Patagonia al Día ", "")}</p>}
                {d.historiaTexto2 && <p>{d.historiaTexto2}</p>}
                {d.historiaTexto3 && <p>{d.historiaTexto3}</p>}
              </div>
            </div>
          </div>
        </section>

        {/* Misión y Visión */}
        <section className="bg-card border-y border-border">
          <div className="max-w-7xl mx-auto px-4 py-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5">
              <div className="bg-primary text-primary-foreground p-8 md:p-10">
                <div className="flex items-center gap-3 mb-5">
                  <Target size={20} className="text-news-red" />
                  <h3 className="font-serif font-black text-xl uppercase tracking-wide">Nuestra Misión</h3>
                </div>
                <p className="text-primary-foreground/80 text-sm leading-relaxed">{d.misionTexto}</p>
              </div>
              <div className="bg-secondary p-8 md:p-10">
                <div className="flex items-center gap-3 mb-5">
                  <Newspaper size={20} className="text-news-red" />
                  <h3 className="font-serif font-black text-xl uppercase tracking-wide">Nuestra Visión</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{d.visionTexto}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="max-w-7xl mx-auto px-4 py-14 md:py-20">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="w-8 h-0.5 bg-news-red inline-block" />
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Lo que nos define</span>
              <span className="w-8 h-0.5 bg-news-red inline-block" />
            </div>
            <h2 className="font-serif font-black text-3xl text-balance">Nuestros Valores</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {d.values.filter(v => v.activo).map((v) => {
              const Icon = ICON_MAP[v.title] ?? Target
              return (
                <div key={v.id} className="bg-card border border-border p-6 hover:shadow-md transition-shadow group">
                  <div className="w-10 h-10 bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-news-red transition-colors">
                    <Icon size={18} className="text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-serif font-black text-base mb-2">{v.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{v.description}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Equipo */}
        <section className="bg-secondary border-y border-border">
          <div className="max-w-7xl mx-auto px-4 py-14 md:py-20">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="w-8 h-0.5 bg-news-red inline-block" />
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">{d.equipoSubtitulo}</span>
                <span className="w-8 h-0.5 bg-news-red inline-block" />
              </div>
              <h2 className="font-serif font-black text-3xl text-balance">Nuestro Equipo</h2>
              <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto">{d.equipoDescripcion}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {d.team.filter(m => m.activo).map((member) => (
                <div key={member.id} className="bg-card border border-border overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="overflow-hidden">
                    <img
                      src={member.img}
                      alt={`${member.name}, ${member.role}`}
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <div className="w-8 h-0.5 bg-news-red mb-3" />
                    <h3 className="font-serif font-black text-base leading-tight">{member.name}</h3>
                    <p className="text-xs font-bold text-news-red uppercase tracking-widest mt-0.5">{member.role}</p>
                    <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contacto */}
        <section className="max-w-7xl mx-auto px-4 py-14 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-6 bg-news-red inline-block" />
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Escríbenos</span>
              </div>
              <h2 className="font-serif font-black text-3xl leading-tight mb-6">Contacto</h2>
              <ul className="space-y-5">
                {contacto.direccion && (
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary flex items-center justify-center shrink-0">
                      <MapPin size={16} className="text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-0.5">Dirección</p>
                      <p className="text-sm">{contacto.direccion}</p>
                    </div>
                  </li>
                )}
                {contacto.telefono && (
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary flex items-center justify-center shrink-0">
                      <Phone size={16} className="text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-0.5">Teléfono</p>
                      <a href={`tel:${contacto.telefono}`} className="text-sm hover:text-news-red transition-colors">{contacto.telefono}</a>
                    </div>
                  </li>
                )}
                {contacto.email && (
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary flex items-center justify-center shrink-0">
                      <Mail size={16} className="text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-0.5">Correo</p>
                      <a href={`mailto:${contacto.email}`} className="text-sm hover:text-news-red transition-colors">{contacto.email}</a>
                    </div>
                  </li>
                )}
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-news-red flex items-center justify-center shrink-0">
                    <Award size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-0.5">Publicidad</p>
                    <a href={`mailto:publicidad@patagoniaaldia.cl`} className="text-sm hover:text-news-red transition-colors">publicidad@patagoniaaldia.cl</a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Formulario de contacto */}
            <div className="bg-card border border-border p-7">
              <h3 className="font-serif font-black text-xl mb-6">Envíanos un mensaje</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">Nombre</label>
                    <input type="text" placeholder="Tu nombre" className="w-full border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">Correo</label>
                    <input type="email" placeholder="tu@correo.cl" className="w-full border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">Asunto</label>
                  <input type="text" placeholder="Asunto del mensaje" className="w-full border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">Mensaje</label>
                  <textarea rows={5} placeholder="Escribe tu mensaje aqui..." className="w-full border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
                </div>
                <button type="submit" className="w-full bg-news-red text-white font-black uppercase tracking-widest text-xs py-3 hover:opacity-90 transition-opacity">
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
