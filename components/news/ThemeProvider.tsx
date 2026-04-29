"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

type Theme = "light" | "dark"

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "light",
  toggle: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("patagonia_theme") as Theme | null
    if (stored === "dark" || stored === "light") {
      setTheme(stored)
      document.documentElement.classList.toggle("dark", stored === "dark")
    }
  }, [])

  function toggle() {
    const next: Theme = theme === "light" ? "dark" : "light"
    setTheme(next)
    localStorage.setItem("patagonia_theme", next)
    document.documentElement.classList.toggle("dark", next === "dark")
  }

  if (!mounted) return <>{children}</>

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function ThemeToggleButton() {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={theme === "dark" ? "Modo claro" : "Modo oscuro"}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-background/20 bg-background/10 hover:bg-background/20 transition-all duration-200 text-background/80 hover:text-background"
    >
      {theme === "dark" ? (
        <>
          <Sun size={13} className="text-amber-300" />
          <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Claro</span>
        </>
      ) : (
        <>
          <Moon size={13} className="text-sky-300" />
          <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Oscuro</span>
        </>
      )}
    </button>
  )
}
