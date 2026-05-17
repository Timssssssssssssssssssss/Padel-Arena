"use client"

import { useState } from "react"
import { RankBadge } from "@/components/rank-badge"
import {
  CURRENT_PLAYER_ARENA_ID,
  MOCK_PLAYERS_BY_ARENA_ID,
  getRank,
} from "@/lib/mock-data"
import { Search, MapPin, Copy, Mail } from "lucide-react"

export function InviteTeammateTab() {
  const [searchId, setSearchId] = useState("")
  const [searched, setSearched] = useState(false)
  const [copied, setCopied] = useState(false)

  const normalizedId = searchId.trim().toUpperCase()
  const found = searched ? MOCK_PLAYERS_BY_ARENA_ID[normalizedId] : null
  const foundRank = found ? getRank(found.elo) : null

  function handleCopy() {
    navigator.clipboard.writeText(CURRENT_PLAYER_ARENA_ID)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <div
        className="rounded-xl p-6 border border-border flex flex-col gap-5"
        style={{ backgroundColor: "#12121f" }}
      >
        <h2 className="text-lg font-bold font-[var(--font-rajdhani)] text-foreground uppercase tracking-wider">
          Inviter votre coequipier
        </h2>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-text-secondary">Entrez l&apos;ID de votre coequipier</label>
          <div className="flex gap-2">
            <input
              value={searchId}
              onChange={(e) => setSearchId(e.target.value.toUpperCase())}
              placeholder="PA-XXXXXXXX"
              className="flex-1 h-10 px-3 rounded-lg text-sm font-mono outline-none"
              style={{
                backgroundColor: "#0d0d1a",
                border: "1px solid rgba(0,229,160,0.4)",
                color: "#00e5a0",
              }}
            />
            <button
              type="button"
              onClick={() => setSearched(true)}
              className="h-10 px-4 rounded-lg text-sm font-bold flex items-center gap-2 shrink-0"
              style={{ backgroundColor: "#00e5a0", color: "#070710" }}
            >
              <Search className="h-4 w-4" />
              Rechercher
            </button>
          </div>
        </div>

        {searched && (
          <>
            <div className="h-px" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
            <p className="text-xs text-text-tertiary uppercase tracking-wider">Resultat</p>
            {found && foundRank ? (
              <div
                className="rounded-xl p-4 border flex flex-col gap-4"
                style={{ backgroundColor: "#1a1a2e", borderColor: "rgba(255,255,255,0.08)" }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="h-14 w-14 rounded-xl shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${found.avatarGradient[0]}, ${found.avatarGradient[1]})`,
                    }}
                  />
                  <div>
                    <p className="text-base font-bold text-foreground">{found.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <RankBadge elo={found.elo} size="sm" />
                      <span className="text-sm font-bold tabular-nums" style={{ color: foundRank.color }}>
                        {found.elo} Elo
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" /> {found.city}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full h-10 rounded-lg text-sm font-bold font-[var(--font-rajdhani)] flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#00e5a0", color: "#070710" }}
                >
                  <Mail className="h-4 w-4" />
                  Envoyer une invitation
                </button>
              </div>
            ) : (
              <p className="text-sm text-destructive">Aucun joueur trouve pour cet ID. Essayez PA-MP4420</p>
            )}
          </>
        )}
      </div>

      <div
        className="rounded-xl p-5 border border-border flex flex-col gap-3"
        style={{ backgroundColor: "#12121f" }}
      >
        <p className="text-xs text-text-secondary">OU partagez votre propre ID</p>
        <p className="text-[10px] text-text-tertiary">
          Envoyez cet ID a votre coequipier pour qu&apos;il vous trouve.
        </p>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <span className="text-lg font-bold font-[var(--font-orbitron)] text-primary tracking-wider">
            {CURRENT_PLAYER_ARENA_ID}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="h-9 px-4 rounded-lg text-xs font-bold flex items-center gap-2"
            style={{
              border: "1px solid rgba(0,229,160,0.3)",
              color: "#00e5a0",
              backgroundColor: "rgba(0,229,160,0.08)",
            }}
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? "Copie !" : "Copier l'ID"}
          </button>
        </div>
      </div>
    </div>
  )
}
