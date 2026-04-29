"use client"

import { useEffect, useState } from "react"

export default function WeatherClock() {
  const [hh, setHh] = useState("--")
  const [mm, setMm] = useState("--")
  const [ss, setSs] = useState("--")
  const [dateStr, setDateStr] = useState("")
  const [blink, setBlink] = useState(true)

  useEffect(() => {
    function tick() {
      const now = new Date()
      setHh(String(now.getHours()).padStart(2, "0"))
      setMm(String(now.getMinutes()).padStart(2, "0"))
      setSs(String(now.getSeconds()).padStart(2, "0"))
      setBlink((b) => !b)
      setDateStr(
        now.toLocaleDateString("es-CL", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // Usa las CSS variables inyectadas por ColorProvider (con fallback)
  const blockMain: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 52,
    height: 52,
    backgroundColor: "var(--clock-block-bg, #18181b)",
    borderRadius: 4,
    boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
  }

  const blockSec: React.CSSProperties = {
    ...blockMain,
    backgroundColor: "var(--clock-seconds-bg, #d4d4d8)",
  }

  const numMain: React.CSSProperties = {
    fontFamily: "monospace",
    fontWeight: 900,
    fontSize: 26,
    color: "var(--clock-block-text, #ffffff)",
    lineHeight: 1,
    fontVariantNumeric: "tabular-nums",
  }

  const numSec: React.CSSProperties = {
    ...numMain,
    color: "var(--clock-seconds-text, #27272a)",
  }

  const sep: React.CSSProperties = {
    fontWeight: 900,
    fontSize: 22,
    color: "var(--clock-separator, #52525b)",
    lineHeight: 1,
    opacity: blink ? 1 : 0.15,
    transition: "opacity 0.15s",
    userSelect: "none",
    marginLeft: 2,
    marginRight: 2,
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}
      className="hidden lg:flex"
      aria-label="Reloj digital"
    >
      {/* Fecha */}
      <span style={{ fontSize: 12, fontWeight: 500, color: "var(--clock-date-text, #71717a)", textTransform: "capitalize", letterSpacing: "0.02em" }}>
        {dateStr}
      </span>

      {/* Bloques flip-clock */}
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        <div style={blockMain}><span style={numMain}>{hh}</span></div>
        <span style={sep}>:</span>
        <div style={blockMain}><span style={numMain}>{mm}</span></div>
        <span style={sep}>:</span>
        <div style={blockSec}><span style={numSec}>{ss}</span></div>
      </div>
    </div>
  )
}
