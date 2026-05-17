"use client"

import { useState } from "react"
import { Topbar } from "@/components/topbar"
import { RankBadge } from "@/components/rank-badge"
import { EloBar } from "@/components/elo-bar"
import { RANKS, CURRENT_PLAYER, getRank, getRankProgress } from "@/lib/mock-data"

export default function RanksPage() {
  const [selectedRank, setSelectedRank] = useState<(typeof RANKS)[number] | null>(null)
  const currentRank = getRank(CURRENT_PLAYER.elo)

  // Fake player % distribution
  const playerDistribution: Record<string, number> = {
    Cuivre: 25, Bronze: 22, Argent: 18, Gold: 14, Platine: 9,
    Diamant: 5, Emeraude: 3, Rubis: 2, Champion: 1.5, Elite: 0.5,
  }

  return (
    <>
      <Topbar title="Systeme de Rangs" />

      <div className="p-6 flex flex-col gap-8">
        {/* Rank Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {RANKS.map((rank) => {
            const isCurrent = rank.name === currentRank.name
            const isSelected = selectedRank?.name === rank.name

            return (
              <button
                key={rank.name}
                onClick={() => setSelectedRank(isSelected ? null : rank)}
                className="relative rounded-xl p-5 flex flex-col items-center gap-3 transition-all duration-300 hover:-translate-y-1 border group cursor-pointer"
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
                    className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: rank.color, color: "#070710" }}
                  >
                    Mon rang
                  </span>
                )}
                <RankBadge elo={rank.min} size="lg" />
                <span
                  className="text-sm font-bold font-[var(--font-rajdhani)] uppercase tracking-wider"
                  style={{ color: rank.color }}
                >
                  {rank.name}
                </span>
                <span className="text-[10px] text-text-tertiary tabular-nums">
                  {rank.min}+ Elo
                </span>
              </button>
            )
          })}
        </div>

        {/* Detail panel */}
        {selectedRank && (
          <div
            className="rounded-xl p-6 border transition-all duration-300"
            style={{
              backgroundColor: "#12121f",
              borderColor: `${selectedRank.color}40`,
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex items-center gap-4">
                <RankBadge elo={selectedRank.min} size="lg" showLabel />
                <div>
                  <h2
                    className="text-2xl font-bold font-[var(--font-rajdhani)]"
                    style={{ color: selectedRank.color }}
                  >
                    {selectedRank.name}
                  </h2>
                  <p className="text-sm text-text-secondary mt-1">
                    {selectedRank.description}
                  </p>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-3 md:ml-8">
                {selectedRank.name === currentRank.name && (
                  <EloBar elo={CURRENT_PLAYER.elo} />
                )}
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="rounded-xl p-5 border"
            style={{ backgroundColor: "#12121f", borderColor: "rgba(0,229,160,0.2)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(0,229,160,0.15)" }}>
                <span className="text-primary font-bold text-sm">+</span>
              </div>
              <h3 className="text-sm font-semibold font-[var(--font-rajdhani)] text-primary uppercase">
                Gagner vs plus fort
              </h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Battre une equipe avec un Elo superieur rapporte plus de points.
              Plus la difference est grande, plus le gain est eleve. Recompense le courage et le depassement.
            </p>
          </div>

          <div
            className="rounded-xl p-5 border"
            style={{ backgroundColor: "#12121f", borderColor: "rgba(255,61,113,0.2)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(255,61,113,0.15)" }}>
                <span className="text-destructive font-bold text-sm">-</span>
              </div>
              <h3 className="text-sm font-semibold font-[var(--font-rajdhani)] text-destructive uppercase">
                Perdre vs plus faible
              </h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              {"Perdre contre une equipe moins bien classee coute cher. La perte est proportionnelle a l'ecart d'Elo. Chaque match compte."}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
