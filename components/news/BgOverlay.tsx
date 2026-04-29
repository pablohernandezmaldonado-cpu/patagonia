"use client"

import { useEffect, useState } from "react"
import { getBgSection, type BgSection } from "@/lib/bg-store"

interface BgOverlayProps {
  section: BgSection["id"]
  className?: string
  children: React.ReactNode
}

export default function BgOverlay({ section, className = "", children }: BgOverlayProps) {
  const [bg, setBg] = useState<BgSection | null>(null)

  useEffect(() => {
    const refresh = () => setBg(getBgSection(section))
    refresh()
    window.addEventListener("bg-updated", refresh)
    window.addEventListener("storage", refresh)
    return () => {
      window.removeEventListener("bg-updated", refresh)
      window.removeEventListener("storage", refresh)
    }
  }, [section])

  const active = !!bg && bg.activo && !!bg.imageUrl

  if (!active || !bg) {
    return <div className={className}>{children}</div>
  }

  // bg-image con filtro y overlay via pseudo-elemento en el mismo elemento
  // Usamos un wrapper con posición relativa y background-image CSS
  const wrapperStyle: React.CSSProperties = {
    position: "relative",
    isolation: "isolate",
  }

  // La imagen va via un ::before simulado con un div absolutamente posicionado
  const imgDivStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${bg.imageUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: `blur(${bg.blur}px)`,
    transform: "scale(1.1)", // evita bordes blancos del blur
    zIndex: -2,
  }

  // Overlay semitransparente del color de fondo
  // opacidad 15 = imagen visible al 15% → overlay al 85%
  const overlayStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    backgroundColor: "var(--background)",
    opacity: 1 - (bg.opacidad / 100),
    zIndex: -1,
  }

  return (
    <div className={className} style={wrapperStyle}>
      <div aria-hidden="true" style={imgDivStyle} />
      <div aria-hidden="true" style={overlayStyle} />
      {children}
    </div>
  )
}
