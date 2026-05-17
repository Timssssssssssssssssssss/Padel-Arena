"use client"
 
import { useState } from "react"
import { Topbar } from "@/components/topbar"
import { RankBadge } from "@/components/rank-badge"
import { EloBar } from "@/components/elo-bar"
import { RANKS, CURRENT_PLAYER, getRank, getRankProgress } from "@/lib/mock-data"
 
export default function RanksPage() {
  const [selectedRank, setSelectedRank] = useState<(typeof RANKS)[number] | null>(null)
  const currentRank = getRank(CURRENT_PLAYER.elo)
 
  const playerDistribution: Record<string, number> = {
    Cuivre: 25, Bronze: 22, Argent: 18, Gold: 14, Platine: 9,
    Diamant: 5, Emeraude: 3, Rubis: 2, Champion: 1.5, Elite: 0.5,
  }
 
  return (
    <>
      <Topbar title="Système de Rangs" />
 
      <div className="p-4 flex flex-col gap-6">
        {/* Rank Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {RANKS.map((rank) => {
            const isCurrent = rank.name === currentRank.name
            const isSelected = selectedRank?.name === rank.name
 
            return (
              <button
                key={rank.name}
                onClick={() => setSelectedRank(isSelected ? null : rank)}
                className="relative rounded-xl p-3 flex flex-col items-center gap-2 transition-all duration-300 hover:-translate-y-1 border cursor-pointer"
                style={{
                  backgroundColor: "#12121f",
                  borderColor: isCurrent ? rank.color : isSelected ? `${rank.color}60` : "rgba(255,255,255,0.07)",
                  boxShadow: isCurrent
                    ? `0 0 20px ${rank.color}30, inset 0 0 20px ${rank.color}08`
                    : isSelected
                      ? `0 0 15px ${rank.color}20`
                      : "none",
                }}
              >
                {isCurrent && (
                  <span
                    className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap"
                    style={{ backgroundColor: rank.color, color: "#070710" }}
                  >
                    Mon rang
                  </span>
                )}
                <RankBadge elo={rank.min} size="md" />
                <span
                  className="text-xs font-bold font-[var(--font-rajdhani)] uppercase tracking-wide text-center w-full leading-tight"
                  style={{
                    color: rank.color,
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    hyphens: "auto",
                  }}
                >
                  {rank.name}
                </span>
                <span className="text-[9px] text-text-tertiary tabular-nums">
                  {rank.min}+ Elo
                </span>
              </button>
            )
          })}
        </div>
 
        {/* Detail panel */}
        {selectedRank && (
          <div
            className="rounded-xl p-4 border transition-all duration-300"
            style={{
              backgroundColor: "#12121f",
              borderColor: `${selectedRank.color}40`,
            }}
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <RankBadge elo={selectedRank.min} size="md" />
                <div className="flex-1 min-w-0">
                  <h2
                    className="text-xl font-bold font-[var(--font-rajdhani)] truncate"
                    style={{ color: selectedRank.color }}
                  >
                    {selectedRank.name}
                  </h2>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                    {selectedRank.description}
                  </p>
                </div>
              </div>
 
              <div className="flex flex-col gap-2">
                {selectedRank.name === currentRank.name && (
                  <EloBar elo={CURRENT_PLAYER.elo} />
                )}
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: selectedRank.color }}
                  />
                  <span className="text-xs text-text-secondary">
                    {playerDistribution[selectedRank.name]}% des joueurs
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
 
        {/* Formula cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            className="rounded-xl p-4 border"
            style={{ backgroundColor: "#12121f", borderColor: "rgba(0,229,160,0.2)" }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(0,229,160,0.15)" }}>
                <span className="text-primary font-bold text-sm">+</span>
              </div>
              <h3 className="text-sm font-semibold font-[var(--font-rajdhani)] text-primary uppercase">
                Gagner vs plus fort
              </h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Battre une équipe avec un Elo supérieur rapporte plus de points. Plus la différence est grande, plus le gain est élevé.
            </p>
          </div>
 
          <div
            className="rounded-xl p-4 border"
            style={{ backgroundColor: "#12121f", borderColor: "rgba(255,61,113,0.2)" }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(255,61,113,0.15)" }}>
                <span className="text-destructive font-bold text-sm">-</span>
              </div>
              <h3 className="text-sm font-semibold font-[var(--font-rajdhani)] text-destructive uppercase">
                Perdre vs plus faible
              </h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Perdre contre une équipe moins bien classée coûte cher. La perte est proportionnelle à l'écart d'Elo.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}