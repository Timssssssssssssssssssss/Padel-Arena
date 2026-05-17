"use client"

import { useState } from "react"
import { FRENCH_CITIES, TEAM_EMOJIS } from "@/lib/mock-data"
import { ChevronDown } from "lucide-react"

export function CreateTeamTab() {
  const [name, setName] = useState("Les Aigles")
  const [emoji, setEmoji] = useState("🦅")
  const [city, setCity] = useState("Lyon")
  const [cityOpen, setCityOpen] = useState(false)
  const [created, setCreated] = useState(false)

  return (
    <div
      className="rounded-xl p-6 border border-border flex flex-col gap-6 max-w-xl"
      style={{ backgroundColor: "#12121f" }}
    >
      <h2 className="text-lg font-bold font-[var(--font-rajdhani)] text-foreground uppercase tracking-wider">
        Creer votre equipe
      </h2>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-text-secondary">Nom de l&apos;equipe</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-10 px-3 rounded-lg text-sm text-foreground outline-none"
          style={{
            backgroundColor: "#0d0d1a",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs text-text-secondary">Emoji de l&apos;equipe</label>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {TEAM_EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEmoji(e)}
              className="h-11 rounded-lg text-xl flex items-center justify-center transition-transform hover:scale-110"
              style={{
                backgroundColor: emoji === e ? "rgba(0,229,160,0.12)" : "#0d0d1a",
                border: emoji === e ? "2px solid #00e5a0" : "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 relative">
        <label className="text-xs text-text-secondary">Ville</label>
        <button
          type="button"
          onClick={() => setCityOpen(!cityOpen)}
          className="h-10 px-3 rounded-lg text-sm text-left flex items-center justify-between w-full"
          style={{
            backgroundColor: "#0d0d1a",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#e0e0f0",
          }}
        >
          {city}
          <ChevronDown className="h-4 w-4" />
        </button>
        {cityOpen && (
          <div
            className="absolute top-full mt-1 left-0 w-full max-h-48 overflow-y-auto rounded-lg border z-50"
            style={{ backgroundColor: "#12121f", borderColor: "rgba(255,255,255,0.1)" }}
          >
            {FRENCH_CITIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => { setCity(c); setCityOpen(false) }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-primary/10"
                style={{ color: c === city ? "#00e5a0" : "#a0a0c0" }}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setCreated(true)}
        className="h-11 rounded-lg text-sm font-bold font-[var(--font-rajdhani)] transition-colors"
        style={{ backgroundColor: "#00e5a0", color: "#070710" }}
      >
        🎮 Creer l&apos;equipe
      </button>

      {created && (
        <p className="text-sm text-primary">
          Equipe {emoji} {name} creee a {city} !
        </p>
      )}
    </div>
  )
}
