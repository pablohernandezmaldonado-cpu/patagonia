// Autenticacion simple con localStorage para el panel admin

const SESSION_KEY = "patagonia_admin_session"
const CREDS_KEY   = "patagonia_admin_creds"

export interface AdminCredentials {
  usuario: string
  password: string // almacenado como texto plano (app local sin backend)
}

const DEFAULT_CREDS: AdminCredentials = {
  usuario:  "admin",
  password: "patagonia2026",
}

export function getCredentials(): AdminCredentials {
  if (typeof window === "undefined") return DEFAULT_CREDS
  try {
    const stored = localStorage.getItem(CREDS_KEY)
    return stored ? JSON.parse(stored) : DEFAULT_CREDS
  } catch {
    return DEFAULT_CREDS
  }
}

export function saveCredentials(creds: AdminCredentials): void {
  localStorage.setItem(CREDS_KEY, JSON.stringify(creds))
}

export function login(usuario: string, password: string): boolean {
  const creds = getCredentials()
  if (usuario === creds.usuario && password === creds.password) {
    localStorage.setItem(SESSION_KEY, "1")
    return true
  }
  return false
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY)
}

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(SESSION_KEY) === "1"
}
