"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, Save, Eye, EyeOff, Check, ShieldCheck } from "lucide-react"
import { getCredentials, saveCredentials } from "@/lib/auth-store"

export default function AdminCredencialesPage() {
  const [usuario, setUsuario]         = useState("")
  const [passwordActual, setPasswordActual] = useState("")
  const [passwordNueva, setPasswordNueva]   = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [verActual, setVerActual]     = useState(false)
  const [verNueva, setVerNueva]       = useState(false)
  const [error, setError]             = useState("")
  const [saved, setSaved]             = useState(false)

  useEffect(() => {
    const creds = getCredentials()
    setUsuario(creds.usuario)
  }, [])

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    const creds = getCredentials()
    if (passwordActual !== creds.password) {
      setError("La contraseña actual es incorrecta.")
      return
    }
    if (passwordNueva.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres.")
      return
    }
    if (passwordNueva !== passwordConfirm) {
      setError("Las contraseñas nuevas no coinciden.")
      return
    }
    if (!usuario.trim()) {
      setError("El usuario no puede estar vacío.")
      return
    }

    saveCredentials({ usuario: usuario.trim(), password: passwordNueva })
    setSaved(true)
    setPasswordActual("")
    setPasswordNueva("")
    setPasswordConfirm("")
    setTimeout(() => setSaved(false), 4000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground shadow">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-1.5 text-sm text-primary-foreground/70 hover:text-white transition-colors">
            <ChevronLeft size={16} /> Volver al admin
          </Link>
          <h1 className="font-black text-sm uppercase tracking-widest ml-2">Cambiar Credenciales</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-card border border-border p-6 space-y-6">

          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <ShieldCheck size={22} className="text-primary" />
            <div>
              <h2 className="font-black text-base">Seguridad del Admin</h2>
              <p className="text-xs text-muted-foreground">Cambia el usuario y contraseña de acceso al panel.</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5">

            {/* Usuario */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Nombre de usuario
              </label>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                autoComplete="username"
                className="border border-input px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="h-px bg-border" />

            {/* Contraseña actual */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Contraseña actual <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type={verActual ? "text" : "password"}
                  value={passwordActual}
                  onChange={(e) => setPasswordActual(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Ingresa tu contraseña actual"
                  className="w-full border border-input px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                />
                <button type="button" onClick={() => setVerActual(!verActual)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                  {verActual ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Nueva contraseña */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Nueva contraseña
              </label>
              <div className="relative">
                <input
                  type={verNueva ? "text" : "password"}
                  value={passwordNueva}
                  onChange={(e) => setPasswordNueva(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Minimo 6 caracteres"
                  className="w-full border border-input px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                />
                <button type="button" onClick={() => setVerNueva(!verNueva)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                  {verNueva ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Confirmar contraseña */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Confirmar nueva contraseña
              </label>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Repite la nueva contraseña"
                className="border border-input px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {error && (
              <p className="text-xs text-destructive font-semibold bg-destructive/10 px-3 py-2 border border-destructive/20">
                {error}
              </p>
            )}

            {saved && (
              <div className="flex items-center gap-2 text-sm font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-2">
                <Check size={15} />
                Credenciales actualizadas correctamente.
              </div>
            )}

            <button
              type="submit"
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 font-black uppercase tracking-widest text-sm hover:opacity-90 transition-opacity"
            >
              <Save size={15} />
              Guardar cambios
            </button>

          </form>

          <div className="pt-4 border-t border-border">
            <p className="text-[11px] text-muted-foreground">
              Credenciales por defecto: usuario <span className="font-mono font-bold">admin</span> / contraseña <span className="font-mono font-bold">patagonia2026</span>. Cambia esto antes de publicar.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
