"use client"

import { useState, useMemo } from "react"
import { Topbar } from "@/components/topbar"
import { RankBadge } from "@/components/rank-badge"
import { MatchRow } from "@/components/match-row"
import { CURRENT_TEAM, RECENT_MATCHES, PADEL_CLUBS, TIME_SLOTS, getRank } from "@/lib/mock-data"
import { Swords, Flame, Star, ChevronDown, CreditCard, Dices, Building2, Calendar, Clock } from "lucide-react"
import { CreateTeamTab } from "@/components/equipe/create-team-tab"
import { InviteTeammateTab } from "@/components/equipe/invite-teammate-tab"

import { COURT_TOTAL, CLUB_SHARE, PLATFORM_FEE } from "@/lib/pricing"

const BET_PRESETS = [10, 20, 30, 40]

type EquipeTab = "team" | "create" | "invite"

const EQUIPE_TABS: { id: EquipeTab; label: string }[] = [
  { id: "team", label: "Mon Équipe" },
  { id: "create", label: "➕ Créer" },
  { id: "invite", label: "🔍 Inviter" },
]

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState<EquipeTab>("team")
  const team = CURRENT_TEAM
  const rank = getRank(team.elo)

  // Reservation state
  const [selectedClub, setSelectedClub] = useState(PADEL_CLUBS[0])
  const [clubDropdownOpen, setClubDropdownOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [selectedCourt, setSelectedCourt] = useState(1)

  // Bet state
  const [betEnabled, setBetEnabled] = useState(false)
  const [betAmount, setBetAmount] = useState("")
  const [betCustom, setBetCustom] = useState("")

  const betValue = betEnabled
    ? (betAmount === "custom" ? (Number(betCustom) || 0) : (Number(betAmount) || 0))
    : 0
  const potentialWinnings = betValue > 0 ? Math.round(betValue * 2 * 0.9 * 100) / 100 : 0
  const totalToPay = COURT_TOTAL + betValue

  const dates = useMemo(() => {
    const result: { label: string; value: string; disabled: boolean }[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    for (let i = 0; i < 30; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() + i)
      const dayName = d.toLocaleDateString("fr-FR", { weekday: "short" })
      const dayNum = d.getDate()
      const month = d.toLocaleDateString("fr-FR", { month: "short" })
      result.push({
        label: `${dayName} ${dayNum} ${month}`,
        value: d.toISOString().split("T")[0],
        disabled: false,
      })
    }
    return result
  }, [])

  return (
    <>
      <Topbar title="Mon Equipe" />

      <div className="p-6 flex flex-col gap-6">
        <div className="flex flex-wrap gap-2">
          {EQUIPE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2 rounded-full text-xs font-bold font-[var(--font-rajdhani)] transition-all"
              style={{
                backgroundColor: activeTab === tab.id ? "#00e5a0" : "transparent",
                color: activeTab === tab.id ? "#070710" : "#606080",
                border: activeTab === tab.id ? "none" : "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "create" && <CreateTeamTab />}
        {activeTab === "invite" && <InviteTeammateTab />}

        {activeTab === "team" && (
        <>
        {/* Team Hero */}
        <div
          className="rounded-xl p-6 border border-border relative overflow-hidden"
          style={{ backgroundColor: "#12121f" }}
        >
          <div
            className="absolute inset-0 opacity-5"
            style={{
              background: `radial-gradient(ellipse at 20% 50%, ${rank.color}, transparent 70%)`,
            }}
          />
          <div className="relative flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex items-center gap-4">
              <span className="text-6xl">{team.emoji}</span>
              <div>
                <h2 className="text-2xl font-bold font-[var(--font-orbitron)] text-foreground tracking-tight">
                  {team.name}
                </h2>
                <div className="flex items-center gap-2 mt-1.5">
                  <RankBadge elo={team.elo} size="md" showLabel />
                  <span className="text-sm text-text-secondary tabular-nums">{team.elo} Elo</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 md:ml-auto">
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold font-[var(--font-rajdhani)] text-primary">{team.wins}</span>
                <span className="text-[10px] text-text-tertiary uppercase tracking-wider">Victoires</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold font-[var(--font-rajdhani)] text-text-secondary">{team.draws}</span>
                <span className="text-[10px] text-text-tertiary uppercase tracking-wider">Defaites</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <span className="text-xl font-bold font-[var(--font-rajdhani)] text-warning">{team.streak}</span>
                  <Flame className="h-4 w-4 text-warning" />
                </div>
                <span className="text-[10px] text-text-tertiary uppercase tracking-wider">Streak</span>
              </div>
            </div>
          </div>
        </div>

        {/* Members */}
        <div>
          <h3 className="text-sm font-semibold font-[var(--font-rajdhani)] text-foreground uppercase tracking-wider mb-3 px-1">
            Membres
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {team.members.map((member) => {
              const memberRank = getRank(member.elo)
              return (
                <div
                  key={member.id}
                  className="rounded-xl p-4 border border-border hover:border-primary/20 transition-all"
                  style={{ backgroundColor: "#12121f" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-12 w-12 rounded-lg shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${member.avatarGradient[0]}, ${member.avatarGradient[1]})`,
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold font-[var(--font-rajdhani)] text-foreground">
                          {member.name}
                        </span>
                        <RankBadge elo={member.elo} size="sm" />
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs font-bold tabular-nums" style={{ color: memberRank.color }}>
                          {member.elo} Elo
                        </span>
                        <span className="text-xs text-text-secondary">{member.winRate}% WR</span>
                        <span className="text-xs text-warning flex items-center gap-0.5">
                          <Star className="h-3 w-3" /> {member.mvpCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Match History Table */}
        <div className="rounded-xl border border-border overflow-hidden" style={{ backgroundColor: "#12121f" }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold font-[var(--font-rajdhani)] text-foreground uppercase tracking-wider">
              Historique des matchs
            </h3>
            <Swords className="h-4 w-4 text-primary" />
          </div>
          <div className="divide-y divide-border/50">
            {RECENT_MATCHES.map((match) => (
              <MatchRow
                key={match.id}
                opponent={match.opponent}
                opponentEmoji={match.opponentEmoji}
                result={match.result}
                score={match.score}
                eloDelta={match.eloDelta}
                date={match.date}
              />
            ))}
          </div>
        </div>

        {/* ====== RESERVATION SECTION ====== */}
        <div className="rounded-xl border border-border overflow-hidden" style={{ backgroundColor: "#12121f" }}>
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
            <Building2 className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold font-[var(--font-rajdhani)] text-foreground uppercase tracking-wider">
              Reserver un terrain
            </h3>
          </div>

          <div className="p-5 flex flex-col gap-5">
            {/* Club selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-text-secondary flex items-center gap-1.5">
                <Building2 className="h-3 w-3" /> Club
              </label>
              <div className="relative">
                <button
                  onClick={() => setClubDropdownOpen(!clubDropdownOpen)}
                  className="flex items-center justify-between w-full h-10 px-3 rounded-lg border border-border text-sm font-medium text-foreground hover:border-primary/40 transition-colors"
                  style={{ backgroundColor: "#0d0d1a" }}
                >
                  <span>{selectedClub.name}</span>
                  <ChevronDown className={`h-3.5 w-3.5 text-text-tertiary transition-transform ${clubDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {clubDropdownOpen && (
                  <div className="absolute top-full mt-1 left-0 w-full rounded-lg border border-border shadow-xl z-50" style={{ backgroundColor: "#12121f" }}>
                    {PADEL_CLUBS.map((club) => (
                      <button
                        key={club.id}
                        onClick={() => { setSelectedClub(club); setClubDropdownOpen(false) }}
                        className="w-full text-left px-3 py-2.5 text-sm hover:bg-primary/10 transition-colors flex items-center justify-between"
                        style={{ color: club.id === selectedClub.id ? "#00e5a0" : "#a0a0c0" }}
                      >
                        <div>
                          <span className="block">{club.name}</span>
                          <span className="text-[10px] text-text-tertiary">{club.city} - {club.courts} courts</span>
                        </div>
                        <span className="text-xs font-bold">{club.pricePerHour} €/h</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Date picker */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-text-secondary flex items-center gap-1.5">
                <Calendar className="h-3 w-3" /> Date
              </label>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {dates.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => !d.disabled && setSelectedDate(d.value)}
                    disabled={d.disabled}
                    className="px-3 py-2 rounded-lg text-xs font-medium shrink-0 transition-all disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: d.disabled
                        ? "#0d0d1a"
                        : selectedDate === d.value
                          ? "rgba(0,229,160,0.15)"
                          : "#0d0d1a",
                      borderWidth: 1,
                      borderStyle: "solid",
                      borderColor: d.disabled
                        ? "rgba(255,255,255,0.04)"
                        : selectedDate === d.value
                          ? "rgba(0,229,160,0.4)"
                          : "rgba(255,255,255,0.07)",
                      color: d.disabled ? "#404060" : selectedDate === d.value ? "#00e5a0" : "#a0a0c0",
                      opacity: d.disabled ? 0.5 : 1,
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time slot grid */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-text-secondary flex items-center gap-1.5">
                <Clock className="h-3 w-3" /> Creneau horaire
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => slot.available && setSelectedSlot(slot.time)}
                    disabled={!slot.available}
                    className="h-10 rounded-lg text-xs font-bold tabular-nums transition-all disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: !slot.available
                        ? "rgba(255,61,113,0.1)"
                        : selectedSlot === slot.time
                          ? "rgba(0,229,160,0.2)"
                          : "#0d0d1a",
                      borderWidth: 1,
                      borderStyle: "solid",
                      borderColor: !slot.available
                        ? "rgba(255,61,113,0.3)"
                        : selectedSlot === slot.time
                          ? "rgba(0,229,160,0.5)"
                          : "rgba(255,255,255,0.07)",
                      color: !slot.available
                        ? "#ff3d71"
                        : selectedSlot === slot.time
                          ? "#00e5a0"
                          : "#a0a0c0",
                    }}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: "rgba(0,229,160,0.3)" }} />
                  <span className="text-[10px] text-text-tertiary">Disponible</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: "rgba(255,61,113,0.3)" }} />
                  <span className="text-[10px] text-text-tertiary">Occupe</span>
                </div>
              </div>
            </div>

            {/* Court selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-text-secondary">Court</label>
              <div className="flex gap-2">
                {Array.from({ length: selectedClub.courts }, (_, i) => i + 1).map((court) => (
                  <button
                    key={court}
                    onClick={() => setSelectedCourt(court)}
                    className="h-9 px-4 rounded-lg text-xs font-bold transition-all"
                    style={{
                      backgroundColor: selectedCourt === court ? "rgba(0,229,160,0.15)" : "#0d0d1a",
                      borderWidth: 1,
                      borderStyle: "solid",
                      borderColor: selectedCourt === court ? "rgba(0,229,160,0.4)" : "rgba(255,255,255,0.07)",
                      color: selectedCourt === court ? "#00e5a0" : "#a0a0c0",
                    }}
                  >
                    Court {court}
                  </button>
                ))}
              </div>
            </div>

            {/* ====== RESERVATION DE BASE ====== */}
            <div className="rounded-lg p-4 border border-border" style={{ backgroundColor: "#0d0d1a" }}>
              <h4 className="text-xs font-bold font-[var(--font-rajdhani)] text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <CreditCard className="h-3.5 w-3.5 text-primary" />
                Reservation de base
              </h4>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">Terrain (2 joueurs)</span>
                  <span className="text-sm font-bold text-foreground tabular-nums">{COURT_TOTAL} €</span>
                </div>
                <div className="pl-3 flex flex-col gap-1 border-l" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px]" style={{ color: "#a0a0c0" }}>Club recoit</span>
                    <span className="text-xs tabular-nums" style={{ color: "#a0a0c0" }}>{CLUB_SHARE} € (90%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px]" style={{ color: "#00e5a0" }}>Padel Arena</span>
                    <span className="text-xs tabular-nums" style={{ color: "#00e5a0" }}>{PLATFORM_FEE} € (10%)</span>
                  </div>
                </div>
                <div className="h-px my-1" style={{ backgroundColor: "rgba(255,255,255,0.07)" }} />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">Total</span>
                  <span className="text-sm font-bold text-primary tabular-nums">{COURT_TOTAL} €</span>
                </div>
              </div>
            </div>

            {/* ====== BETTING SECTION ====== */}
            <div
              className="rounded-lg border overflow-hidden"
              style={{
                borderColor: betEnabled ? "rgba(255,170,0,0.3)" : "rgba(255,255,255,0.07)",
                backgroundColor: betEnabled ? "rgba(255,170,0,0.03)" : "#0d0d1a",
              }}
            >
              <button
                onClick={() => setBetEnabled(!betEnabled)}
                className="w-full flex items-center gap-3 px-4 py-3 transition-colors hover:bg-elevated/30"
              >
                <Dices className="h-5 w-5 text-warning" />
                <span className="text-sm font-bold font-[var(--font-rajdhani)] uppercase tracking-wider text-warning">
                  Ajouter un pari (optionnel)
                </span>
                <div className="ml-auto">
                  <div
                    className="w-10 h-5 rounded-full transition-colors relative"
                    style={{ backgroundColor: betEnabled ? "rgba(255,170,0,0.3)" : "rgba(255,255,255,0.1)" }}
                  >
                    <div
                      className="absolute top-0.5 h-4 w-4 rounded-full transition-all"
                      style={{
                        backgroundColor: betEnabled ? "#ffaa00" : "#606080",
                        left: betEnabled ? "22px" : "2px",
                      }}
                    />
                  </div>
                </div>
              </button>

              {betEnabled && (
                <div className="px-4 pb-4 flex flex-col gap-3 border-t" style={{ borderColor: "rgba(255,170,0,0.15)" }}>
                  <p className="text-xs text-text-secondary pt-3">Mise par equipe :</p>

                  {/* Bet preset pills */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {BET_PRESETS.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => { setBetAmount(String(amount)); setBetCustom("") }}
                        className="px-4 py-2 rounded-full text-xs font-bold transition-all"
                        style={{
                          backgroundColor: betAmount === String(amount) ? "rgba(255,170,0,0.2)" : "rgba(255,255,255,0.03)",
                          borderWidth: 1,
                          borderStyle: "solid",
                          borderColor: betAmount === String(amount) ? "rgba(255,170,0,0.5)" : "rgba(255,255,255,0.07)",
                          color: betAmount === String(amount) ? "#ffaa00" : "#a0a0c0",
                        }}
                      >
                        {amount} €
                      </button>
                    ))}
                    <button
                      onClick={() => setBetAmount("custom")}
                      className="px-4 py-2 rounded-full text-xs font-bold transition-all"
                      style={{
                        backgroundColor: betAmount === "custom" ? "rgba(255,170,0,0.2)" : "rgba(255,255,255,0.03)",
                        borderWidth: 1,
                        borderStyle: "solid",
                        borderColor: betAmount === "custom" ? "rgba(255,170,0,0.5)" : "rgba(255,255,255,0.07)",
                        color: betAmount === "custom" ? "#ffaa00" : "#a0a0c0",
                      }}
                    >
                      Personnalise
                    </button>
                  </div>

                  {betAmount === "custom" && (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={betCustom}
                        onChange={(e) => setBetCustom(e.target.value)}
                        placeholder="Montant"
                        min="1"
                        className="w-28 h-8 rounded-md px-3 text-sm font-bold text-right bg-background border border-border text-foreground placeholder:text-text-tertiary focus:border-warning focus:outline-none tabular-nums"
                      />
                      <span className="text-xs text-text-secondary">€</span>
                    </div>
                  )}

                  <div className="text-xs text-text-tertiary">
                    Commission Padel Arena : 10% sur les gains
                  </div>

                  {betValue > 0 && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-secondary">Si vous gagnez</span>
                        <span className="text-sm font-bold tabular-nums" style={{ color: "#00e5a0" }}>
                          +{potentialWinnings} € net
                        </span>
                      </div>
                      <p className="text-[10px]" style={{ color: "#ff3d71" }}>
                        Si vous perdez, la mise de {betValue} € est perdue.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* ====== FINAL RECAP ====== */}
            <div
              className="rounded-lg p-4 border"
              style={{ backgroundColor: "#0d0d1a", borderColor: "rgba(0,229,160,0.2)" }}
            >
              <h4 className="text-xs font-bold font-[var(--font-rajdhani)] text-foreground uppercase tracking-wider mb-3">
                Recapitulatif final
              </h4>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "#a0a0c0" }}>Terrain equipe (2 joueurs)</span>
                  <span className="text-sm text-foreground tabular-nums">{COURT_TOTAL} €</span>
                </div>
                <p className="text-[10px] pl-1" style={{ color: "#606080" }}>
                  {CLUB_SHARE} € → club / {PLATFORM_FEE} € → Padel Arena
                </p>
                {betEnabled && betValue > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-warning">Pari optionnel</span>
                    <span className="text-sm text-warning tabular-nums">{betValue} €</span>
                  </div>
                )}
                <div className="h-px my-1" style={{ backgroundColor: "rgba(255,255,255,0.07)" }} />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground uppercase">Total a payer</span>
                  <span className="text-lg font-bold font-[var(--font-rajdhani)] text-primary tabular-nums">
                    {totalToPay} €
                  </span>
                </div>
                {betEnabled && betValue > 0 && (
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[11px] text-text-secondary">{"Gains potentiels si victoire"}</span>
                    <span className="text-sm font-bold tabular-nums" style={{ color: "#00e5a0" }}>
                      {potentialWinnings} € net
                    </span>
                  </div>
                )}
                {betEnabled && betValue > 0 && (
                  <p className="text-[10px] text-text-tertiary">{"(apres 10% commission Padel Arena)"}</p>
                )}
              </div>
            </div>

            {/* CTA */}
            <button
              disabled={!selectedDate || !selectedSlot}
              className="w-full h-12 rounded-lg text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <CreditCard className="h-4.5 w-4.5" />
              Confirmer et payer via Stripe
            </button>
          </div>
        </div>
        </>
        )}
      </div>
    </>
  )
}
