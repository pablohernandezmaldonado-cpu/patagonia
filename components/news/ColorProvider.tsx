"use client"

import { useEffect } from "react"
import { getSiteColors, applyCSSVars } from "@/lib/color-store"

export default function ColorProvider() {
  useEffect(() => {
    // Aplicar colores guardados al montar
    applyCSSVars(getSiteColors())

    // Escuchar cambios desde el admin
    const refresh = () => applyCSSVars(getSiteColors())
    window.addEventListener("colors-updated", refresh)
    window.addEventListener("storage", refresh)
    return () => {
      window.removeEventListener("colors-updated", refresh)
      window.removeEventListener("storage", refresh)
    }
  }, [])

  return null
}
