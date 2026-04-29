"use client"

import { useState, useEffect } from "react"
import { isLoggedIn, login, logout } from "@/lib/auth-store"
import { Lock, Eye, EyeOff, LogOut, ShieldCheck } from "lucide-react"

// ─── Pantalla de Login ────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [usuario, setUsuario]   = useState("")
  const [password, setPassword] = useState("")
  const [verPass, setVerPass]   = useState(false)
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Pequeño delay visual para dar feedback
    setTimeout(() => {
      const ok = login(usuario.trim(), password)
      if (ok) {
        onLogin()
      } else {
        setError("Usuario o contraseña incorrectos.")
        setLoading(false)
      }
    }, 400)
  }

  return (
    <div className="min-h-screen bg-foreground flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo + titulo */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/api-attachments/qbX9m88wfpFbR3PGWuHbe-9RO2Fice8ftjgBtfnujeQlteUxBG4j.png"
            alt="Patagonia al Día"
            className="w-24 h-24 object-contain mb-4"
          />
          <h1 className="font-serif font-black text-2xl text-background leading-none">
            Patagonia <span className="text-news-red">al Día</span>
          </h1>
          <p className="text-xs text-background/50 uppercase tracking-widest mt-1">
            Panel de Administración
          </p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border p-6 space-y-4 shadow-2xl"
        >
          <div className="flex items-center gap-2 mb-2">
            <Lock size={15} className="text-primary" />
            <span className="text-sm font-black uppercase tracking-widest text-foreground">
              Acceso Privado
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Usuario
            </label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              autoComplete="username"
              required
              placeholder="Ingresa tu usuario"
              className="border border-input px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={verPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                placeholder="Ingresa tu contraseña"
                className="w-full border border-input px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary pr-10"
              />
              <button
                type="button"
                onClick={() => setVerPass(!verPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {verPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-destructive font-semibold bg-destructive/10 px-3 py-2 border border-destructive/20">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-2.5 font-black uppercase tracking-widest text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? "Verificando..." : "Ingresar"}
          </button>

          <a
            href="/"
            className="block text-center text-xs text-muted-foreground hover:text-foreground transition-colors mt-2"
          >
            Volver al portal
          </a>
        </form>

        <p className="text-center text-[10px] text-background/30 mt-6 uppercase tracking-widest">
          Acceso restringido al equipo editorial
        </p>
      </div>
    </div>
  )
}

// ─── Boton de cerrar sesion ───────────────────────────────────────────────────
export function LogoutButton() {
  function handleLogout() {
    logout()
    window.location.href = "/admin"
  }
  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-1.5 text-xs text-primary-foreground/70 hover:text-white transition-colors px-3 py-1.5 border border-white/20 hover:border-white/40"
    >
      <LogOut size={13} />
      Salir
    </button>
  )
}

// ─── Guard principal ──────────────────────────────────────────────────────────
export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed]   = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    setAuthed(isLoggedIn())
    setChecked(true)
  }, [])

  if (!checked) {
    // Evita flash de contenido
    return (
      <div className="min-h-screen bg-foreground flex items-center justify-center">
        <ShieldCheck size={32} className="text-background/30 animate-pulse" />
      </div>
    )
  }

  if (!authed) {
    return <LoginScreen onLogin={() => setAuthed(true)} />
  }

  return <>{children}</>
}
