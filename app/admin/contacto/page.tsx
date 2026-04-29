"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, Save, Phone, Mail, MapPin, MessageCircle, Check, Plus, Trash2, GripVertical, ToggleLeft, ToggleRight } from "lucide-react"
import { getContactInfo, saveContactInfo, type ContactInfo, type FooterLink } from "@/lib/contact-store"

export default function AdminContactoPage() {
  const [form, setForm] = useState<ContactInfo>(getContactInfo())
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setForm(getContactInfo())
  }, [])

  function handleChange(field: keyof ContactInfo, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleSave() {
    saveContactInfo(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  // Portal links CRUD
  function addLink() {
    const newLink: FooterLink = { id: Date.now().toString(), label: "", url: "", activo: true }
    setForm((f) => ({ ...f, portalLinks: [...(f.portalLinks ?? []), newLink] }))
  }

  function updateLink(id: string, field: keyof FooterLink, value: string | boolean) {
    setForm((f) => ({
      ...f,
      portalLinks: (f.portalLinks ?? []).map((l) => l.id === id ? { ...l, [field]: value } : l),
    }))
  }

  function removeLink(id: string) {
    setForm((f) => ({ ...f, portalLinks: (f.portalLinks ?? []).filter((l) => l.id !== id) }))
  }

  const waPreview = form.whatsapp
    ? `https://wa.me/${form.whatsapp}?text=${encodeURIComponent(form.whatsappMensaje)}`
    : ""

  return (
    <div className="min-h-screen bg-background">
      {/* Header admin */}
      <div className="bg-primary text-primary-foreground shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/api-attachments/qbX9m88wfpFbR3PGWuHbe-9RO2Fice8ftjgBtfnujeQlteUxBG4j.png"
              alt="Patagonia al Día"
              className="w-10 h-10 object-contain"
            />
            <div>
              <h1 className="font-black font-serif text-lg leading-none">Contacto y Footer</h1>
              <p className="text-[11px] text-primary-foreground/60 uppercase tracking-widest">Panel de configuracion</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-1.5 text-sm text-primary-foreground/70 hover:text-white transition-colors">
              <ChevronLeft size={16} /> Volver al Admin
            </Link>
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-4 py-2 font-bold text-sm transition-all ${saved ? "bg-green-600" : "bg-news-red hover:opacity-90"} text-white`}
            >
              {saved ? <><Check size={15} /> Guardado</> : <><Save size={15} /> Guardar Cambios</>}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* Identidad del sitio */}
        <section className="bg-card border border-border p-6 space-y-4">
          <h2 className="font-black text-sm uppercase tracking-widest text-foreground border-b border-border pb-2 flex items-center gap-2">
            <span className="w-1 h-4 bg-primary inline-block" /> Identidad del Sitio
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Nombre del sitio", field: "nombreSitio" as keyof ContactInfo, placeholder: "Patagonia al Dia" },
              { label: "Slogan / Subtitulo", field: "slogan" as keyof ContactInfo, placeholder: "Noticias de la Region de Aysen" },
              { label: "Copyright (texto de pie)", field: "copyright" as keyof ContactInfo, placeholder: "Patagonia al Dia" },
              { label: "Ciudad (pie de pagina)", field: "ciudad" as keyof ContactInfo, placeholder: "Coyhaique, Patagonia Chilena" },
            ].map(({ label, field, placeholder }) => (
              <div key={field} className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</label>
                <input
                  type="text"
                  value={form[field] as string}
                  onChange={(e) => handleChange(field, e.target.value)}
                  placeholder={placeholder}
                  className="border border-input px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            ))}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Descripcion del sitio (pie de pagina)</label>
              <textarea
                value={form.descripcion ?? ""}
                onChange={(e) => handleChange("descripcion", e.target.value)}
                placeholder="Descripcion breve del portal para el footer..."
                rows={3}
                className="border border-input px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
          </div>
        </section>

        {/* Links del bloque Portal (negro) */}
        <section className="bg-card border border-border p-6 space-y-4">
          <h2 className="font-black text-sm uppercase tracking-widest text-foreground border-b border-border pb-2 flex items-center gap-2">
            <span className="w-1 h-4 bg-black inline-block" /> Links del bloque &ldquo;Portal&rdquo; en el Footer
          </h2>
          <p className="text-xs text-muted-foreground">Estos enlaces aparecen en el recuadro negro del pie de pagina. Puedes agregar, editar o desactivar cada uno.</p>

          <div className="space-y-2">
            {(form.portalLinks ?? []).map((link, i) => (
              <div key={link.id} className="flex items-center gap-2 p-3 bg-secondary/40 border border-border">
                <GripVertical size={14} className="text-muted-foreground shrink-0" />
                <span className="text-xs text-muted-foreground font-bold w-5 shrink-0">{i + 1}</span>
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => updateLink(link.id, "label", e.target.value)}
                  placeholder="Nombre del enlace"
                  className="flex-1 border border-input px-2 py-1.5 text-xs bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary min-w-0"
                />
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => updateLink(link.id, "url", e.target.value)}
                  placeholder="/ruta o https://..."
                  className="flex-1 border border-input px-2 py-1.5 text-xs bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary min-w-0 font-mono"
                />
                <button
                  type="button"
                  title={link.activo ? "Desactivar" : "Activar"}
                  onClick={() => updateLink(link.id, "activo", !link.activo)}
                  className={`shrink-0 transition-colors ${link.activo ? "text-primary" : "text-muted-foreground"}`}
                >
                  {link.activo ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                </button>
                <button
                  type="button"
                  title="Eliminar enlace"
                  onClick={() => removeLink(link.id)}
                  className="shrink-0 text-destructive hover:opacity-70 transition-opacity"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addLink}
            className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors font-semibold w-full justify-center"
          >
            <Plus size={15} /> Agregar enlace
          </button>

          {/* Preview del bloque negro */}
          <div className="bg-black rounded p-4 mt-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-3 flex items-center gap-1.5">
              <span className="w-0.5 h-3 bg-news-red inline-block" /> Vista previa del bloque Portal
            </p>
            <ul className="space-y-1.5">
              {(form.portalLinks ?? []).filter(l => l.activo && l.label).map((link) => (
                <li key={link.id} className="text-xs text-white/55">{link.label}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Informacion de contacto */}
        <section className="bg-card border border-border p-6 space-y-4">
          <h2 className="font-black text-sm uppercase tracking-widest text-foreground border-b border-border pb-2 flex items-center gap-2">
            <span className="w-1 h-4 bg-news-red inline-block" /> Informacion de Contacto
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <MapPin size={12} /> Direccion
              </label>
              <input
                type="text"
                value={form.direccion}
                onChange={(e) => handleChange("direccion", e.target.value)}
                placeholder="Coyhaique, Region de Aysen, Chile"
                className="border border-input px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Phone size={12} /> Telefono
              </label>
              <input
                type="tel"
                value={form.telefono}
                onChange={(e) => handleChange("telefono", e.target.value)}
                placeholder="+56 67 2 241430"
                className="border border-input px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Mail size={12} /> Email de contacto
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="contacto@patagoniaaldia.cl"
                className="border border-input px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </section>

        {/* WhatsApp */}
        <section className="bg-card border border-border p-6 space-y-4">
          <h2 className="font-black text-sm uppercase tracking-widest text-foreground border-b border-border pb-2 flex items-center gap-2">
            <span className="w-1 h-4 bg-[#25D366] inline-block" />
            <MessageCircle size={14} className="text-[#25D366]" /> Boton flotante de WhatsApp
          </h2>

          {/* Toggle activo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleChange("whatsappActivo", !form.whatsappActivo)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${form.whatsappActivo ? "bg-[#25D366]" : "bg-muted"}`}
              aria-label="Activar/desactivar boton WhatsApp"
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${form.whatsappActivo ? "translate-x-5" : "translate-x-0"}`} />
            </button>
            <span className="text-sm font-semibold">
              {form.whatsappActivo ? "Boton activo (visible en el portal)" : "Boton desactivado (oculto)"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Numero WhatsApp
              </label>
              <div className="flex items-center border border-input bg-background">
                <span className="px-3 py-2 text-xs text-muted-foreground bg-secondary border-r border-input font-mono">+</span>
                <input
                  type="tel"
                  value={form.whatsapp}
                  onChange={(e) => handleChange("whatsapp", e.target.value.replace(/\D/g, ""))}
                  placeholder="56912345678"
                  className="flex-1 px-3 py-2 text-sm bg-transparent text-foreground focus:outline-none font-mono"
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                Codigo de pais + numero sin espacios. Ej: 56912345678
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Mensaje pre-cargado
              </label>
              <input
                type="text"
                value={form.whatsappMensaje}
                onChange={(e) => handleChange("whatsappMensaje", e.target.value)}
                placeholder="Hola, me comunico desde el portal Patagonia al Dia."
                className="border border-input px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-[10px] text-muted-foreground">
                Este texto aparece automaticamente en el chat al abrir WhatsApp.
              </p>
            </div>
          </div>

          {/* Preview del boton */}
          {form.whatsapp && (
            <div className="border border-border p-4 bg-secondary/30">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Vista previa del boton</p>
              <div className="flex items-center gap-4">
                <a
                  href={waPreview}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#1ebe5a] hover:scale-110 transition-all duration-200"
                >
                  <MessageCircle size={28} fill="white" strokeWidth={1.5} />
                </a>
                <div>
                  <p className="text-sm font-bold text-foreground">+{form.whatsapp}</p>
                  <p className="text-xs text-muted-foreground italic mt-0.5">&ldquo;{form.whatsappMensaje}&rdquo;</p>
                  <a
                    href={waPreview}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-[#25D366] underline mt-1 inline-block"
                  >
                    Probar enlace
                  </a>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Guardar al pie */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-3 font-black text-sm transition-all ${saved ? "bg-green-600" : "bg-news-red hover:opacity-90"} text-white uppercase tracking-widest`}
          >
            {saved ? <><Check size={16} /> Cambios guardados</> : <><Save size={16} /> Guardar todo</>}
          </button>
        </div>

      </div>
    </div>
  )
}
